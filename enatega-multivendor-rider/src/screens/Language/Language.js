import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, TouchableOpacity, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import * as Localization from 'expo-localization'
import styles from './styles'
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../utilities/colors'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utilities/alignment'
import Modal from 'react-native-modal'
import RadioButton from '../../components/FdRadioBtn/RadioBtn'
import { useNavigation } from '@react-navigation/native'
import i18next from '../../../i18next'
import { useTranslation } from 'react-i18next'

const languageTypes = [
  { value: 'Arabic', code: 'ar', index: 0 },
  { value: 'English', code: 'en', index: 1 },
  { value: 'Hebrew', code: 'he', index: 2 }
]

function Language() {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const [modalVisible, modalVisibleSetter] = useState(false)
  const [activeRadio, setActiveRadio] = useState(languageTypes[0].index)
  const [languageName, languageNameSetter] = useState('English')
  const [loader, setLoader] = useState(false)
  const inset = useSafeAreaInsets()
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('titleLanguage')
    })
  }, [navigation, languageName])

  useEffect(() => {
    selectedLanguageFunc()
  }, [])

  async function selectedLanguageFunc() {
    const lang = await AsyncStorage.getItem('enatega-language')
    if (lang) {
      i18next.changeLanguage(lang) // Add this line to apply the stored language initially
      const defLang = languageTypes.findIndex(el => el.code === lang)
      const langName = languageTypes[defLang].value
      setActiveRadio(defLang)
      languageNameSetter(langName)
    }
  }
  

  async function onSelectedLanguage() {
    const languageInd = activeRadio
    const lang = languageTypes[languageInd].code
    setLoader(true) // Start loader if you want to show a spinner during the language change

    i18next.changeLanguage(lang)
    await i18next.reloadResources(lang, null) // Ensure resources are reloaded

    console.log(lang)

    await AsyncStorage.setItem('enatega-language', lang)

    const storedLang = await AsyncStorage.getItem('enatega-language')
    console.log(storedLang)

    setLoader(false) // Stop loader
    modalVisibleSetter(false)

    if (lang) {
      const defLang = languageTypes.findIndex(el => el.code === lang)
      const langName = languageTypes[defLang].value
      setActiveRadio(defLang)
      languageNameSetter(langName)
    }
  }


  return (
    <SafeAreaView style={styles.flex}>
      <View
        style={[
          {
            paddingBottom: inset.bottom,
            ...alignment.Pmedium,
            ...alignment.MTlarge,
            width: '95%',
            alignSelf: 'center'
          }
        ]}>
        <View style={[styles.languageContainer, styles.shadow]}>
          <View style={styles.changeLanguage}>
            <View style={styles.headingLanguage}>
              <TextDefault
                numberOfLines={1}
                textColor={colors.fontSecondColor}
                bold
                H5>
                {t('language')}
              </TextDefault>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => modalVisibleSetter(true)}
              style={styles.button}>
              <TextDefault textColor={colors.tagColor} bolder>
                {t('edit')}
              </TextDefault>
            </TouchableOpacity>
          </View>
          <TextDefault textColor={colors.fontMainColor} bolder H4>
            {languageName}
          </TextDefault>
        </View>
        {/* Modal for language Changes */}

        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => modalVisibleSetter(false)}
          onBackButtonPress={() => modalVisibleSetter(false)}>
          <View style={styles.modalContainer}>
            <TextDefault
              textColor={colors.fontMainColor}
              bolder
              H5
              style={alignment.MBsmall}>
              {t('selectLanguage')}
            </TextDefault>

            {languageTypes.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={index}
                onPress={() => setActiveRadio(item.index)}
                style={[styles.radioContainer]}>
                <RadioButton
                  animation={'bounceIn'}
                  size={13}
                  outerColor={colors.radioOuterColor}
                  innerColor={colors.radioColor}
                  isSelected={activeRadio === item.index}
                  onPress={() => setActiveRadio(item.index)}
                />
                <TextDefault
                  numberOfLines={1}
                  textColor={colors.fontMainColor}
                  bold
                  style={alignment.MLsmall}>
                  {item.value}
                </TextDefault>
              </TouchableOpacity>
            ))}
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.modalButtons}
                onPress={() => modalVisibleSetter(false)}>
                <TextDefault
                  numberOfLines={1}
                  textColor={colors.tagColor}
                  bolder
                  uppercase>
                  {t('cancel')}
                </TextDefault>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.modalButtons}
                onPress={() => onSelectedLanguage()}>
                <TextDefault textColor={colors.tagColor} bolder uppercase>
                  {t('select')}
                </TextDefault>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  )
}

export default Language
