import * as FileSystem from 'expo-file-system'
import * as Crypto from 'expo-crypto'
import { useEffect, useMemo, useState } from 'react'

const CACHE_DIR = `${FileSystem.cacheDirectory}signed-media-cache-v2/`
const pendingDownloads = new Map()

function stripQueryAndHash(url = '') {
  return url.split('#')[0].split('?')[0]
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
  const ext = getFileExtension(remoteUrl, type === 'image' ? 'jpg' : 'mp4')
  const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, normalized)
  const localUri = `${CACHE_DIR}${hash}.${ext}`

  await ensureCacheDir()

  const fileInfo = await FileSystem.getInfoAsync(localUri)
  if (fileInfo.exists && fileInfo.size && fileInfo.size > 0) {
    return localUri
  }

  if (pendingDownloads.has(remoteUrl)) {
    return pendingDownloads.get(remoteUrl)
  }

  const downloadPromise = (async () => {
    try {
      const result = await FileSystem.downloadAsync(remoteUrl, localUri)
      if (result.status === 200) return result.uri
      await FileSystem.deleteAsync(localUri, { idempotent: true })
      return remoteUrl
    } catch (_e) {
      await FileSystem.deleteAsync(localUri, { idempotent: true })
      return remoteUrl
    } finally {
      pendingDownloads.delete(remoteUrl)
    }
  })()

  pendingDownloads.set(remoteUrl, downloadPromise)
  return downloadPromise
}

export function useCachedMediaUri(remoteUrl, type = 'image') {
  const key = useMemo(() => stripQueryAndHash(remoteUrl || ''), [remoteUrl])
  const [source, setSource] = useState({ key, uri: remoteUrl })

  useEffect(() => {
    let isMounted = true

    if (!remoteUrl) {
      setSource({ key, uri: remoteUrl })
      return
    }

    setSource((current) => {
      if (current.key !== key) return { key, uri: remoteUrl }
      return current.uri?.startsWith('file://') ? current : { key, uri: remoteUrl }
    })

    getCachedMediaUri(remoteUrl, type).then((uri) => {
      if (isMounted) setSource({ key, uri })
    })

    return () => {
      isMounted = false
    }
  }, [remoteUrl, type, key])

  return source.uri
}
