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
      <Ionicons name='search' size={18} color='#999' style={styles().searchIcon} />
      <TextInput autoFocus={true} ref={inputRef} style={styles().input} value={searchTerm} onChangeText={(text) => setSearchTerm(text)} placeholder='Search' />

      {loading ? (
        <View>
          <Spinner spinnerColor={currentTheme.primaryBlue} size='small' />
        </View>
      ) : searchTerm.length > 0 ? (
        <Pressable
          onPress={() => {
            handleClearSearch()
          }}
          hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
        >
          <Entypo name='cross' size={18} color='#999' />
        </Pressable>
      ) : null}
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
      borderColor: props !== null ? props.borderColor : '#F2F2F2'
    },
    searchIcon: {
      marginRight: 6
    },
    input: {
      flex: 1,
      fontSize: 14,
      color: '#000',
      height: '100%'
    }
  })
