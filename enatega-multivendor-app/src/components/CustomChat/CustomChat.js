import React, { useRef, useEffect } from 'react'
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { scale } from '../../utils/scaling'

const CustomChat = ({
  messages = [],
  user,
  onSend,
  placeholder,
  textInputProps,
  text,
  onInputTextChanged,
  renderChatEmpty,
  currentTheme
}) => {
  const flatListRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
      }, 100)
    }
  }, [messages.length])

  const handleSend = () => {
    if (text && text.trim().length > 0) {
      onSend()
      inputRef.current?.focus()
    }
  }

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.user._id === user._id

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.messageRight : styles.messageLeft
        ]}>
        {!isCurrentUser && (
          <Text style={styles.userName}>{item.user.name}</Text>
        )}
        <View
          style={[
            styles.bubble,
            isCurrentUser ? styles.bubbleRight : styles.bubbleLeft
          ]}>
          <Text
            style={[
              styles.messageText,
              isCurrentUser ? styles.textRight : styles.textLeft
            ]}>
            {item.text}
          </Text>
          <Text style={styles.timeText}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item._id.toString()}
        inverted
        contentContainerStyle={styles.listContent}
        // ListEmptyComponent={messages.length === 0 ? (renderChatEmpty ? renderChatEmpty() : null) : null}
        keyboardShouldPersistTaps="handled"
      />

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={[styles.input, textInputProps?.style]}
          placeholder={placeholder}
          placeholderTextColor={textInputProps?.placeholderTextColor || '#6B7280'}
          value={text}
          onChangeText={onInputTextChanged}
          multiline
          returnKeyType="send"
          onSubmitEditing={handleSend}
          {...textInputProps}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={!text || text.trim().length === 0}>
          <Image
            source={require('../../assets/images/send-icon.png')}
            style={styles.sendIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listContent: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(40)
  },
  messageContainer: {
    marginVertical: scale(4),
    maxWidth: '80%'
  },
  messageLeft: {
    alignSelf: 'flex-start'
  },
  messageRight: {
    alignSelf: 'flex-end'
  },
  userName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: scale(4),
    marginLeft: scale(8)
  },
  bubble: {
    borderRadius: 16,
    padding: scale(12)
  },
  bubbleLeft: {
    backgroundColor: '#F3F4F6'
  },
  bubbleRight: {
    backgroundColor: '#E4FFD9'
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20
  },
  textLeft: {
    color: '#1F2937'
  },
  textRight: {
    color: '#1F2937'
  },
  timeText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: scale(4),
    alignSelf: 'flex-end'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A5C616',
    paddingVertical: scale(20),
    paddingHorizontal: scale(16)
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    fontSize: 12,
    maxHeight: scale(100)
  },
  sendButton: {
    width: scale(34),
    height: scale(34),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scale(8)
  },
  sendIcon: {
    width: scale(25),
    height: scale(25)
  }
})

export default CustomChat
