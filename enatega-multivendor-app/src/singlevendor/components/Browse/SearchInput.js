import { StyleSheet, View, TextInput, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { Entypo, Ionicons } from '@expo/vector-icons'
import Spinner from '../../../components/Spinner/Spinner'

const SearchInput = ({ currentTheme, handleClearSearch, inputRef, searchTerm, setSearchTerm, loading, debouncedSearch }) => {
  useEffect(() => {
    debouncedSearch(searchTerm)
  }, [searchTerm])

  return (
    <View style={styles(currentTheme).searchContainer}>
      <Ionicons name='search' size={18} color={currentTheme.colorTextMuted} style={styles().searchIcon} />
      <TextInput
        autoFocus
        ref={inputRef}
        style={styles(currentTheme).input}
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder='Search'
        placeholderTextColor={currentTheme.colorTextMuted}
        selectionColor={currentTheme.primaryBlue}
      />

      {loading
        ? (
        <View>
          <Spinner spinnerColor={currentTheme.primaryBlue} size='small' />
        </View>
          )
        : searchTerm.length > 0
          ? (
        <Pressable
          onPress={() => {
            handleClearSearch()
          }}
          hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
        >
          <Entypo name='cross' size={18} color={currentTheme.colorTextMuted} />
        </Pressable>
            )
          : null}
    </View>
  )
}

export default SearchInput

const styles = (props = null) =>
  StyleSheet.create({
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      paddingHorizontal: 10,
      height: 40,
      borderWidth: 2,
      borderColor: props?.colorBorder || props?.newBorderColor2 || '#E5E7EB',
      backgroundColor: props?.colorBgPrimary || props?.cardBackground || '#FFFFFF'
    },
    searchIcon: {
      marginRight: 6
    },
    input: {
      flex: 1,
      fontSize: 14,
      color: props?.fontMainColor || '#111827',
      height: '100%'
    }
  })
