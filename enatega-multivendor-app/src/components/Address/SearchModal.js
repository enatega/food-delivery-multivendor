import React, { useContext, useEffect, useState, useCallback, useRef } from 'react'
import {
  Modal,
  View,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native'
import Animated, {
  Easing as EasingNode,
  Extrapolation,
  interpolate,
  useSharedValue,
  withTiming,
  useAnimatedStyle
} from 'react-native-reanimated'
import axios from 'axios'
import useEnvVars from '../../../environment'
import CloseIcon from '../../assets/SVG/imageComponents/CloseIcon'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'
import { theme } from '../../utils/themeColors'
import TextDefault from '../Text/TextDefault/TextDefault'
import styles from './styles'

import { useTranslation } from 'react-i18next'
import { AntDesign, Ionicons } from '@expo/vector-icons'

const { height } = Dimensions.get('screen')

export default function SearchModal({
  visible = false,
  onClose = () => {},
  onSubmit = () => {}
}) {
  const { t } = useTranslation()
  const animation = useSharedValue(0)
  const { GOOGLE_MAPS_KEY } = useEnvVars()
  
  const [searchText, setSearchText] = useState('')
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const debounceTimerRef = useRef(null)
  const requestCancelTokenRef = useRef(null)

  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  // Debug logging when modal becomes visible
  useEffect(() => {
    if (visible) {
      console.log('🔍 SearchModal opened - Debug Info:', {
        hasGoogleMapsKey: !!GOOGLE_MAPS_KEY,
        keyLength: GOOGLE_MAPS_KEY ? GOOGLE_MAPS_KEY.length : 0,
        keyPrefix: GOOGLE_MAPS_KEY ? GOOGLE_MAPS_KEY.substring(0, 10) + '...' : 'undefined',
        themeValue: themeContext.ThemeValue,
        timestamp: new Date().toISOString()
      })
      
      // Reset state when modal opens
      setSearchText('')
      setPredictions([])
      setLoading(false)
      setError(null)
    }
  }, [visible, GOOGLE_MAPS_KEY, themeContext.ThemeValue])

  const marginTop = useAnimatedStyle(() => {
    return {
      marginTop: interpolate(
        animation.value,
        [0, 1],
        [height * 0.4, height * 0.06],
        Extrapolation.CLAMP
      )
    }
  })

  const borderTopLeftRadius = useAnimatedStyle(() => {
    return {
      borderTopLeftRadius: interpolate(
        animation.value,
        [0, 1],
        [30, 0],
        Extrapolation.CLAMP
      )
    }
  })

  const borderTopRightRadius = useAnimatedStyle(() => {
    return {
      borderTopRightRadius: interpolate(
        animation.value,
        [0, 1],
        [30, 0],
        Extrapolation.CLAMP
      )
    }
  })

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', _keyboardDidShow)
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', _keyboardDidHide)
  
    return () => {
      keyboardShowListener.remove()
      keyboardHideListener.remove()
      
      // Cleanup timers and requests
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      if (requestCancelTokenRef.current) {
        requestCancelTokenRef.current.cancel('Component unmounted')
      }
    }
  }, [])

  const _keyboardDidShow = () => {
    console.log('📱 Keyboard shown')
    animate()
  }

  const _keyboardDidHide = () => {
    console.log('📱 Keyboard hidden')
    animate(true)
  }

  const animate = (hide = false) => {
    withTiming(
      (animation.value = hide ? 0 : 1),
      { duration: 300 },
      { easing: EasingNode.inOut(EasingNode.ease) }
    )
  }

  const close = () => {
    console.log('🚪 SearchModal closing')
    animation.value = 0
    
    // Cleanup
    setSearchText('')
    setPredictions([])
    setLoading(false)
    setError(null)
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    if (requestCancelTokenRef.current) {
      requestCancelTokenRef.current.cancel('Modal closed')
    }
    
    onClose()
  }

  // Search for places using Google Places API
  const searchPlaces = useCallback(async (query) => {
    console.log('🔍 SearchModal: searchPlaces called with query:', query)
    
    if (!query || query.length < 2) {
      setPredictions([])
      setLoading(false)
      setError(null)
      return
    }

    if (!GOOGLE_MAPS_KEY) {
      console.error('❌ GOOGLE_MAPS_KEY is missing!')
      setError('Google Maps API key is not configured')
      setLoading(false)
      return
    }

    // Cancel previous request if exists
    if (requestCancelTokenRef.current) {
      requestCancelTokenRef.current.cancel('New search initiated')
    }

    // Create new cancel token
    const cancelToken = axios.CancelToken.source()
    requestCancelTokenRef.current = cancelToken

    setLoading(true)
    setError(null)
    
    try {
      console.log('🌐 Making API request for query:', query)
      
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/autocomplete/json',
        {
          params: {
            input: query,
            key: GOOGLE_MAPS_KEY,
            language: 'en',
            components: 'country:pk', // Restrict to Pakistan
            types: 'geocode'
          },
          timeout: 10000,
          cancelToken: cancelToken.token
        }
      )

      console.log('📍 API Response status:', response.data.status)
      
      if (response.data.status === 'OK') {
        const formattedPredictions = response.data.predictions.map((prediction) => ({
          id: prediction.place_id,
          description: prediction.description,
          placeId: prediction.place_id,
          mainText: prediction.structured_formatting?.main_text || prediction.description,
          secondaryText: prediction.structured_formatting?.secondary_text || ''
        }))
        
        console.log('✅ Found predictions:', formattedPredictions.length)
        setPredictions(formattedPredictions)
        setError(null)
      } else if (response.data.status === 'ZERO_RESULTS') {
        console.log('🔍 No results found for query:', query)
        setPredictions([])
        setError(null)
      } else {
        console.error('❌ API Error:', response.data.status, response.data.error_message)
        setPredictions([])
        setError(response.data.error_message || 'Search failed')
        
        if (response.data.status === 'REQUEST_DENIED') {
          Alert.alert(
            'API Error', 
            'Google Places API access denied. Please check your API key configuration.'
          )
        }
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('🔄 Request cancelled:', error.message)
        return // Don't update state for cancelled requests
      }
      
      console.error('🚨 Error searching places:', error)
      setPredictions([])
      
      if (error.code === 'ECONNABORTED') {
        setError('Request timed out')
      } else if (error.response) {
        console.error('API Error Response:', error.response.data)
        setError('Search service unavailable')
      } else if (error.request) {
        setError('Network error - check your connection')
      } else {
        setError('Search failed')
      }
    } finally {
      setLoading(false)
      // Clear the cancel token reference if this was the current request
      if (requestCancelTokenRef.current === cancelToken) {
        requestCancelTokenRef.current = null
      }
    }
  }, [GOOGLE_MAPS_KEY])

  // Get place details
  const getPlaceDetails = useCallback(async (placeId) => {
    console.log('📍 Getting place details for placeId:', placeId)
    
    if (!GOOGLE_MAPS_KEY) {
      console.error('❌ GOOGLE_MAPS_KEY is missing!')
      return null
    }

    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/details/json',
        {
          params: {
            place_id: placeId,
            key: GOOGLE_MAPS_KEY,
            fields: 'geometry,formatted_address,name'
          },
          timeout: 10000
        }
      )

      if (response.data.status === 'OK' && response.data.result) {
        const result = response.data.result
        console.log('✅ Got place details successfully')
        
        return {
          geometry: {
            location: {
              lat: result.geometry.location.lat,
              lng: result.geometry.location.lng
            }
          },
          formatted_address: result.formatted_address,
          name: result.name
        }
      } else {
        console.error('❌ Place details error:', response.data.status)
        return null
      }
    } catch (error) {
      console.error('🚨 Error getting place details:', error)
      return null
    }
  }, [GOOGLE_MAPS_KEY])

  // Handle text input change with debouncing
  const handleTextChange = useCallback((text) => {
    console.log('⌨️ Text changed:', text)
    setSearchText(text)
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    
    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      searchPlaces(text)
    }, 300)
  }, [searchPlaces])

  // Handle place selection
  const handlePlaceSelect = useCallback(async (place) => {
    console.log('🎯 Place selected:', place.description)
    setLoading(true)
    
    try {
      const details = await getPlaceDetails(place.placeId)
      
      if (details && details.geometry && details.geometry.location) {
        console.log('✅ Successfully got place coordinates:', details.geometry.location)
        onSubmit(place.description, details.geometry.location)
        close()
      } else {
        console.error('❌ Failed to get place coordinates')
        Alert.alert('Error', 'Unable to get coordinates for this location')
        setLoading(false)
      }
    } catch (error) {
      console.error('🚨 Error handling place selection:', error)
      Alert.alert('Error', 'Unable to select this location')
      setLoading(false)
    }
  }, [getPlaceDetails, onSubmit])

  const renderPrediction = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: currentTheme.cardBackground,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 8
      }}
      onPress={() => handlePlaceSelect(item)}
      disabled={loading}
    >
      <View style={styles(currentTheme).locationIcon}>
        <Ionicons name="location-outline" size={16} color={currentTheme.newIconColor} />
      </View>
      <TextDefault numberOfLines={1} textColor={currentTheme.newFontcolor} style={{ flex: 1 }}>
        {item.description}
      </TextDefault>
    </TouchableOpacity>
  )

  // Don't render if no API key
  if (!GOOGLE_MAPS_KEY) {
    return (
      <Modal visible={visible} transparent animationType={'slide'} onRequestClose={onClose}>
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: 'rgba(0,0,0,0.5)' 
        }}>
          <View style={{ 
            backgroundColor: currentTheme.cardBackground, 
            padding: 20, 
            borderRadius: 10, 
            margin: 20,
            borderWidth: 1,
            borderColor: currentTheme.customBorder
          }}>
            <TextDefault textColor={currentTheme.newFontcolor}>
              Google Maps API key is not configured
            </TextDefault>
            <TouchableOpacity 
              onPress={close} 
              style={{ 
                marginTop: 15, 
                padding: 12, 
                backgroundColor: currentTheme.buttonBackground, 
                borderRadius: 6 
              }}
            >
              <TextDefault textColor={currentTheme.buttonText} center>Close</TextDefault>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType={'slide'}
      onRequestClose={close}
    >
      <Animated.View
        style={[
          styles(currentTheme).modalContainer,
          marginTop,
          borderTopLeftRadius,
          borderTopRightRadius,
        ]}
      >
        <View style={[styles(currentTheme).flex, alignment.MTsmall]}>
          <TouchableOpacity style={styles().modalTextBtn} onPress={close}>
            <AntDesign
              name='arrowleft'
              size={24}
              color={currentTheme.newIconColor}
            />
          </TouchableOpacity>
          
          {/* Full Width Container for Search */}
          <View style={{ flex: 1, paddingHorizontal: 0 }}>
            
            {/* Text Input Container */}
            <View style={{
              borderWidth: 1,
              borderColor: currentTheme.customBorder,
              borderRadius: scale(6),
              backgroundColor: currentTheme.themeBackground,
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 0
            }}>
              <TextInput
                style={{
                  ...alignment.MTxSmall,
                  color: currentTheme.newFontcolor,
                  backgroundColor: currentTheme.themeBackground,
                  height: 38,
                  flex: 1,
                  paddingHorizontal: 12,
                  fontSize: 16
                }}
                placeholder={t('search')}
                placeholderTextColor={currentTheme.fontMainColor}
                value={searchText}
                onChangeText={handleTextChange}
                autoFocus={true}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={() => {
                  if (predictions.length > 0) {
                    handlePlaceSelect(predictions[0])
                  }
                }}
              />
              {loading && (
                <ActivityIndicator 
                  size="small" 
                  color={currentTheme.newIconColor} 
                  style={{ marginRight: 12 }} 
                />
              )}
            </View>

            {/* Results List Container */}
            {(predictions.length > 0 || error || (searchText.length > 2 && !loading)) && (
              <View style={{
                marginTop: 8,
                backgroundColor: currentTheme.cardBackground,
                borderRadius: scale(6),
                maxHeight: height * 0.4, // Limit height to 40% of screen
                elevation: 3,
                shadowColor: currentTheme.shadowColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}>
                {error ? (
                  <View style={{ 
                    paddingVertical: 16, 
                    paddingHorizontal: 16,
                    alignItems: 'center'
                  }}>
                    <Ionicons name="alert-circle-outline" size={24} color="#FF6B6B" />
                    <TextDefault 
                      textColor="#FF6B6B"
                      style={{ fontSize: 14, marginTop: 8, textAlign: 'center' }}
                    >
                      {error}
                    </TextDefault>
                  </View>
                ) : predictions.length > 0 ? (
                  <FlatList
                    data={predictions}
                    renderItem={renderPrediction}
                    keyExtractor={(item) => item.id}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                    style={{ flexGrow: 0 }}
                  />
                ) : searchText.length > 2 && !loading ? (
                  <View style={{
                    paddingVertical: 20,
                    alignItems: 'center'
                  }}>
                    <Ionicons 
                      name="search-outline" 
                      size={32} 
                      color={currentTheme.fontMainColor} 
                    />
                    <TextDefault 
                      textColor={currentTheme.fontMainColor}
                      style={{ marginTop: 8, fontSize: 16 }}
                    >
                      No places found
                    </TextDefault>
                    <TextDefault 
                      textColor={currentTheme.fontMainColor}
                      style={{ marginTop: 4, fontSize: 14 }}
                    >
                      Try a different search term
                    </TextDefault>
                  </View>
                ) : null}
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </Modal>
  )
}