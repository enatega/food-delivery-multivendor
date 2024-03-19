import React, { useContext, useLayoutEffect, useState } from 'react'
import {
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Alert
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styles from './styles'
import { scale } from '../../utils/scaling'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { LocationContext } from '../../context/Location'
import { MaterialIcons } from '@expo/vector-icons'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { useTranslation } from 'react-i18next'
import CustomOtherIcon from '../../assets/SVG/imageComponents/CustomOtherIcon'
import CustomHomeIcon from '../../assets/SVG/imageComponents/CustomHomeIcon'
import CustomWorkIcon from '../../assets/SVG/imageComponents/CustomWorkIcon'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

function SaveAddress(props) {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { locationData } = props.route.params
  const { setLocation } = useContext(LocationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const [selectedLabel, setSelectedLabel] = useState('')

  const inset = useSafeAreaInsets()

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent')
    }
    StatusBar.setBarStyle('dark-content')
  })

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      title: t('saveAddress'),
      headerTitleStyle: {
        color: '#000',
        fontWeight: 'bold'
      },
      headerTitleContainerStyle: {
        marginTop: '2%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.white,
        elevation: 0
      },
      headerTitleAlign: 'center',
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View>
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [props.navigation])

  const onSelectLocation = () => {
    if (selectedLabel) {
      setLocation({
        label: selectedLabel,
        deliveryAddress: locationData.deliveryAddress,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        city: locationData.city
      })
      navigation.navigate('Main')
    } else {
      Alert.alert('Alert', 'Location type not selected')
    }
  }
  const handleLabelSelection = label => {
    setSelectedLabel(label)
  }

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 20 : 0}
        style={styles(currentTheme).flex}>
        <View style={styles(currentTheme).flex}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}>
            <View style={styles(currentTheme).subContainer}>
              <View style={styles().upperContainer}>
                <View style={styles(currentTheme).addressContainer}>
                  <View style={styles(currentTheme).addressTag}>
                    <TextDefault H4 bolder>
                      {t('address')}
                    </TextDefault>
                  </View>
                  <View style={styles().address}>
                    <View style={styles().addressTag}>
                      <TextDefault H5 bold>
                        {locationData.city}
                      </TextDefault>
                    </View>
                    <View style={styles().addressDetails}>
                      <TextDefault bold textColor={currentTheme.gray600}>
                        {locationData.deliveryAddress}
                      </TextDefault>
                    </View>
                  </View>
                  <View style={styles().address}>
                    <View style={styles().addressTag}>
                      <TextDefault H5 bold>
                        {t('locationType')}
                      </TextDefault>
                    </View>
                    <View style={styles().addressDetails}>
                      <TextDefault bold textColor={currentTheme.gray600}>
                        {t('locationTypeDetails')}
                      </TextDefault>
                    </View>
                  </View>
                  <View style={styles(currentTheme).locationContainer}>
                    <View style={styles(currentTheme).locationRow}>
                      <View style={styles().locationIcon}>
                        <TouchableOpacity
                          style={styles().locationIconStyles}
                          onPress={() => handleLabelSelection('Apartment')}>
                          <CustomOtherIcon
                            iconColor={
                              selectedLabel === 'Apartment'
                                ? currentTheme.newheaderColor
                                : currentTheme.darkBgFont
                            }
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={styles().locationTypes}>
                        <TouchableOpacity
                          style={styles().locationStyles}
                          onPress={() => handleLabelSelection('Apartment')}>
                          <TextDefault
                            H5
                            bolder
                            textColor={
                              selectedLabel === 'Apartment'
                                ? currentTheme.newheaderColor
                                : currentTheme.darkBgFont
                            }>
                            {t('apartment')}
                          </TextDefault>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles(currentTheme).locationRow}>
                      <View style={styles().locationIcon}>
                        <TouchableOpacity
                          style={styles().locationIconStyles}
                          onPress={() => handleLabelSelection('House')}>
                          <CustomHomeIcon
                            iconColor={
                              selectedLabel === 'House'
                                ? currentTheme.newheaderColor
                                : currentTheme.darkBgFont
                            }
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={styles().locationTypes}>
                        <TouchableOpacity
                          style={styles().locationStyles}
                          onPress={() => handleLabelSelection('House')}>
                          <TextDefault
                            H5
                            bolder
                            textColor={
                              selectedLabel === 'House'
                                ? currentTheme.newheaderColor
                                : currentTheme.darkBgFont
                            }>
                            {t('house')}
                          </TextDefault>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles(currentTheme).locationRow}>
                      <View style={styles().locationIcon}>
                        <TouchableOpacity
                          style={styles().locationIconStyles}
                          onPress={() => handleLabelSelection('Office')}>
                          <CustomWorkIcon
                            iconColor={
                              selectedLabel === 'Office'
                                ? currentTheme.newheaderColor
                                : currentTheme.darkBgFont
                            }
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={styles().locationTypes}>
                        <TouchableOpacity
                          style={styles().locationStyles}
                          onPress={() => handleLabelSelection('Office')}>
                          <TextDefault
                            H5
                            bolder
                            textColor={
                              selectedLabel === 'Office'
                                ? currentTheme.newheaderColor
                                : currentTheme.darkBgFont
                            }>
                            {t('office')}
                          </TextDefault>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles().lastLocationRow}>
                      <View style={styles().locationIcon}>
                        <TouchableOpacity
                          style={styles().locationIconStyles}
                          onPress={() => handleLabelSelection('Other')}>
                          <CustomOtherIcon
                            iconColor={
                              selectedLabel === 'Other'
                                ? currentTheme.newheaderColor
                                : currentTheme.darkBgFont
                            }
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={styles().locationTypes}>
                        <TouchableOpacity
                          style={styles().locationStyles}
                          onPress={() => handleLabelSelection('Other')}>
                          <TextDefault
                            H5
                            bolder
                            textColor={
                              selectedLabel === 'Other'
                                ? currentTheme.newheaderColor
                                : currentTheme.darkBgFont
                            }>
                            {t('Other')}
                          </TextDefault>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View>
              <TouchableOpacity
                onPress={onSelectLocation}
                activeOpacity={0.5}
                style={styles(currentTheme).saveBtnContainer}>
                <TextDefault textColor={currentTheme.black} H5 bold>
                  {t('saveAddress')}
                </TextDefault>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
    </>
  )
}

export default SaveAddress
