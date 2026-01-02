import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import SearchListItem from './SearchListItem'
import { FlatList } from 'react-native-gesture-handler'
import { getRecentSearches, clearRecentSearches, removeSearchTerm } from '../../../utils/recentSearch'

const RecentSearches = ({ currentTheme, t, setSearchTerm }) => {
  const [recentSearchResults, setrecentSearchResults] = useState([])
  useEffect(() => {
    getRecentSearches('recentSearches').then((res) => {
      setrecentSearchResults(res)
    })
  }, [])

  return (
    <>
      <View style={[styles().flex, { paddingVertical: 15 }]}>
        <TextDefault H5 bolder>
          {t('Recent')}
        </TextDefault>
        <TouchableOpacity onPress={() => clearRecentSearches('recentSearches').then(() => setrecentSearchResults([]))}>
          <TextDefault H5 bolder textColor={currentTheme?.primaryBlue}>
            {t('Clear All')}
          </TextDefault>
        </TouchableOpacity>
      </View>
      <View style={{ borderBottomWidth: 0.8, borderBottomColor: currentTheme?.borderBottomColor }} />

      <FlatList
        data={recentSearchResults}
        renderItem={(item) => <SearchListItem isRecent={true}
        onPressHandler={() => setSearchTerm(item?.item)}
        deleteHandler={() => removeSearchTerm(item?.item, 'recentSearches').then(() => getRecentSearches('recentSearches').then((res) => setrecentSearchResults(res)))}
        title={item?.item} t={t} currentThem={currentTheme} />}
        ListEmptyComponent={<TextDefault H5 center style={{ marginTop: 20, paddingHorizontal:30 }}>{t("No recent searches found, Search your taste")}</TextDefault>}
      />
    </>
  )
}

export default RecentSearches

const styles = (currentTheme) =>
  StyleSheet.create({
    flex: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row'
    }
  })
