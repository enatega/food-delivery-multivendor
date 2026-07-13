import React from 'react'
import { Image } from 'react-native'
import { useCachedMediaUri } from '../utils/mediaCache'

export default function CachedImage({ source, ...props }) {
  const remoteUrl = source && typeof source === 'object' ? source.uri : null
  const cachedUri = useCachedMediaUri(remoteUrl, 'image')

  return <Image {...props} source={remoteUrl && cachedUri ? { ...source, uri: cachedUri } : source} />
}
