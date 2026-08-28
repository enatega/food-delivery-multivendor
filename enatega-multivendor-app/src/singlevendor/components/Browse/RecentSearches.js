import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import SearchListItem from './SearchListItem'
import { getRecentSearches, clearRecentSearches, removeSearchTerm } from '../../../utils/recentSearch'

const RecentSearches = ({ currentTheme, t, setSearchTerm }) => {
  const [recentSearchResults, setrecentSearchResults] = useState([])

  useEffect(() => {
    getRecentSearches().then((res) => {
      setrecentSearchResults(res)
    })
  }, [])

  const handleClearAll = async() => {
    await clearRecentSearches()
    setrecentSearchResults([])
  }

  const handleRemoveSearch = async(searchTerm) => {
    const updatedSearches = await removeSearchTerm(searchTerm)
    setrecentSearchResults(updatedSearches)
  }

  return (
    <>
      <View style={[styles().flex, { paddingVertical: 15 }]}>
        <TextDefault H5 bolder>
          {t('Recent')}
        </TextDefault>
        {recentSearchResults.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <TextDefault H5 bolder textColor={currentTheme?.singleVendorBrandForeground}>
              {t('Clear All')}
            </TextDefault>
          </TouchableOpacity>
        )}
      </View>
      <View style={{ borderBottomWidth: 0.8, borderBottomColor: currentTheme?.borderBottomColor }} />

      <FlatList
        data={recentSearchResults}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <SearchListItem isRecent
        onPressHandler={() => setSearchTerm(item)}
        deleteHandler={() => handleRemoveSearch(item)}
        title={item} t={t} currentTheme={currentTheme} />}
        ListEmptyComponent={<TextDefault H5 center style={{ marginTop: 20, paddingHorizontal: 30 }}>{t('No recent searches found, Search your taste')}</TextDefault>}
      />
    </>
  )
}

export default RecentSearches

const styles = () =>
  StyleSheet.create({
    flex: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row'
    }
  })
