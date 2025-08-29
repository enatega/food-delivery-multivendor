import React, { useContext } from 'react'
import { View, TouchableOpacity, TextInput } from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import styles from './styles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { useTranslation } from 'react-i18next'

function Search(props) {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {isRTL: i18n.dir() == 'rtl', ...theme[themeContext.ThemeValue]}
  return (
    <View style={styles(currentTheme, props?.newheaderColor).mainContainerHolder}>
      <View style={styles(currentTheme, props?.cartContainer).mainContainer}>
        <View style={styles(currentTheme).subContainer}>
          <View style={styles(currentTheme).leftContainer}>
            <View style={styles().searchContainer}>
              <Ionicons
                name="search"
                color={currentTheme.gray500}
                size={scale(20)}
              />
            </View>
            <View style={styles().inputContainer}>
              <TextInput
                style={[
                  styles(currentTheme).bodyStyleOne,
                  {
                    textAlignVertical: 'center', // For Android
                    paddingVertical: 0, // Remove default padding
                    height: '100%', // Take full height of container
                    flex: 1,
                    includeFontPadding: false,
                  }
                ]}
                placeholder={props?.placeHolder}
                placeholderTextColor={currentTheme.gray500}
                onChangeText={text => props?.setSearch(text)}
                value={props?.search}
              />
            </View>
          </View>
          <View style={styles(currentTheme).filterContainer}>
            {props?.search ? (
              <TouchableOpacity
                onPress={() => {
                  props?.setSearch('')
                }}>
                <AntDesign
                  name="closecircleo"
                  size={15}
                  color={currentTheme.fontSecondColor}
                />
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default Search