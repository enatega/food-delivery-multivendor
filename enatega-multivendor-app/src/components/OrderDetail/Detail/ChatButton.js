import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'
import { alignment } from '../../../utils/alignment'
import RiderChatIcon from '../../../assets/SVG/rider-chat'
import ChatIcon from '../../../assets/SVG/chat-icon'

export const ChatButton = ({ onPress, theme, title, description }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.chatButton(theme)}>
      <View>
        <RiderChatIcon/>
      </View>
      <View style={{ width: '60%', ...alignment.MLsmall }}>
        <TextDefault
          H4
          bolder
        >{title}
        </TextDefault>
        <TextDefault
          H5
        >{description}
        </TextDefault>
      </View>
      <View style={styles.chatIcon(theme)}>
        <ChatIcon/>
      </View>

    </TouchableOpacity>
  )
}
