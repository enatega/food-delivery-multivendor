import React, { useContext } from 'react'
import { View, TouchableOpacity, TextInput } from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import styles from './styles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { useTranslation } from 'react-i18next'
import useMultivendorTheme from '../../../ui/designSystem/useMultivendorTheme'

function Search(props) {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const { tokens } = useMultivendorTheme()
  const searchTheme = { ...currentTheme, ...tokens }
  return (
    <View style={styles(searchTheme).mainContainerHolder}>
      <View style={styles(searchTheme).mainContainer}>
        <View style={styles(searchTheme).subContainer}>
          <View style={styles(searchTheme).leftContainer}>
            <View style={styles(searchTheme).searchContainer}>
              <Ionicons
                name='search'
                color={tokens.colors.textMuted}
                size={scale(20)}
              />
            </View>
            <View style={styles(searchTheme).inputContainer}>
              <TextInput
                style={[
                  styles(searchTheme).bodyStyleOne,
                  {
                    textAlignVertical: 'center', // For Android
                    paddingVertical: 0, // Remove default padding
                    height: '100%', // Take full height of container
                    flex: 1,
                    includeFontPadding: false
                  }
                ]}
                placeholder={props?.placeHolder}
                placeholderTextColor={tokens.colors.textMuted}
                onChangeText={(text) => props?.setSearch(text)}
                value={props?.search}
                selectionColor={tokens.colors.accent}
              />
            </View>
          </View>
          <View style={styles(searchTheme).filterContainer}>
            {!!props?.search && (
              <TouchableOpacity
                onPress={() => {
                  props?.setSearch('')
                }}>
                <AntDesign
                  name='closecircleo'
                  size={scale(16)}
                  color={tokens.colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default Search
