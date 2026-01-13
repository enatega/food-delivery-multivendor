import React, { useContext, useMemo } from 'react'
import { SafeAreaView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import SectionedHelpList from './SectionedHelpList'

import styles from './styles'

const FastHelpSupport = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const otherTopicsItems = [
    {
      id: 'account',
      title: t('Account') || 'Account',
      onPress: () => navigation.navigate('AccountHelp')
    },
    {
      id: 'payments',
      title: t('Payments') || 'Payments',
      onPress: () => {}
    },
    {
      id: 'vouchers',
      title: t('Vouchers') || 'Vouchers',
      onPress: () => {}
    },
    {
      id: 'app-support',
      title: t('App supports & FAQs') || 'App supports & FAQs',
      onPress: () => {}
    },
    {
      id: 'feedback',
      title: t('Feedback') || 'Feedback',
      onPress: () => {}
    }
  ]

  const inboxItems = [
    {
      id: 'conversations',
      title: t('My conversations'),
      onPress: () => {}
    }
  ]

  const listData = useMemo(() => {
    return [
      { type: 'section', id: 'other-topics-header', title: t('Other topics') || 'Other topics' },
      ...otherTopicsItems.map((item) => ({ ...item, type: 'item', section: 'other-topics' })),
      { type: 'section', id: 'inbox-header', title: t('Inbox') || 'Inbox' },
      ...inboxItems.map((item) => ({ ...item, type: 'item', section: 'inbox' }))
    ]
  }, [t])

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <AccountSectionHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
        headerText={t('FAST help') || 'FAST help'}
      />
      <SectionedHelpList
        data={listData}
        currentTheme={currentTheme}
        sectionHeaderContainerStyle={styles(currentTheme).sectionHeaderContainer}
        sectionHeaderTextStyle={styles(currentTheme).sectionHeaderText}
        listItemStyle={styles(currentTheme).listItem}
        itemTitleStyle={styles(currentTheme).itemTitle}
        separatorStyle={styles(currentTheme).separator}
        listContentStyle={styles(currentTheme).listContent}
      />
    </SafeAreaView>
  )
}

export default FastHelpSupport
