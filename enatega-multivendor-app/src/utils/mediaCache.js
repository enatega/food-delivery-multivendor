import * as FileSystem from 'expo-file-system'
import * as Crypto from 'expo-crypto'

const CACHE_DIR = `${FileSystem.cacheDirectory}banner-media-cache/`
const pendingDownloads = new Map()

function stripQueryAndHash(url = '') {
  return url.split('#')[0].split('?')[0]
}

function getFileExtension(url = '', fallback = 'bin') {
  const clean = stripQueryAndHash(url)
  const parts = clean.split('.')
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

  if (pendingDownloads.has(normalized)) {
    return pendingDownloads.get(normalized)
  }

  const downloadPromise = (async () => {
    try {
      const result = await FileSystem.downloadAsync(remoteUrl, localUri)
      if (result.status === 200) return result.uri
      return remoteUrl
    } catch (_e) {
      return remoteUrl
    } finally {
      pendingDownloads.delete(normalized)
    }
  })()

  pendingDownloads.set(normalized, downloadPromise)
  return downloadPromise
}
