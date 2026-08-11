import * as FileSystem from 'expo-file-system'
import * as Crypto from 'expo-crypto'
import { useEffect, useMemo, useState } from 'react'
import { isSignedUrlExpired, stripQueryAndHash } from './signedMediaUrl'

const CACHE_DIR = `${FileSystem.cacheDirectory}signed-media-cache-v2/`
const pendingDownloads = new Map()
const resolvedUriCache = new Map()

function setResolvedUri(normalized, uri, kind) {
  resolvedUriCache.set(normalized, { uri, kind })
}

function getFileExtension(url = '', fallback = 'bin') {
  const clean = stripQueryAndHash(url)
  const filename = clean.split('/').pop() || ''
  const parts = filename.split('.')
  const ext = parts.length > 1 ? parts.pop() : fallback
  return (ext || fallback).toLowerCase()
}

async function ensureCacheDir() {
  const info = await FileSystem.getInfoAsync(CACHE_DIR)
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true })
  }
}

export async function getCachedMediaUri(remoteUrl, type = 'file') {
  if (!remoteUrl || remoteUrl.startsWith('file://')) return remoteUrl

  const normalized = stripQueryAndHash(remoteUrl)
  const memoized = resolvedUriCache.get(normalized)
  const ext = getFileExtension(remoteUrl, type === 'image' ? 'jpg' : 'mp4')
  const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, normalized)
  const localUri = `${CACHE_DIR}${hash}.${ext}`

  await ensureCacheDir()

  if (memoized?.kind === 'local') {
    const cachedFileInfo = await FileSystem.getInfoAsync(memoized.uri)
    if (cachedFileInfo.exists && cachedFileInfo.size && cachedFileInfo.size > 0) {
      return memoized.uri
    }
    resolvedUriCache.delete(normalized)
  }

  if (
    memoized?.kind === 'remote' &&
    memoized.uri === remoteUrl &&
    !isSignedUrlExpired(remoteUrl)
  ) {
    return memoized.uri
  }

  const fileInfo = await FileSystem.getInfoAsync(localUri)
  if (fileInfo.exists && fileInfo.size && fileInfo.size > 0) {
    setResolvedUri(normalized, localUri, 'local')
    return localUri
  }

  if (isSignedUrlExpired(remoteUrl)) {
    return remoteUrl
  }

  const pending = pendingDownloads.get(normalized)
  if (pending) {
    const uri = await pending.promise
    if (uri.startsWith('file://') || pending.remoteUrl === remoteUrl) return uri

    // A newer signature arrived while an expired download was finishing.
    return getCachedMediaUri(remoteUrl, type)
  }

  const downloadPromise = (async () => {
    try {
      const result = await FileSystem.downloadAsync(remoteUrl, localUri)
      if (result.status === 200) {
        setResolvedUri(normalized, result.uri, 'local')
        return result.uri
      }
      await FileSystem.deleteAsync(localUri, { idempotent: true })
      setResolvedUri(normalized, remoteUrl, 'remote')
      return remoteUrl
    } catch (_e) {
      await FileSystem.deleteAsync(localUri, { idempotent: true })
      setResolvedUri(normalized, remoteUrl, 'remote')
      return remoteUrl
    } finally {
      pendingDownloads.delete(normalized)
    }
  })()

  pendingDownloads.set(normalized, { remoteUrl, promise: downloadPromise })
  return downloadPromise
}

export function useCachedMediaUri(remoteUrl, type = 'image') {
  const key = useMemo(() => stripQueryAndHash(remoteUrl || ''), [remoteUrl])
  const [source, setSource] = useState({
    key,
    uri: resolvedUriCache.get(key)?.uri || remoteUrl
  })

  useEffect(() => {
    let isMounted = true

    if (!remoteUrl) {
      setSource({ key, uri: remoteUrl })
      return
    }

    setSource((current) => {
      const preferredUri = resolvedUriCache.get(key)?.uri || remoteUrl
      if (current.key !== key) return { key, uri: preferredUri }
      return current.uri?.startsWith('file://') ? current : { key, uri: preferredUri }
    })

    getCachedMediaUri(remoteUrl, type).then((uri) => {
      if (!isMounted) return

      setSource({ key, uri })
    })

    return () => {
      isMounted = false
    }
  }, [remoteUrl, type, key])

  return source.uri
}
