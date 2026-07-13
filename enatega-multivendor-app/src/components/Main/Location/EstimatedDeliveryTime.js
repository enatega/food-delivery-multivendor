import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from 'react-i18next'
import { useLazyQuery } from '@apollo/client'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { scale } from '../../../utils/scaling'
import { GET_ESTIMATED_DELIVERY_TIME } from '../../../singlevendor/apollo/queries'

const CACHE_PREFIX = 'estimated_delivery_time'

const buildLocationKey = (location) => {
  if (!location) return null
  if (location?._id) return `${CACHE_PREFIX}:${location._id}`
  const lat = location?.latitude ?? location?.location?.coordinates?.[1]
  const lng = location?.longitude ?? location?.location?.coordinates?.[0]
  if (lat != null && lng != null) return `${CACHE_PREFIX}:${lat},${lng}`
  return null
}

const EstimatedDeliveryTime = ({ location }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  const [loading, setLoading] = useState(false)
  const [timeRange, setTimeRange] = useState(null)
  const mountedRef = useRef(true)

  const storageKey = useMemo(() => buildLocationKey(location), [location])
  const addressId = location?._id || null

  const [fetchEstimatedTime, { loading: apiLoading, error }] = useLazyQuery(
    GET_ESTIMATED_DELIVERY_TIME,
    { fetchPolicy: 'network-only' }
  )

  console.log('EstimatedDeliveryTime_render', location?._id, error)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    const loadTime = async () => {
      if (!storageKey) {
        setTimeRange(null)
        return
      }

      try {
        const cached = await AsyncStorage.getItem(storageKey)
        if (cached) {
          const parsed = JSON.parse(cached)
          if (parsed?.timeRange) {
            setTimeRange(parsed.timeRange)
            return
          }
        }

        if (!addressId) {
          setTimeRange(null)
          return
        }

        setLoading(true)
        const response = await fetchEstimatedTime({ variables: { addressId } })
        if (!mountedRef.current) return

        const serverTime = response?.data?.getEstimatedDeliveryTime
        if (serverTime) {
          setTimeRange(serverTime)
          await AsyncStorage.setItem(
            storageKey,
            JSON.stringify({ timeRange: serverTime, cachedAt: Date.now() })
          )
        } else {
          setTimeRange(null)
        }
      } catch (err) {
        setTimeRange(null)
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    }

    loadTime()
  }, [storageKey, addressId, fetchEstimatedTime])

  // No extra effect needed when using lazy query

  if (loading || apiLoading) {
    return (
      <View
        style={{
          height: scale(12),
          width: scale(70),
          borderRadius: scale(6),
          backgroundColor: currentTheme.colorBgTertiary || currentTheme.gray100,
          marginTop: scale(2)
        }}
      />
    )
  }

  return (
    <TextDefault textColor={currentTheme.fontSecondColor} H6>
      {timeRange ? `${t('estimatedDeliveryTime')}: ${timeRange}` : null}
    </TextDefault>
  )
}

export default EstimatedDeliveryTime
