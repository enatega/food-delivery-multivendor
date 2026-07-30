import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Entypo, Feather, Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale } from '../../../utils/scaling'
import Spinner from '../../../components/Spinner/Spinner'

const SearchingAddress = ({ currentTheme, t, setactiveState, loading, searchText, predictions, searchError, handleTextChange, handlePlaceSelect, handleClearSearch, isSearched }) => {
  const renderPrediction = ({ item }) => (
    <Pressable onPress={() => handlePlaceSelect(item)}>
      <View style={styles().selectionButton}>
        <Feather name='map-pin' size={15} />
        <TextDefault H5 bold>
          {item.mainText}
        </TextDefault>
      </View>
      <TextDefault style={{ paddingLeft: scale(25), marginTop: scale(-6) }}>{item?.description}</TextDefault>
    </Pressable>
  )

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.themeBackground, paddingHorizontal: 15 }}>
      <View style={styles(currentTheme).searchContainer}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name='search' size={18} color='#999' style={styles.searchIcon} />
          <TextInput value={searchText} onChangeText={handleTextChange} placeholder={t('Your location')} placeholderTextColor='#999' />
        </View>
        {loading && isSearched ? (
          <View>
            <Spinner size='small' spinnerColor={currentTheme?.primaryBlue} />
          </View>
        ) : (
          <Pressable onPress={handleClearSearch} hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}>
            <Entypo name='cross' size={18} color='#999' />
          </Pressable>
        )}
      </View>

      <Pressable onPress={() => setactiveState('map')} style={[styles().selectionButton, { paddingTop: scale(14) }]}>
        <Feather name='map' size={15} color={currentTheme.headerMainFontColor} />
        <TextDefault H5 bold textColor={currentTheme.headerMainFontColor}>
          {t('Choose on Map')}
        </TextDefault>
      </Pressable>

      {searchError && (
        <View style={[styles().selectionButton, { padding: scale(14), minHeight: scale(60), borderRadius: scale(10), borderWidth: 1, borderColor: currentTheme?.newBorderColor2, justifyContent: 'center', alignItems: 'center' }]}>
          <TextDefault H5 bold textColor={currentTheme?.red600}>
            {t('Something went wrong, please try again!')}
          </TextDefault>
        </View>
      )}
      {isSearched && (
        <FlatList
          data={predictions}
          renderItem={renderPrediction}
          keyExtractor={(item) => item?.id}
          ListEmptyComponent={
            <View style={[styles().selectionButton, { padding: scale(14), minHeight: scale(60), borderRadius: scale(10), borderWidth: 1, borderColor: currentTheme?.newBorderColor2, justifyContent: 'center', alignItems: 'center' }]}>
              <TextDefault H5 bold textColor={currentTheme?.colorTextMuted}>
                {t('noResults')}
              </TextDefault>
            </View>
          }
        />
      )}
    </View>
  )
}

export default SearchingAddress

const styles = (currentTheme) =>
  StyleSheet.create({
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      paddingHorizontal: 10,
      height: 40,
      borderWidth: 2,
      borderColor: '#F2F2F2',
      justifyContent: 'space-between'
    },
    searchIcon: {
      marginRight: 6
    },
    selectionButton: {
      display: 'flex',
      flexDirection: 'row',
      gap: 10,
      paddingVertical: scale(10),
      paddingHorizontal: scale(2)
    }
  })
