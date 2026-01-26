import React, { useContext, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { gql, useMutation } from '@apollo/client'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale, verticalScale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import SectionHeader from './SectionHeader'
import MenuListItem from './MenuListItem'
import UserContext from '../../../context/User'
import { Feather } from '@expo/vector-icons'
import { Deactivate } from '../../../apollo/mutations'

const DEACTIVATE = gql`
  ${Deactivate}
`

const AccountManagement = () => {
  const { t, i18n } = useTranslation()
  const { logout, profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const onCompletedDeactivate = async (data) => {
    Alert.alert(
      t('Success'),
      t('Account deleted successfully'),
      [
        {
          text: 'OK',
          onPress: async () => {
            await logout()
          }
        }
      ]
    )
  }

  const onErrorDeactivate = (error) => {
    Alert.alert(
      t('Error'),
      error.message || t('Failed to delete account'),
      [{ text: 'OK' }]
    )
  }

  const [deactivated, { loading: deactivateLoading }] = useMutation(DEACTIVATE, {
    onCompleted: onCompletedDeactivate,
    onError: onErrorDeactivate
  })

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const deactivatewithemail = async () => {
    try {
      if (!profile?.email) {
        Alert.alert(
          t('Error'),
          t('User email not found'),
          [{ text: 'OK' }]
        )
        return
      }
      await deactivated({
        variables: {
          email: profile.email,
          isActive: false
        }
      })
    } catch (error) {
      console.error('Deactivation error:', error)
    }
  }

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Do you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            await logout()
          }
        }
      ],
      { cancelable: true }
    )
  }

  return (
    <View style={styles(currentTheme).container}>
      <SectionHeader title={t('Account Management')} />
      <View style={styles(currentTheme).menuContainer}>
        <MenuListItem
          icon="trash-outline"
          title={t('Delete my account')}
          onPress={() => setDeleteModalVisible(true)}
        />
      </View>

      <TouchableOpacity
        style={styles(currentTheme).logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <TextDefault
          bold
          textColor="#DC2626"
          style={styles(currentTheme).logoutText}
        >
          {t('Logout')}
        </TextDefault>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={deleteModalVisible}
        animationType="fade"
        onRequestClose={() => {
          setDeleteModalVisible(false)
        }}
      >
        <View style={styles(currentTheme).centeredView}>
          <View style={styles(currentTheme).modalView}>
            <View
              style={{
                flexDirection: 'row',
                gap: 24,
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: scale(10),
                marginBottom: verticalScale(16)
              }}
            >
              <TextDefault bolder H3 textColor={currentTheme.newFontcolor} isRTL>
                {t('DeleteConfirmation')}
              </TextDefault>
              <Feather
                name='x-circle'
                size={24}
                style={styles(currentTheme).closeIcon}
                color={currentTheme.newFontcolor}
                onPress={() => setDeleteModalVisible(false)}
              />
            </View>
            <TextDefault H5 textColor={currentTheme.newFontcolor} isRTL style={{ marginBottom: verticalScale(24) }}>
              {t('permanentDeleteMessage')}
            </TextDefault>
            <TouchableOpacity
              style={[
                styles(currentTheme).btn,
                styles(currentTheme).btnDelete,
                { opacity: deactivateLoading ? 0.5 : 1 }
              ]}
              onPress={deactivatewithemail}
              disabled={deactivateLoading}
            >
              {deactivateLoading ? (
                <ActivityIndicator color={currentTheme.white || '#FFFFFF'} size='small' />
              ) : (
                <TextDefault bolder H4 textColor={currentTheme.white || '#FFFFFF'}>
                  {t('yesSure')}
                </TextDefault>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles(currentTheme).btn, styles(currentTheme).btnCancel]}
              onPress={() => setDeleteModalVisible(false)}
              disabled={deactivateLoading}
            >
              <TextDefault bolder H4 textColor={currentTheme.black || '#000000'}>
                {t('noDelete')}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = (currentTheme = {}) =>
  StyleSheet.create({
    container: {
      marginBottom: verticalScale(16)
    },
    menuContainer: {
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF',
      borderRadius: 12,
      marginHorizontal: 16,
      overflow: 'hidden'
    },
    logoutButton: {
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF',
      borderRadius: 12,
      marginHorizontal: 16,
      marginTop: verticalScale(16),
      paddingVertical: verticalScale(10),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#DC2626',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2
    },
    logoutText: {
      fontSize: scale(15)
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
      margin: 20,
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF',
      borderRadius: 20,
      padding: scale(24),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '85%'
    },
    btn: {
      borderRadius: 12,
      paddingVertical: verticalScale(12),
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: verticalScale(8)
    },
    btnDelete: {
      backgroundColor: '#DC2626'
    },
    btnCancel: {
      backgroundColor: currentTheme?.lightBackground || '#F3F4F6',
      borderWidth: 1,
      borderColor: currentTheme?.borderColor || '#E5E7EB'
    },
    closeIcon: {
      position: 'absolute',
      top: 1,
      right: -10
    }
  })

export default AccountManagement