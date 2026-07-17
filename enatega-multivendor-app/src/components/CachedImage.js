import React, { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { useCachedMediaUri } from '../utils/mediaCache'

export default function CachedImage({ source, ...props }) {
  const remoteUrl = source && typeof source === 'object' ? source.uri : null
  const cachedUri = useCachedMediaUri(remoteUrl, 'image')
  const [displayUri, setDisplayUri] = useState(cachedUri || remoteUrl)

  useEffect(() => {
    setDisplayUri(cachedUri || remoteUrl)
  }, [cachedUri, remoteUrl])

  const resolvedSource = remoteUrl && displayUri ? { ...source, uri: displayUri } : source

  const handleError = (event) => {
    if (displayUri?.startsWith('file://') && remoteUrl && displayUri !== remoteUrl) {
      setDisplayUri(remoteUrl)
    }

    props?.onError?.(event)
  }

  return <Image {...props} source={resolvedSource} onError={handleError} />
}
