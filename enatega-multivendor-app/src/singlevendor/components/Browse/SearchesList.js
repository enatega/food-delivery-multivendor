import { StyleSheet } from 'react-native'
import React from 'react'
import RecentSearches from './RecentSearches'
import EmptySearch from './EmptySearch'

const SearchesList = ({currentTheme, t, setSearchTerm}) => {
  return (
    <>
      <RecentSearches currentTheme={currentTheme} t={t} setSearchTerm={setSearchTerm} />
    </>
  )
}

export default SearchesList

const styles = StyleSheet.create({})
