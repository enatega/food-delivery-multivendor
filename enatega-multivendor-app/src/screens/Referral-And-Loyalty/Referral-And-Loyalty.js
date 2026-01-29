import { useLayoutEffect, useContext } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList } from 'react-native'
import { MaterialCommunityIcons, Feather, Ionicons, Fontisto } from '@expo/vector-icons'

import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { HeaderBackButton } from '@react-navigation/elements'
import { scale } from '../../utils/scaling'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
import { useNavigation } from '@react-navigation/native'
import { useQuery } from '@apollo/client'
import { FETCH_LOYALTY_CONFIGURATIon, FETCH_LOYALTY_REFERRAL_HISTORY, FETCH_LOYALTY_TIERS } from '../../apollo/queries'
import { useUserContext } from '../../context/User'
import { toTitleCase } from '../../utils/string-transformer'
import { getReferralIcon } from '../../utils/loyalty-helper'

function ReferralAndLoyaltyRewards(props) {
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { profile } = useUserContext()
  const isDark = themeContext.ThemeValue === 'Dark'

  const { data } = useQuery(FETCH_LOYALTY_CONFIGURATIon, { fetchPolicy: 'cache-and-network' })
  const { data: loyaltyActivityData } = useQuery(FETCH_LOYALTY_REFERRAL_HISTORY, {
    variables: {
      filter: {
        userId: profile?._id
      }
    },
    fetchPolicy: 'cache-and-network'
  })
  const { data: tiersData } = useQuery(FETCH_LOYALTY_TIERS, { fetchPolicy: 'cache-and-network' })
  const loyalty_configuration = data?.fetchLoyaltyConfiguration
  const loyaltyActivity = loyaltyActivityData?.fetchReferralLoyaltyHistory
  const loyaltyTiers = tiersData?.fetchLoyaltyTiers

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.themeBackground
    },
    loyaltyCard: {
      margin: 16,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      overflow: 'hidden'
    },
    loyaltyCardFirstChild: {
      backgroundColor: currentTheme.primary,
      padding: 16
    },
    loyaltyCardSecondChild: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF'
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12
    },
    cardLeft: {
      flex: 1
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: 4
    },
    tier: {
      backgroundColor: 'rgba(31, 41, 55, 0.15)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center'
    },
    tierText: {
      fontSize: 10,
      fontWeight: '600',
      color: '#1F2937',
      marginLeft: 2
    },
    conversionBadge: {
      backgroundColor: 'rgba(31, 41, 55, 0.1)',
      borderRadius: 8,
      padding: 4,
      alignItems: 'center',
      minWidth: 50
    },
    conversionText: {
      color: '#374151',
      fontSize: 8,
      fontWeight: '600',
      marginBottom: 1
    },
    conversionValue: {
      color: '#1F2937',
      fontSize: 9,
      fontWeight: '700'
    },
    conversionArrow: {
      marginVertical: 1
    },
    pointsBadgeContainer: {
      alignItems: 'center',
      marginBottom: 8
    },
    pointsBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1
    },
    pointsText: {
      color: '#1F2937',
      fontWeight: '600',
      fontSize: 10,
      marginBottom: 2
    },
    pointsValue: {
      color: '#1F2937',
      fontWeight: '800',
      fontSize: 18
    },
    totalEarnedText: {
      fontSize: 10,
      color: '#374151',
      textAlign: 'center',
      marginBottom: 8
    },
    progressContainer: {
      marginTop: 8
    },
    progressLabel: {
      fontSize: 10,
      color: '#374151',
      marginBottom: 6,
      fontWeight: '500',
      textAlign: 'center'
    },
    progressBarContainer: {
      backgroundColor: 'rgba(31, 41, 55, 0.2)',
      height: 6,
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 6
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#1F2937',
      borderRadius: 3
    },
    progressTextContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    progressText: {
      fontSize: 8,
      color: '#4B5563',
      fontWeight: '500'
    },
    detailsLink: {
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    detailsText: {
      color: currentTheme.primary,
      fontSize: 14,
      fontWeight: '600'
    },
    section: {
      marginHorizontal: 16,
      marginBottom: 8,
      paddingRight: 0
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: currentTheme.fontMainColor
    },
    sectionAction: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    sectionActionText: {
      fontSize: 12,
      fontWeight: '600',
      color: currentTheme.primary,
      backgroundColor: isDark ? `rgba(${parseInt(currentTheme.primary.slice(1, 3), 16)}, ${parseInt(currentTheme.primary.slice(3, 5), 16)}, ${parseInt(currentTheme.primary.slice(5, 7), 16)}, 0.1)` : '#F0FDF4',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6
    },
    referCard: {
      flexDirection: 'row',
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB',
      marginBottom: 4
    },
    referContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    referIcon: {
      width: 36,
      height: 36,
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
    referText: {
      flex: 1
    },
    referLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: currentTheme.fontMainColor,
      marginBottom: 2
    },
    referDesc: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280'
    },
    activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#374151' : '#F3F4F6'
    },
    activityIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center'
    },
    activityContent: {
      flex: 1
    },
    activityTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: currentTheme.fontMainColor,
      marginBottom: 2
    },
    activityDesc: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280'
    },
    activityMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4
    },
    activityTime: {
      fontSize: 10,
      color: isDark ? '#9CA3AF' : '#6B7280'
    },
    avatarGroup: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: currentTheme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: -8,
      borderWidth: 2,
      borderColor: currentTheme.themeBackground
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600'
    }
  })

  const renderActivityIcon = (activity) => {
    const { source } = activity
    const iconProps = { size: 20, color: currentTheme.primary }
    switch (source) {
      case 'order':
        return <Feather name='shopping-cart' {...iconProps} />
      case 'signup':
        return <MaterialCommunityIcons name='trending-up' {...iconProps} />
      case 'gift':
        return <Ionicons name='gift' size={20} color='#EF4444' />
      case 'shop':
        return <Feather name='shopping-bag' {...iconProps} />
      default:
        return <Feather name='shopping-cart' {...iconProps} />
    }
  }

  const generateTitle = (activity) => {
    const { source, value } = activity
    switch (source) {
      case 'signup':
        return `+${value} pts from referral`
      case 'order':
        return `+${value} pts from new order`
    }
  }

  const generateDescription = (activity) => {
    const { source, triggeredBy, level } = activity
    switch (source) {
      case 'signup':
        return `${triggeredBy} signed up using ${level === 1 ? "your" : `level ${level}`} referral`
      case 'order':
        return ''
    }
  }

  const renderActivity = ({ item: activity }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>{renderActivityIcon(activity)}</View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{generateTitle(activity)}</Text>
        <Text style={styles.activityDesc}>{generateDescription(activity)}</Text>
        <View style={styles.activityMeta}>
          <Feather name='clock' size={10} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <Text style={styles.activityTime}>{new Date(parseInt(activity.createdAt)).toLocaleString()}</Text>
        </View>
      </View>
      {activity.id === '2' && (
        <View style={styles.avatarGroup}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>S</Text>
          </View>
          <View style={[styles.avatar, { marginRight: 0, marginLeft: -8 }]}>
            <Text style={styles.avatarText}>H</Text>
          </View>
        </View>
      )}
    </View>
  )

  useLayoutEffect(() => {
    props?.navigation.setOptions({
      headerRight: null,
      headerTitle: 'Loyalty Rewards',
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loyaltyCard}>
        <View style={styles.loyaltyCardFirstChild}>
          <View style={styles.cardHeader}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardTitle}>Loyalty Points</Text>
              <View style={styles.tier}>
                <Text>{getReferralIcon(profile?.tier?.current_tier_name)}</Text>
                <Text style={styles.tierText}>{toTitleCase(profile?.tier?.current_tier_name)}</Text>
              </View>
            </View>
            
            <View style={styles.conversionBadge}>
              <Text style={styles.conversionText}>{loyalty_configuration?.pointsPerDollar}pts</Text>
              <View style={styles.conversionArrow}>
                <Fontisto name='arrow-swap' color='#4B5563' size={8} />
              </View>
              <Text style={styles.conversionValue}>1$</Text>
            </View>
          </View>

          <View style={styles.pointsBadgeContainer}>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsText}>Total Earned Points</Text>
              <Text style={styles.pointsValue}>{(profile?.tier?.current_earned_points || 0).toLocaleString()}</Text>
            </View>
          </View>

          <Text style={styles.totalEarnedText}>
            Total earned: {(profile?.tier?.total_earned_points || profile?.tier?.current_earned_points || 0).toLocaleString()} points
          </Text>

          {(() => {
            const currentPoints = profile?.tier?.current_earned_points || 0
            const nextTierPoints = profile?.tier?.next_tier_points
            const nextTierName = profile?.tier?.next_tier_name
            const currentTierName = profile?.tier?.current_tier_name?.toLowerCase()
            
            // Debug logging
            console.log('Tier Debug:', {
              currentTierName,
              currentPoints,
              nextTierPoints,
              nextTierName,
              isMaxTier: currentTierName === 'platinum'
            })
            
            // Hide progress bar if user has reached maximum tier or no next tier
            if (!nextTierPoints || !nextTierName || currentPoints >= nextTierPoints) {
              return (
                <Text style={[styles.progressLabel, { textAlign: 'center', marginTop: 8 }]}>
                  <Feather name='award' color='#374151' size={10} /> Congratulations! You've reached the maximum tier
                </Text>
              )
            }
            
            return (
              <View style={styles.progressContainer}>
                <Text style={styles.progressLabel}>
                  <Feather name='database' color='#374151' size={10} /> {nextTierPoints - currentPoints} points until {toTitleCase(nextTierName)}
                </Text>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressFill, { 
                    width: `${Math.min((currentPoints / nextTierPoints) * 100, 100)}%`
                  }]} />
                </View>
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressText}>{toTitleCase(nextTierName)}</Text>
                  <Text style={styles.progressText}>
                    {currentPoints}/{nextTierPoints}
                  </Text>
                </View>
              </View>
            )
          })()}
        </View>

        <View style={styles.loyaltyCardSecondChild}>
          <TouchableOpacity onPress={() => navigation.navigate('LoyaltyPoints')}>
            <View style={styles.detailsLink}>
              <Text style={styles.detailsText}>See details</Text>
              <Feather name='chevron-right' size={16} color={currentTheme.primary} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity onPress={() => navigation.navigate('QRAndReferral')}>
          <View style={styles.referCard}>
            <View style={styles.referContent}>
              <View style={styles.referIcon}>
                <Feather name='gift' size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </View>
              <View style={styles.referText}>
                <Text style={styles.referLabel}>Refer & Earn Points</Text>
                <Text style={styles.referDesc}>Invite or scan qr code to earn points</Text>
              </View>
            </View>
            <Feather name='chevron-right' size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity style={styles.sectionAction} onPress={() => navigation.navigate('ReferralAndLoyaltyRecentActivity')}>
            <Text style={styles.sectionActionText}>See All</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList 
        data={(loyaltyActivity || []).slice(0, 5)} 
        renderItem={renderActivity} 
        keyExtractor={(item) => item._id} 
        scrollEnabled={true} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 24 }} 
      />
    </SafeAreaView>
  )
}

export default ReferralAndLoyaltyRewards