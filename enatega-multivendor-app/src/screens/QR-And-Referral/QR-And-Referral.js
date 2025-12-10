import React, { useLayoutEffect, useContext, useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Share, Clipboard, StyleSheet, Alert } from 'react-native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { HeaderBackButton } from '@react-navigation/elements'
import { scale } from '../../utils/scaling'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
// import Clipboard from '@react-native-clipboard/clipboard'
import QRCode from 'react-native-qrcode-svg'
import { Ionicons } from '@expo/vector-icons'
import { createReferralLink } from '../../utils/branch.io'
import { useUserContext } from '../../context/User'

function QRAndReferral(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const {profile} = useUserContext()

  // States

  const [activeTab, setActiveTab] = useState('myQR')
  const [referralLink, setReferralLink] = useState('')


  // Handlers
  const init = async () => {
    const _referralLink = await createReferralLink(profile?.referralCode, {
      name: 'John Doe'
    })

    console.log({ _referralLink })

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
        // backgroundColor: currentTheme.black,
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
      <StatusBar barStyle='dark-content' backgroundColor='#ffffff' />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'myQR' && styles.activeTab]} onPress={() => setActiveTab('myQR')}>
          <Text style={[styles.tabText, activeTab === 'myQR' && styles.activeTabText]}>My QR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'scan' && styles.activeTab]} onPress={() => setActiveTab('scan')}>
          <Text style={[styles.tabText, activeTab === 'scan' && styles.activeTabText]}>Scan</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {activeTab === 'myQR' ? (
          <>
            {/* QR Code Section */}
            <View style={styles.qrSection}>
              <View style={styles.qrContainer}>{referralLink && <QRCode value={referralLink} size={180} color='#000000' backgroundColor='#ffffff' quietZone={10} />}</View>
            </View>

            {/* Invite & Earn Section */}
            <View style={styles.inviteSection}>
              <Text style={styles.inviteTitle}>Invite & Earn</Text>
              <Text style={styles.inviteDescription}>You and your friend each get 250 points (~ 2.5 $) when they join using your code or QR and place their first order.</Text>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.codeButton} onPress={handleCopyCode}>
                  <Ionicons name='document' size={18} color='#000' />
                  <Text style={styles.codeButtonText}>{profile?.referralCode}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.shareButton} onPress={handleShareLink}>
                  <Ionicons name='share-social' size={18} color='#000' />
                  <Text style={styles.shareButtonText}>Share link</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.scanPlaceholder}>
            <Ionicons name='camera' size={64} color='#ccc' />
            <Text style={styles.scanPlaceholderText}>Camera Scanner</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0'
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000'
  },
  headerSpacer: {
    width: 40
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    columnGap: 20
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  activeTab: {
    borderBottomColor: '#5AC12F'
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666'
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600'
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
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  inviteSection: {
    paddingHorizontal: 20
  },
  inviteTitle: {
    fontFamily: 'Inter',
    fontWeight: '700', // Bold
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center' // React Native alternative for vertical-align
  },
  inviteDescription: {
    fontFamily: 'Inter',
    fontWeight: '400', // Regular
    fontStyle: 'normal',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center', // works mostly on Android
    color: '#6B7280'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20
  },
  codeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 24,
    backgroundColor: '#ffffff'
  },
  codeButtonText: {
    fontFamily: 'Inter',
    fontWeight: '500', // Medium
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0, // 0% = 0
    color: '#111827'
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 24,
    backgroundColor: '#ffffff'
  },
  shareButtonText: {
    fontFamily: 'Inter',
    fontWeight: '500', // Medium
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0, // 0% = 0
    color: '#111827'
  },
  shareBadge: {
    marginLeft: 8
  },
  scanPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  scanPlaceholderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ccc'
  }
})

export default QRAndReferral
