import React, { useContext, useMemo } from 'react'
import { SafeAreaView, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import SectionedHelpList from './SectionedHelpList'
import styles from './styles'
import useFastHelpSupport from './useFastHelpSupport'
import Spinner from '../../../components/Spinner/Spinner'

const AccountHelp = ({ route }) => {
  const {category} = route?.params ?? {}
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const { subCategoryOnPressHandler, createSupportTicketLoading } = useFastHelpSupport()

  const accountItems = [
    {
      id: 'change-phone',
      title: t('Change phone number') || 'Change phone number',
      onPress: () => subCategoryOnPressHandler('Change phone number', category)
    },
    {
      id: 'change-email',
      title: t('Change email address') || 'Change email address',
      onPress: () => subCategoryOnPressHandler('Change email address', category)

    },
    {
      id: 'change-profile-name',
      title: t('Change profile name') || 'Change profile name',
      onPress: () => subCategoryOnPressHandler('Change profile name', category)

    },
    {
      id: 'change-address',
      title: t('Change or delete address') || 'Change or delete address',
      onPress: () => subCategoryOnPressHandler('Change or delete address', category)

    },
    {
      id: 'delete-account',
      title: t('Delete account') || 'Delete account',
      onPress: () => subCategoryOnPressHandler('Delete account', category)

    },
    {
      id: 'reset-password',
      title: t('Reset Password') || 'Reset Password',
      onPress: () => subCategoryOnPressHandler('Reset Password', category)

    },
    {
      id: 'login-issue',
      title: t('Login issue') || 'Login issue',
      onPress: () => subCategoryOnPressHandler('Login issue', category)

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
      {createSupportTicketLoading ? (
        <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Spinner spinnerColor={currentTheme?.primaryBlue} />
        </View>) : (        
      <SectionedHelpList
        data={listData}
        currentTheme={currentTheme}
        sectionHeaderContainerStyle={styles(currentTheme).sectionHeaderContainer}
        sectionHeaderTextStyle={styles(currentTheme).sectionHeaderText}
        listItemStyle={styles(currentTheme).listItem}
        itemTitleStyle={styles(currentTheme).itemTitle}
        separatorStyle={styles(currentTheme).separator}
        listContentStyle={styles(currentTheme).listContent}
        isLoading={createSupportTicketLoading}
      />
      )}
    </SafeAreaView>
  )
}

export default AccountHelp
