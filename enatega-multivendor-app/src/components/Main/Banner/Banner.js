import React, { useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import HomeBanner from '../../../singlevendor/components/Home/HomeBanner'
import { BANNER_PARAMETERS } from '../../../utils/banner-routes'
import { normalizeMediaUrl } from '../../../utils/mediaUrl'

const resolveMultivendorMedia = (url) => normalizeMediaUrl(url)

// Multivendor Discovery uses the single-vendor carousel (gutter, peeking next
// slide, pagination) and only supplies its own banner routing.
const Banner = ({ banners }) => {
  const navigation = useNavigation()

  const onPressBanner = useCallback(
    (banner) => {
      if (banner?.action === 'Navigate Specific Restaurant') {
        navigation.navigate('Restaurant', { _id: banner.screen })
        return
      }

      const route = BANNER_PARAMETERS[banner?.screen]
      if (!route?.name) return
      navigation.navigate(route.name, {
        selectedType: route.selectedType ?? 'restaurant',
        queryType: route.queryType ?? 'restaurant'
      })
    },
    [navigation]
  )

  if (!banners?.length) return null

  return <HomeBanner banners={banners} onPress={onPressBanner} resolveMedia={resolveMultivendorMedia} />
}

export default React.memo(Banner)
