import React, { useContext, useMemo } from 'react'
import { SafeAreaView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import SectionedHelpList from './SectionedHelpList'

import styles from './styles'

const AccountHelp = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const accountItems = [
    {
      id: 'change-phone',
      title: t('Change phone number') || 'Change phone number',
      onPress: () => navigation.navigate('HelpConversation')
    },
    {
      id: 'change-email',
      title: t('Change email address') || 'Change email address',
      onPress: () => navigation.navigate('HelpConversation')
    },
    {
      id: 'change-profile-name',
      title: t('Change profile name') || 'Change profile name',
      onPress: () => navigation.navigate('HelpConversation')
    },
    {
      id: 'change-address',
      title: t('Change or delete address') || 'Change or delete address',
      onPress: () => navigation.navigate('HelpConversation')
    },
    {
      id: 'delete-account',
      title: t('Delete account') || 'Delete account',
      onPress: () => navigation.navigate('HelpConversation')
    },
    {
      id: 'reset-password',
      title: t('Reset Password') || 'Reset Password',
      onPress: () => navigation.navigate('HelpConversation')
    },
    {
      id: 'login-issue',
      title: t('Login issue') || 'Login issue',
      onPress: () => navigation.navigate('HelpConversation')
    }
  ]

  const listData = useMemo(() => {
    return [
      { type: 'section', id: 'account-header', title: t('Account') || 'Account' },
      ...accountItems.map((item) => ({ ...item, type: 'item', section: 'account' }))
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

export default AccountHelp
