import { useState, useLayoutEffect, useContext, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useQuery } from '@apollo/client'

import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { HeaderBackButton } from '@react-navigation/elements'
import { scale } from '../../utils/scaling'
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
import { useNavigation } from '@react-navigation/native'
import BronzeIcon from '../../assets/SVG/bronze'
import SilverIcon from '../../assets/SVG/silver'
import GoldIcon from '../../assets/SVG/gold'
import PlatinumIcon from '../../assets/SVG/platinum'
import { GET_USER_LOYALTY_DATA, GET_REFERRAL_DATA_BY_LEVELS, FETCH_LOYALTY_TIERS } from '../../apollo/queries'
import UserContext from '../../context/User'

function LoyaltyPoints(props) {
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { profile: userProfile } = useContext(UserContext)
  const isDark = themeContext.ThemeValue === 'Dark'

  const { data: loyaltyData, loading: loyaltyLoading } = useQuery(GET_USER_LOYALTY_DATA)
  const { data: referralData, loading: referralLoading } = useQuery(GET_REFERRAL_DATA_BY_LEVELS, {
    variables: { userId: userProfile?._id },
    skip: !userProfile?._id
  })
  const { data: tiersData, loading: tiersLoading } = useQuery(FETCH_LOYALTY_TIERS)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.themeBackground
    },
    pointsCard: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 14,
      marginHorizontal: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: isDark ? 0.25 : 0.1,
      shadowRadius: 6,
      elevation: 3
    },
    pointsCardHeader: {
      height: 60,
      backgroundColor: currentTheme.primary,
      borderTopLeftRadius: 14,
      borderTopRightRadius: 14,
      justifyContent: 'center',
      alignItems: 'center'
    },
    pointsCardBody: {
      padding: 16
    },
    pointsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      marginHorizontal: 12
    },
    pointsRowLast: {
      marginBottom: 0
    },
    pointsInfo: {
      flex: 1
    },
    totalPointsText: {
      fontSize: 18,
      fontWeight: '700',
      color: currentTheme.fontMainColor,
      marginBottom: 4
    },
    headerSubtext: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280'
    },
    dottedBar: {
      borderTopWidth: 1,
      borderTopColor: isDark ? '#374151' : '#E5E7EB',
      borderStyle: 'dashed',
      marginVertical: 10
    },
    icon: {
      width: 28,
      height: 28,
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      borderRadius: 6
    },
    pointsLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: currentTheme.fontMainColor,
      marginBottom: 2
    },
    pointsDescription: {
      fontSize: 11,
      color: isDark ? '#9CA3AF' : '#6B7280'
    },
    exchangeText: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center'
    },
    referralSection: {
      marginBottom: 20,
      marginHorizontal: 16
    },
    referralHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB'
    },
    referralIcon: {
      width: 40,
      height: 40,
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
    referralTitleContainer: {
      flex: 1,
      marginLeft: 12
    },
    referralTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: currentTheme.fontMainColor
    },
    referralSubtitle: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280'
    },
    referral2ndSubtitle: {
      fontSize: 13,
      color: currentTheme.primary,
      marginTop: 4
    },
    referralContent: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 14,
      padding: 16,
      marginTop: 10,
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB'
    },
    tabContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      borderRadius: 10,
      padding: 4
    },
    tab: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      alignItems: 'center'
    },
    activeTab: {
      backgroundColor: currentTheme.primary
    },
    tabText: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? '#9CA3AF' : '#6B7280'
    },
    activeTabText: {
      color: '#FFFFFF',
      fontWeight: '600'
    },
    tabContent: {
      marginTop: 8
    },
    listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#374151' : '#F3F4F6'
    },
    listItemLeft: {
      flex: 1
    },
    listItemName: {
      fontSize: 12,
      fontWeight: '400',
      color: currentTheme.fontMainColor,
      marginBottom: 2
    },
    listItemDate: {
      fontSize: 11,
      color: isDark ? '#9CA3AF' : '#6B7280'
    },
    listItemPoints: {
      fontSize: 14,
      fontWeight: '700',
      color: currentTheme.primary
    },
    emptyState: {
      padding: 20,
      alignItems: 'center'
    },
    emptyStateText: {
      fontSize: 13,
      color: isDark ? '#9CA3AF' : '#6B7280',
      fontStyle: 'italic'
    },
    loyaltySection: {
      marginHorizontal: 16,
      marginBottom: 30
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16
    },
    levelCard: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      height: 60,
      borderWidth: 1,
      borderRadius: 14,
      borderColor: isDark ? '#374151' : '#E5E7EB',
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center'
    },
    levelBadge: {
      width: 40,
      height: 40,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      backgroundColor: isDark ? '#374151' : '#F9FAFB'
    },
    levelInfo: {
      flex: 1
    },
    levelName: {
      fontSize: 15,
      fontWeight: '700',
      color: currentTheme.fontMainColor,
      marginBottom: 2
    },
    levelDescription: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280'
    },
    levelStatus: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center'
    },
    unlocked: {
      backgroundColor: currentTheme.primary
    },
    locked: {
      backgroundColor: isDark ? '#4B5563' : '#D1D5DB'
    }
  })

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
  const [activeTab, setActiveTab] = useState('level1')
  const [pointsData, setPointsData] = useState({
    totalPoints: 0,
    loyaltyPoints: 0,
    referralPoints: 0,
    exchangeRate: 100
  })
  const [referralsByLevel, setReferralsByLevel] = useState({
    level1: [],
    level2: [],
    level3: []
  })
  const [loyaltyTiers, setLoyaltyTiers] = useState([])

  useEffect(() => {
    if (loyaltyData?.fetchUserLoyaltyData) {
      const userData = loyaltyData.fetchUserLoyaltyData
      const config = loyaltyData.fetchLoyaltyConfiguration
      
      setPointsData({
        totalPoints: userData.totalEarnedPoints || 0,
        loyaltyPoints: userData.loyaltyPoints || 0,
        referralPoints: userData.referralPoints || 0,
        exchangeRate: config?.pointsPerDollar || 100
      })
    }
    
    if (referralData?.fetchReferralLoyaltyHistory) {
      const transactions = referralData.fetchReferralLoyaltyHistory
      const referralTransactions = transactions.filter(t => t.type === 'Referral' && t.source === 'signup')
      const groupedReferrals = {
        level1: referralTransactions.filter(t => t.level === 1).map(t => ({
          id: t._id,
          name: t.triggeredBy || 'Unknown User',
          points: t.value
        })),
        level2: referralTransactions.filter(t => t.level === 2).map(t => ({
          id: t._id,
          name: t.triggeredBy || 'Unknown User',
          points: t.value
        })),
        level3: referralTransactions.filter(t => t.level === 3).map(t => ({
          id: t._id,
          name: t.triggeredBy || 'Unknown User',
          points: t.value
        }))
      }
      setReferralsByLevel(groupedReferrals)
    }

    if (tiersData?.fetchLoyaltyTiers) {
      const sortedTiers = [...tiersData.fetchLoyaltyTiers].sort((a, b) => a.points - b.points)
      setLoyaltyTiers(sortedTiers)
    }
  }, [loyaltyData, referralData, tiersData])

  const getTierIcon = (tierName) => {
    switch (tierName?.toLowerCase()) {
      case 'bronze': return <BronzeIcon />
      case 'silver': return <SilverIcon />
      case 'gold': return <GoldIcon />
      case 'platinum': return <PlatinumIcon />
      default: return <BronzeIcon />
    }
  }

  const isLoading = loyaltyLoading || referralLoading || tiersLoading

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={currentTheme.primary} />
        <Text style={{ marginTop: 10, color: isDark ? '#9CA3AF' : '#6B7280', fontSize: 14 }}>Loading loyalty data...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.pointsCard}>
          <View style={styles.pointsCardHeader}>
            <Text style={{ color: '#1F2937', fontSize: 15, fontWeight: '700' }}>Your Points Balance</Text>
          </View>

          <View style={styles.pointsCardBody}>
            <View style={styles.pointsRow}>
              <View style={styles.pointsInfo}>
                <Text style={styles.totalPointsText}>{pointsData.totalPoints.toLocaleString()} Points</Text>
                <Text style={styles.headerSubtext}>Your total earned points so far</Text>
              </View>
            </View>

            <View style={styles.dottedBar} />

            <View style={styles.pointsRow}>
              <View style={styles.icon}>
                <MaterialCommunityIcons name='cart-outline' size={18} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </View>
              <View style={styles.pointsInfo}>
                <Text style={styles.pointsLabel}>{pointsData.loyaltyPoints.toLocaleString()} points</Text>
                <Text style={styles.pointsDescription}>From orders</Text>
              </View>
            </View>

            <View style={styles.pointsRow}>
              <View style={styles.icon}>
                <MaterialCommunityIcons name='gift-outline' size={18} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </View>
              <View style={styles.pointsInfo}>
                <Text style={styles.pointsLabel}>{pointsData.referralPoints.toLocaleString()} points</Text>
                <Text style={styles.pointsDescription}>From referrals</Text>
              </View>
            </View>

            <View style={styles.dottedBar} />

            <View style={[styles.pointsRow, styles.pointsRowLast]}>
              <Text style={styles.exchangeText}>Exchange Rate: {pointsData.exchangeRate} points = $1</Text>
            </View>
          </View>
        </View>

        <View style={styles.referralSection}>
          <TouchableOpacity onPress={() => setReferralExpanded(!referralExpanded)} activeOpacity={0.7}>
            <View style={styles.referralHeader}>
              <View style={styles.referralIcon}>
                <Ionicons name='trophy-outline' size={18} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </View>

              <View style={styles.referralTitleContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.referralTitle}>Referral Rewards</Text>
                  <MaterialCommunityIcons
                    name='information-outline'
                    size={16}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                    style={{ marginLeft: 4 }}
                  />
                </View>

                <Text style={styles.referralSubtitle}>{pointsData.referralPoints.toLocaleString()} pts earned so far</Text>
                <Text style={styles.referral2ndSubtitle}>Tap to view detailed breakdown</Text>
              </View>

              <Feather name={referralExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </View>
          </TouchableOpacity>

          {referralExpanded && (
            <View style={styles.referralContent}>
              <View style={styles.tabContainer}>
                <TouchableOpacity 
                  style={[styles.tab, activeTab === 'level1' && styles.activeTab]}
                  onPress={() => setActiveTab('level1')}
                >
                  <Text style={[styles.tabText, activeTab === 'level1' && styles.activeTabText]}>Level 1</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tab, activeTab === 'level2' && styles.activeTab]}
                  onPress={() => setActiveTab('level2')}
                >
                  <Text style={[styles.tabText, activeTab === 'level2' && styles.activeTabText]}>Level 2</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tab, activeTab === 'level3' && styles.activeTab]}
                  onPress={() => setActiveTab('level3')}
                >
                  <Text style={[styles.tabText, activeTab === 'level3' && styles.activeTabText]}>Level 3</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tabContent}>
                {referralsByLevel[activeTab].length > 0 ? (
                  referralsByLevel[activeTab].map((item) => (
                    <View key={item.id} style={styles.listItem}>
                      <View style={styles.listItemLeft}>
                        <Text style={styles.listItemName}>{item.name}</Text>
                      </View>
                      <Text style={styles.listItemPoints}>+{item.points} pts</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No referrals found for this level</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        <View style={styles.loyaltySection}>
          <View style={styles.sectionHeader}>
            <View style={styles.referralIcon}>
              <Ionicons name='gift-outline' size={18} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </View>
            <View style={styles.referralTitleContainer}>
              <Text style={styles.referralTitle}>Your Loyalty Level</Text>
              <Text style={styles.referralSubtitle}>Earn more points to unlock new benefits</Text>
            </View>
          </View>

          {loyaltyTiers.map((tier) => {
            const isUnlocked = pointsData.totalPoints >= tier.points
            const pointsNeeded = tier.points - pointsData.totalPoints
            
            return (
              <View key={tier._id} style={styles.levelCard}>
                <View style={styles.levelBadge}>
                  {getTierIcon(tier.name)}
                </View>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelName}>{tier.name.charAt(0).toUpperCase() + tier.name.slice(1)}</Text>
                  <Text style={styles.levelDescription}>
                    {isUnlocked ? 'Congrats you have unlocked this level' : `${pointsNeeded} more points to unlock`}
                  </Text>
                </View>
                <View style={[styles.levelStatus, isUnlocked ? styles.unlocked : styles.locked]}>
                  <MaterialCommunityIcons name={isUnlocked ? 'check' : 'lock'} size={14} color='#FFFFFF' />
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default LoyaltyPoints