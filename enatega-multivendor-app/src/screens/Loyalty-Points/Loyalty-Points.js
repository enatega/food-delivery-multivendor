import { useState, useLayoutEffect, useContext } from 'react'
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const { height } = Dimensions.get('window')

import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { HeaderBackButton } from '@react-navigation/elements'
import { scale } from '../../utils/scaling'
import { Feather, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
import { useNavigation } from '@react-navigation/native'

function LoyaltyPoints(props) {
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  // Effects
  useLayoutEffect(() => {
    props?.navigation.setOptions({
      headerRight: null,
      headerTitle: 'Loyalty Points',
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

  const [referralExpanded, setReferralExpanded] = useState(false)

  const SparkleBackground = () => (
    <View style={styles.sparkles}>
      {[...Array(15)].map((_, i) => (
        <MaterialCommunityIcons
          key={i}
          name='star'
          size={Math.random() * 8 + 4}
          color='#00ff00'
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}
    </View>
  )

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white'
    },
    scrollContent: {
      paddingBottom: 40
    },
    header: {
      height: height * 0.15,
      backgroundColor: '#1a4d2e',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    sparkles: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0.3
    },
    headerContent: {
      alignItems: 'center',
      zIndex: 1
    },
    totalPointsText: {
      fontSize: 32,
      fontWeight: '700',
      color: '#000',
      marginBottom: 4
    },
    headerSubtext: {
      fontSize: 14,
      color: '#666',
      fontWeight: '500'
    },
    pointsCard: {
      backgroundColor: '#fff',
      borderRadius: 12,
      marginHorizontal: 16,
      marginTop: -40,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3
    },
    pointsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12
    },
    pointsRowLast: {
      marginBottom: 0
    },
    icon: {
      width: 24,
      height: 24,
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center'
    },
    pointsInfo: {
      flex: 1
    },
    pointsLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000',
      marginBottom: 2
    },
    pointsDescription: {
      fontSize: 12,
      color: '#999'
    },
    pointsAmount: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1a4d2e'
    },
    exchangeSection: {
      marginHorizontal: 16,
      marginBottom: 16,
      padding: 12,
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e0e0e0'
    },
    exchangeText: {
      fontSize: 12,
      color: '#666',
      fontWeight: '500'
    },
    referralSection: {
      marginBottom: 16,
      paddingRight: 16,
    },
    referralTitleContainer: {
      flex: 1,
      marginLeft: 12
    },
    referIcon: {
      width: 40,
      height: 40,
      backgroundColor: '#e5e7eb',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center'
    },
    referralHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      paddingBottom: 0
    },
    referralTitle: {
      fontFamily: 'Inter',
      fontWeight: '600', // Semi Bold
      fontSize: 18,
      lineHeight: 28,
      letterSpacing: 0,
      color: '#111827'
    },
    referralSubtitle: {
      fontFamily: 'Inter',
      fontWeight: '400', // Regular
      fontStyle: 'normal',
      fontSize: 12,
      lineHeight: 12,
      letterSpacing: 0,
      color: '#4B5563'
    },
    referral2ndSubtitle: {
      fontFamily: 'Inter',
      fontWeight: '400', // Regular
      fontStyle: 'normal',
      fontSize: 14,
      lineHeight: 18,
      letterSpacing: 0,
      color: '#000000',
      marginTop: 4
    },
    referralContent: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      border: 1,
      borderBottomColor: '#F8F9FA'
    },
    referralPoints: {
      fontSize: 24,
      fontWeight: '700',
      color: '#000',
      marginBottom: 4
    },
    referralDescription: {
      fontSize: 12,
      color: '#999',
      marginBottom: 12
    },
    referralCta: {
      fontSize: 12,
      color: '#0099ff',
      fontWeight: '600'
    },
    loyaltySection: {
      marginHorizontal: 16,
      marginBottom: 40
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#000',
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center'
    },
    sectionTitleText: {
      marginRight: 8
    },
    levelCard: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2
    },
    levelBadge: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12
    },
    silverBadge: {
      backgroundColor: '#d4af37'
    },
    goldBadge: {
      backgroundColor: '#ffd700'
    },
    platinumBadge: {
      backgroundColor: '#e5e4e2'
    },
    levelInfo: {
      flex: 1
    },
    levelName: {
      fontSize: 16,
      fontWeight: '700',
      color: '#000',
      marginBottom: 4
    },
    levelDescription: {
      fontSize: 12,
      color: '#999'
    },
    levelStatus: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#1a4d2e',
      justifyContent: 'center',
      alignItems: 'center'
    },
    unlocked: {
      backgroundColor: '#1a4d2e'
    },
    locked: {
      backgroundColor: '#ddd'
    }
  })

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <SparkleBackground />
          <View style={styles.headerContent}>
            <Text style={styles.totalPointsText}>1,900 Points</Text>
            <Text style={styles.headerSubtext}>Your total earned points so far.</Text>
          </View>
        </View>

        {/* Points Breakdown Card */}
        <View style={styles.pointsCard}>
          {/* Shopping Cart Row */}
          <View style={styles.pointsRow}>
            <View style={styles.icon}>
              <MaterialCommunityIcons name='shopping-bag' size={24} color='#1a4d2e' />
            </View>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsLabel}>1400 points</Text>
              <Text style={styles.pointsDescription}>From orders</Text>
            </View>
          </View>

          {/* Gift Row */}
          <View style={[styles.pointsRow, styles.pointsRowLast]}>
            <View style={styles.icon}>
              <MaterialCommunityIcons name='gift' size={24} color='#1a4d2e' />
            </View>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsLabel}>500 points</Text>
              <Text style={styles.pointsDescription}>From referrals</Text>
            </View>
          </View>
        </View>

        {/* Exchange Rate */}
        <View style={styles.exchangeSection}>
          <Text style={styles.exchangeText}>Exchange Rate: 100 points = 1 $</Text>
        </View>

        {/* Referral Rewards Section */}
        <View style={styles.referralSection}>
          <TouchableOpacity onPress={() => setReferralExpanded(!referralExpanded)} activeOpacity={0.7}>
            <View style={styles.referralHeader}>
              {/* Left side */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.referIcon}>
                  <Ionicons name='trophy-sharp' size={24} color='gray' />
                </View>

                <View style={styles.referralTitleContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.referralTitle}>Referral Rewards</Text>
                    <MaterialCommunityIcons
                      name='information-outline'
                      size={20}
                      color='#999'
                      style={{ marginLeft: 4 }} // small spacing
                    />
                  </View>

                  <Text style={styles.referralSubtitle}>600 pts earned so far</Text>
                  <Text style={styles.referral2ndSubtitle}>Tap to view detailed breakdown</Text>
                </View>
              </View>

              {/* Right side */}
              <Feather name='chevron-right' size={20} color='#0F172A' />
            </View>
          </TouchableOpacity>

          {/* Expanded Referral Content */}
          {referralExpanded && (
            <View style={styles.referralContent}>
              <Text style={styles.referralPoints}>600 pts</Text>
              <Text style={styles.referralDescription}>earned so far</Text>
              <Text style={styles.referralCta}>Tap to view detailed breakdown</Text>
            </View>
          )}
        </View>

        {/* Loyalty Levels Section */}
        <View style={styles.loyaltySection}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Your Loyalty Level</Text>
            <MaterialCommunityIcons name='information-outline' size={20} color='#999' />
          </View>
          <Text style={styles.sectionDescription}>Earn more points to unlock new benefits.</Text>

          {/* Silver Level - Unlocked */}
          <View style={styles.levelCard}>
            <View style={[styles.levelBadge, styles.silverBadge]}>
              <MaterialCommunityIcons name='medal' size={28} color='#333' />
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelName}>Silver</Text>
              <Text style={styles.levelDescription}>Congrats you have unlock level</Text>
            </View>
            <View style={[styles.levelStatus, styles.unlocked]}>
              <MaterialCommunityIcons name='check' size={16} color='#fff' />
            </View>
          </View>

          {/* Gold Level - Locked */}
          <View style={styles.levelCard}>
            <View style={[styles.levelBadge, styles.goldBadge]}>
              <MaterialCommunityIcons name='trophy' size={28} color='#333' />
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelName}>Gold</Text>
              <Text style={styles.levelDescription}>100+ more points to unlock</Text>
            </View>
            <View style={[styles.levelStatus, styles.locked]}>
              <MaterialCommunityIcons name='lock' size={16} color='#999' />
            </View>
          </View>

          {/* Platinum Level - Locked */}
          <View style={styles.levelCard}>
            <View style={[styles.levelBadge, styles.platinumBadge]}>
              <MaterialCommunityIcons name='diamond' size={28} color='#333' />
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelName}>Platinum</Text>
              <Text style={styles.levelDescription}>5000 more points to unlock</Text>
            </View>
            <View style={[styles.levelStatus, styles.locked]}>
              <MaterialCommunityIcons name='lock' size={16} color='#999' />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default LoyaltyPoints
