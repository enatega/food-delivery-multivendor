import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Pressable
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
import { Feather } from '@expo/vector-icons'

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
  showCrossButton
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
    const langName = await AsyncStorage.getItem('enatega-language-name')
    if (lang && langName) {
      const defLang = languageTypes.findIndex((el) => el.code === lang)
      activeRadioSetter(defLang)
      languageNameSetter(langName)
    }
  }

  async function onSelectedLanguage() {
    try {
      setLoadingLang(true)
      const languageInd = activeRadio
      const languageCode = languageTypes[languageInd].code
      const languageVal = languageTypes[languageInd].value

      await AsyncStorage.setItem('enatega-language', languageCode)
      await AsyncStorage.setItem('enatega-language-name', languageVal)

      i18next.changeLanguage(languageCode)
      languageNameSetter(languageVal)
    } catch (error) {
      console.error('Error during language selection:', error)
    } finally {
      setLoadingLang(false)
      setModalVisible(!modalVisible)
    }
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
      <View style={styles().layout}>
        <Pressable style={styles().backdrop} onPress={() => setModalVisible(!modalVisible)} />
        <View style={styles(currentTheme).modalContainer}>
          <View style={styles(currentTheme).flexRow}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              bolder
              H3
              style={alignment.MBsmall}
            >
              {t('selectLanguage')}
            </TextDefault>
            {showCrossButton && (
              <Feather
                name='x-circle'
                size={24}
                color={currentTheme.newFontcolor}
                onPress={() => setModalVisible(!modalVisible)}
              />
            )}
          </View>

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
      </View>
    </Modal>
    // </View>
  )
}

export default LanguageModal