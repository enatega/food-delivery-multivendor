import React, { useContext, useMemo } from 'react'
import { FlatList, SafeAreaView, ScrollView, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import SectionedHelpList from './SectionedHelpList'
import useFastHelpSupport from './useFastHelpSupport'

import styles from './styles'
import TicketCard from './TicketCard'
import { FlashList } from '@shopify/flash-list'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale } from '../../../utils/scaling'
import Spinner from '../../../components/Spinner/Spinner'

const FastHelpSupport = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const { categoryOnPressHandler, subCategoryOnPressHandler, createSupportTicketLoading, ticketData, ticketLoading, hasActiveTicket } = useFastHelpSupport()

  const otherTopicsItems = [
    {
      id: 'account',
      title: t('Account') || 'Account',
      onPress: () => categoryOnPressHandler('Account')
    },
    {
      id: 'payments',
      title: t('Payments') || 'Payments',
      onPress: () => subCategoryOnPressHandler('Payments issues', 'Payments issues')
    },
    {
      id: 'vouchers',
      title: t('Vouchers') || 'Vouchers',
      onPress: () => subCategoryOnPressHandler('Vouchers issues', 'Vouchers issues')

    },
    {
      id: 'app-support',
      title: t('App supports & FAQs') || 'App supports & FAQs',
      onPress: () => subCategoryOnPressHandler('App supports & FAQs', 'App supports & FAQs')

    },
    {
      id: 'feedback',
      title: t('Feedback') || 'Feedback',
      onPress: () => subCategoryOnPressHandler('Feedback issues', 'Feedback issues')

    }
  ]


  const listData = useMemo(() => {
    return [{ type: 'section', id: 'other-topics-header', title: t('Other topics') || 'Other topics' }, ...otherTopicsItems.map((item) => ({ ...item, type: 'item', section: 'other-topics' }))]
  }, [t])
  const isLoading = ticketLoading || createSupportTicketLoading

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <AccountSectionHeader currentTheme={currentTheme} onBack={() => navigation.goBack()} headerText={t('FAST help') || 'FAST help'} />
      
      {isLoading ? (
        <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Spinner spinnerColor={currentTheme?.primaryBlue} />
        </View>
      ): hasActiveTicket ? (
      <FlashList
        contentContainerStyle={{ flexGrow: 1, marginHorizontal: scale(10), gap:scale(8) }}
        ListHeaderComponent={<TextDefault H4 bold>{t('Your Customer Support Tickets')}</TextDefault>}
        data={ticketData?.toReversed()} // Todo: the sorting can be added on backend but for now i am reversing the array so that we see the latest first.
        keyExtractor={(item) => item?._id}
        renderItem={({item}) => <TicketCard item={item} />}
      />
        ) : (          
        <ScrollView>
        <SectionedHelpList
        data={listData}
        currentTheme={currentTheme}
        sectionHeaderContainerStyle={styles(currentTheme).sectionHeaderContainer}
        sectionHeaderTextStyle={styles(currentTheme).sectionHeaderText}
        listItemStyle={[styles(currentTheme).listItem, {opacity: isLoading ? 0.6 : 1}]}
        itemTitleStyle={styles(currentTheme).itemTitle}
        separatorStyle={styles(currentTheme).separator}
        listContentStyle={styles(currentTheme).listContent}
        isLoading={isLoading}
        />
        <FlashList
        contentContainerStyle={{ flexGrow: 1, marginHorizontal: scale(10), gap:scale(8) }}
        ListHeaderComponent={<TextDefault H4 bolder>{t('Your Customer Support Tickets')}</TextDefault>}
        data={ticketData?.toReversed()} // Todo: the sorting can be added on backend but for now i am reversing the array so that we see the latest first.
        keyExtractor={(item) => item?._id}
        renderItem={({item}) => <TicketCard item={item} />}
      />
      </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default FastHelpSupport
