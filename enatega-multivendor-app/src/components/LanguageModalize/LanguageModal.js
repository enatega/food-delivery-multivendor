import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Modalize } from 'react-native-modalize'
import styles from './styles'
import TextDefault from '../Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { useTranslation } from 'react-i18next'
import RadioButton from '../../ui/FdRadioBtn/RadioBtn'
import AsyncStorage from '@react-native-async-storage/async-storage'
import i18next from '../../../i18next'
import Spinner from '../Spinner/Spinner'
import { scale } from '../../utils/scaling'

const languageTypes = [
  { value: 'English', code: 'en', index: 0 },
  { value: 'français', code: 'fr', index: 1 },
  { value: 'ភាសាខ្មែរ', code: 'km', index: 2 },
  { value: '中文', code: 'zh', index: 3 },
  { value: 'Deutsche', code: 'de', index: 4 },
  { value: 'العربية', code: 'ar', index: 5 },
  { value: 'עִברִית', code: 'he', index: 6 }
]

const LanguageModal = ({
  modalVisible,
  setModalVisible,
  currentTheme,
  onLanguageClose
}) => {
  const { t } = useTranslation()
  // const [activeRadio, activeRadioSetter] = useState(languageTypes[0].index)
  const [activeRadio, activeRadioSetter] = useState(0)
  const [loadinglang, setLoadingLang] = useState(false)
  const [languageName, languageNameSetter] = useState('English')

  useEffect(() => {
    selectLanguage()
  }, [])

  async function selectLanguage() {
    const lang = await AsyncStorage.getItem('enatega-language')
    if (lang) {
      const defLang = languageTypes.findIndex((el) => el.code === lang)
      const langName = languageTypes[defLang].value
      activeRadioSetter(defLang)
      languageNameSetter(langName)
    }
  }

  async function onSelectedLanguage() {
    try {
      // Display loading indicator
      setLoadingLang(true)
      const languageInd = activeRadio
      await AsyncStorage.setItem(
        'enatega-language',
        languageTypes[languageInd].code
      )

      var lang = await AsyncStorage.getItem('enatega-language')
      if (lang) {
        const defLang = languageTypes.findIndex((el) => el.code === lang)
        const langName = languageTypes[defLang].value
        languageNameSetter(langName)
      }
      i18next.changeLanguage(lang)
      // modalVisibleSetter(false)
    } catch (error) {
      console.error('Error during language selection:', error)
    } finally {
      setLoadingLang(false)
    }
    //   onLanguageClose()
    setModalVisible(!modalVisible)
  }

  return (
    // <View style={styles(currentTheme).modalContainer}>
    <Modal
      animationType='slide'
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.')
        setModalVisible(!modalVisible)
      }}
    >
      <View style={styles(currentTheme).modalContainer}>
        <TextDefault
          textColor={currentTheme.fontMainColor}
          bolder
          H3
          style={alignment.MBsmall}
        >
          {t('selectLanguage')}
        </TextDefault>

        <TextDefault
          textColor={currentTheme.fontMainColor}
          style={alignment.MBsmall}
        >
          {t('description0')}
        </TextDefault>

        {languageTypes.map((item, index) => (
          <TouchableOpacity
            activeOpacity={0.7}
            key={index}
            onPress={() => activeRadioSetter(item.index)}
            style={[styles(currentTheme).radioContainer]}
          >
            <RadioButton
              animation={'bounceIn'}
              size={13}
              outerColor={currentTheme.iconColorDark}
              innerColor={currentTheme.main}
              isSelected={activeRadio === item.index}
              onPress={() => activeRadioSetter(item.index)}
            />
            <TextDefault
              numberOfLines={1}
              textColor={currentTheme.fontMainColor}
              bold
              style={alignment.MLsmall}
            >
              {item.value}
            </TextDefault>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles(currentTheme).emptyButton}
          onPress={() => onSelectedLanguage()}
        >
          <TextDefault textColor={currentTheme.fontMainColor} center H5>
            {loadinglang ? (
              <Spinner
                size={'small'}
                backColor={'transparent'}
                spinnerColor={currentTheme.iconColorDark}
              />
            ) : (
              t('continueBtn')
            )}
          </TextDefault>
        </TouchableOpacity>
      </View>
    </Modal>
    // </View>
  )
}

export default LanguageModal
