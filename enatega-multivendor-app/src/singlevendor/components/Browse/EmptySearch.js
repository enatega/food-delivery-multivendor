import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import NoResultFound from '../../assets/SvgComponents/NoResultFound'

const EmptySearch = ({currentTheme, t}) => {
  return (
    <>
      <View style={{ minHeight: '100%' }}>
        <View style={[styles().flex, { paddingVertical: 15 }]}>
          <TextDefault H5 bolder>
            {t('Recent')}
          </TextDefault>
          <TouchableOpacity onPress={() => console.log('clear all called')}>
            <TextDefault H5 bolder textColor={currentTheme?.primaryBlue}>
              0 {t('found')}
            </TextDefault>
          </TouchableOpacity>
        </View>
        <View style={[styles().flex, { minHeight: '70%' }]}>
          <View style={{ gap: 10 }}>
            <NoResultFound />
            <TextDefault H3 bold center>
              {t('noResults')}
            </TextDefault>
            <TextDefault H5 center>
              {t('No results found for your search. Please try a different query')}
            </TextDefault>
          </View>
        </View>
      </View>
    </>
  )
}

export default EmptySearch

const styles = (currentTheme) =>
  StyleSheet.create({
    flex: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row'
    }
  })
