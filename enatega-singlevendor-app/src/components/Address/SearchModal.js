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
import {
  fetchPlaceAutocomplete,
  fetchPlaceDetails
} from '../../api/googleMapsProxy'
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
  const { SERVER_REST_URL } = useEnvVars()
  
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
        hasServerUrl: !!SERVER_REST_URL,
        themeValue: themeContext.ThemeValue,
        timestamp: new Date().toISOString()
      })
      
      // Reset state when modal opens
      setSearchText('')
      setPredictions([])
      setLoading(false)
      setError(null)
    }
  }, [visible, SERVER_REST_URL, themeContext.ThemeValue])

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

    if (!SERVER_REST_URL) {
      console.error('❌ SERVER_REST_URL is missing!')
      setError('Location search is not configured')
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
      
      const data = await fetchPlaceAutocomplete({
        baseUrl: SERVER_REST_URL,
        input: query,
        language: 'en',
        types: 'geocode',
        cancelToken: cancelToken.token
      })

      console.log('📍 API Response status:', data.status)
      
      if (data.status === 'OK') {
        console.log('✅ Found predictions:', data.predictions.length)
        setPredictions(data.predictions)
        setError(null)
      } else if (data.status === 'ZERO_RESULTS') {
        console.log('🔍 No results found for query:', query)
        setPredictions([])
        setError(null)
      } else {
        console.error('❌ API Error:', data.status, data.errorMessage)
        setPredictions([])
        setError(data.errorMessage || 'Search failed')
        
        if (data.status === 'REQUEST_DENIED') {
          Alert.alert(
            'API Error', 
            'Location search access denied. Please check your backend Maps configuration.'
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
      } else {
        setError(error.message || 'Search failed')
      }
    } finally {
      setLoading(false)
      // Clear the cancel token reference if this was the current request
      if (requestCancelTokenRef.current === cancelToken) {
        requestCancelTokenRef.current = null
      }
    }
  }, [SERVER_REST_URL])

  // Get place details
  const getPlaceDetails = useCallback(async (placeId) => {
    console.log('📍 Getting place details for placeId:', placeId)
    
    if (!SERVER_REST_URL) {
      console.error('❌ SERVER_REST_URL is missing!')
      return null
    }

    try {
      const data = await fetchPlaceDetails({
        baseUrl: SERVER_REST_URL,
        placeId,
        language: 'en'
      })

      if (data.status === 'OK' && data.result) {
        const result = data.result
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
        console.error('❌ Place details error:', data.status)
        return null
      }
    } catch (error) {
      console.error('🚨 Error getting place details:', error)
      return null
    }
  }, [SERVER_REST_URL])

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
      style={styles(currentTheme).predictionRow}
      onPress={() => handlePlaceSelect(item)}
      disabled={loading}
    >
      <View style={styles(currentTheme).locationIcon}>
        <Ionicons name="location-outline" size={16} color={currentTheme.newIconColor} />
      </View>
      <TextDefault
        numberOfLines={1}
        ellipsizeMode="tail"
        textColor={currentTheme.newFontcolor}
        style={{ flex: 1 }}
      >
        {item.description}
      </TextDefault>
    </TouchableOpacity>
  )

  const clearSearch = () => {
    setSearchText('')
    setPredictions([])
    setError(null)
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
  }

  // Don't render if backend search is not configured
  if (!SERVER_REST_URL) {
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
              Location search is not configured
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
      {/* Tap the area above the sheet (the header) to dismiss — no second back button needed */}
      <TouchableOpacity
        activeOpacity={1}
        style={styles(currentTheme).dismissOverlay}
        onPress={close}
      />
      <Animated.View
        style={[
          styles(currentTheme).modalContainer,
          marginTop,
          borderTopLeftRadius,
          borderTopRightRadius,
        ]}
      >
        {/* Search input (icon + field + clear) — full width within the container margins */}
        <View style={styles(currentTheme).searchInputRow}>
          <Ionicons name="search" size={20} color={currentTheme.fontMainColor} />
          <TextInput
            style={styles(currentTheme).searchInput}
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
          {loading ? (
            <ActivityIndicator size="small" color={currentTheme.newIconColor} />
          ) : searchText.length > 0 ? (
            <TouchableOpacity onPress={clearSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={20} color={currentTheme.fontMainColor} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Results List Container — same left/right boundaries as the input */}
        {(predictions.length > 0 || error || (searchText.length > 2 && !loading)) && (
          <View style={{
            marginTop: 8,
            backgroundColor: currentTheme.cardBackground,
            borderRadius: scale(8),
            maxHeight: height * 0.4, // Limit height to 40% of screen
            overflow: 'hidden',
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
                ItemSeparatorComponent={() => (
                  <View style={styles(currentTheme).predictionDivider} />
                )}
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
      </Animated.View>
    </Modal>
  )
}
