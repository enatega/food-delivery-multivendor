import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { Entypo, Ionicons, Octicons } from '@expo/vector-icons'

const SearchListItem = ({ isRecent = false, title, deleteHandler, onPressHandler, t, currentTheme }) => {
  return (
    <View style={[styles().flex, { paddingVertical: 10, justifyContent: 'space-between' }]}>
      <TouchableOpacity hitSlop={10} onPress={onPressHandler} style={[styles().flex, { width: '85%', justifyContent: 'flex-start' }]}>
        {isRecent ? <Octicons name='history' size={18} color={currentTheme?.colorTextMuted} /> : <Ionicons name='search' size={18} color={currentTheme?.colorTextMuted} />}
        <TextDefault H5 textColor={currentTheme?.colorTextMuted}>
          {t(title)}
        </TextDefault>
      </TouchableOpacity>

      <TouchableOpacity hitSlop={10} onPress={deleteHandler} style={{ width: '15', opacity: 0.7 }}>
        <Entypo name='cross' size={20} color={currentTheme?.colorTextMuted} />
      </TouchableOpacity>
    </View>
  )
}

export default SearchListItem

const styles = (currentTheme = null) =>
  StyleSheet.create({
    flex: {
      display: 'flex',
      flexDirection: 'row',
      gap: 6
    }
  })
