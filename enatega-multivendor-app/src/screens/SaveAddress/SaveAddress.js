import React, { useContext, useLayoutEffect } from 'react'
import {
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar
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
import { useFocusEffect, useNavigation } from '@react-navigation/native'

function SaveAddress(props) {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { locationData } = props.route.params
  const { setLocation } = useContext(LocationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

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
      headerRight: null,
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
    setLocation({
      label: locationData.label,
      deliveryAddress: locationData.deliveryAddress,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      city: locationData.city
    })
    navigation.navigate('Main')
  }
  //console.log('Selected Value:', JSON.stringify(locationData, null, 2))

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
                        <CustomOtherIcon />
                      </View>
                      <View style={styles().locationTypes}>
                        <TextDefault H5 bolder>
                          {t('appartment')}
                        </TextDefault>
                      </View>
                    </View>
                    <View style={styles(currentTheme).locationRow}>
                      <View style={styles().locationIcon}>
                        <CustomOtherIcon />
                      </View>
                      <View style={styles().locationTypes}>
                        <TextDefault H5 bolder>
                          {t('house')}
                        </TextDefault>
                      </View>
                    </View>
                    <View style={styles(currentTheme).locationRow}>
                      <View style={styles().locationIcon}>
                        <CustomOtherIcon />
                      </View>
                      <View style={styles().locationTypes}>
                        <TextDefault H5 bolder>
                          {t('office')}
                        </TextDefault>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={styles().locationIcon}>
                        <CustomOtherIcon />
                      </View>
                      <View style={styles().locationTypes}>
                        <TextDefault H5 bolder>
                          {t('Other')}
                        </TextDefault>
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
