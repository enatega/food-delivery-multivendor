import React, { useLayoutEffect, useContext, useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Share, StyleSheet, Alert } from 'react-native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { HeaderBackButton } from '@react-navigation/elements'
import { scale } from '../../utils/scaling'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
import Clipboard from '@react-native-clipboard/clipboard'
import QRCode from 'react-native-qrcode-svg'
import { Ionicons } from '@expo/vector-icons'
import { createReferralLink } from '../../utils/branch.io'
import { useUserContext } from '../../context/User'

function QRAndReferral(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const {profile} = useUserContext()
  const isDark = themeContext.ThemeValue === 'Dark'

  const [referralLink, setReferralLink] = useState('')

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.themeBackground
    },
    content: {
      flex: 1
    },
    contentContainer: {
      paddingBottom: 40
    },
    qrSection: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40
    },
    qrContainer: {
      backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB',
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4
    },
    inviteSection: {
      paddingHorizontal: 24,
      marginTop: 20
    },
    inviteTitle: {
      fontSize: 24,
      fontWeight: '700',
      textAlign: 'center',
      color: currentTheme.fontMainColor,
      marginBottom: 12
    },
    inviteDescription: {
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 32
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 16,
      paddingHorizontal: 20
    },
    codeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderWidth: 2,
      borderColor: isDark ? '#4B5563' : '#D1D5DB',
      borderRadius: 12,
      backgroundColor: isDark ? '#374151' : '#FFFFFF'
    },
    codeButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: currentTheme.fontMainColor
    },
    shareButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      backgroundColor: currentTheme.primary
    },
    shareButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF'
    }
  })

  // Handlers
  const init = async () => {
    const _referralLink = await createReferralLink(profile?.referralCode, {
      name: 'John Doe'
    })
    setReferralLink(_referralLink.url)
  }

  const handleCopyCode = async () => {
    Clipboard.setString(profile?.referralCode)
    Alert.alert('Copied', 'Referral code copied to clipboard')
  }

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `Join using my referral code: ${profile?.referralCode}\n${referralLink}`,
        title: 'Share Referral Code'
      })
    } catch (error) {
      console.error(error)
    }
  }

  // Effects
  useLayoutEffect(() => {
    props?.navigation.setOptions({
      headerRight: null,
      headerTitle: 'QR & Referral',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.fontMainColor,
        fontSize: 16
      },
      headerTitleContainerStyle: {
        marginTop: '1%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        borderRadius: scale(10),
        borderWidth: 1,
        borderColor: 'white'
      },
      headerStyle: {
        backgroundColor: currentTheme.themeBackground
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 50,
                marginLeft: 10,
                alignItems: 'center'
              }}
            >
              <MaterialIcons name='arrow-back' size={30} color='black' />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [props?.navigation])

  useEffect(() => {
    init()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={currentTheme.themeBackground} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.qrSection}>
          <View style={styles.qrContainer}>
            {referralLink && <QRCode value={referralLink} size={180} color={isDark ? '#FFFFFF' : '#000000'} backgroundColor={isDark ? '#1F2937' : '#FFFFFF'} quietZone={10} />}
          </View>
        </View>

        <View style={styles.inviteSection}>
          <Text style={styles.inviteTitle}>Invite & Earn</Text>
          <Text style={styles.inviteDescription}>You and your friend earn points when they join using your code or QR and place their first order.</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.codeButton} onPress={handleCopyCode}>
              <Ionicons name='document' size={18} color={currentTheme.fontMainColor} />
              <Text style={styles.codeButtonText}>{profile?.referralCode}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={handleShareLink}>
              <Ionicons name='share-social' size={18} color='#FFFFFF' />
              <Text style={styles.shareButtonText}>Share link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default QRAndReferral