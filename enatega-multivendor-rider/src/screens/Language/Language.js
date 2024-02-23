import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, TouchableOpacity, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Updates from 'expo-updates'
import * as Localization from 'expo-localization'
import styles from './styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from '../../utilities/colors'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utilities/alignment'
import Modal from 'react-native-modal'
import RadioButton from '../../components/FdRadioBtn/RadioBtn'
import { useNavigation } from '@react-navigation/native'
import i18next from '../../../i18next'
import {useTranslation} from 'react-i18next'

const languageTypes = [
  { value: 'English', code: 'en', index: 0 },
  { value: 'français', code: 'fr', index: 1 },
  { value: 'ភាសាខ្មែរ', code: 'km', index: 2 },
  { value: '中文', code: 'zh', index: 3 },
  { value: 'Deutsche', code: 'de', index: 4 },
  { value: 'Arabic', code: 'ar', index: 5 }
]

function Language() {
  const navigation = useNavigation()
  const {t} = useTranslation()
  const [modalVisible, modalVisibleSetter] = useState(false)
  const [activeRadio, setActiveRadio] = useState(languageTypes[0].index)
  const [languageName, languageNameSetter] = useState('English')
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
      const defLang = languageTypes.findIndex(el => el.code === lang)
      const langName = languageTypes[defLang].value
      setActiveRadio(defLang)
      languageNameSetter(langName)
    }
  }

  async function onSelectedLanguage() {
    const languageInd = activeRadio
    const lang = languageTypes[languageInd].code
    i18next.changeLanguage(lang)
    console.log(lang)
    if (Platform.OS === 'android') {
      const localization = await Localization.getLocalizationAsync()
      localization.locale = languageTypes[languageInd].code
      await AsyncStorage.setItem(
        'enatega-language',
        languageTypes[languageInd].code
      )
    }
    if (lang) {
      const defLang = languageTypes.findIndex(el => el.code === lang)
      const langName = languageTypes[defLang].value
      setActiveRadio(defLang)
      languageNameSetter(langName)
    }
    modalVisibleSetter(false)
  }

  return (
    <View
      style={[
        styles.flex,
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
  )
}

export default Language