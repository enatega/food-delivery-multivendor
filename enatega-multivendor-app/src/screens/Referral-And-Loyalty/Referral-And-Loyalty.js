import { useState, useLayoutEffect, useContext } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, FlatList } from 'react-native'
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons'

import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { HeaderBackButton } from '@react-navigation/elements'
import { scale } from '../../utils/scaling'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'

function ReferralAndLoyaltyRewards(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  // Sontats
  const [loading, loadingSetter] = useState(true)
  const [activities] = useState([
    {
      id: '1',
      title: '+120 pts from new order',
      description: 'Sofia joined using your code #4532',
      points: 120,
      time: '10:42 AM · Today',
      icon: 'shopping'
    },
    {
      id: '2',
      title: '+250 pts from referral',
      description: 'Sofia joined using your code',
      points: 250,
      time: 'Yesterday',
      icon: 'share',
      isNegative: false
    },
    {
      id: '3',
      title: '-400 pts redeemed',
      description: 'Used points for discount on your last order',
      points: -400,
      time: '2 days ago',
      icon: 'gift',
      isNegative: true
    },
    {
      id: '4',
      title: '+80 pts from in-store purchase',
      description: 'Earned by scanning QR at checkout',
      points: 80,
      time: '3 days ago',
      icon: 'shop',
      isNegative: false
    },
    {
      id: '4',
      title: '+80 pts from in-store purchase',
      description: 'Earned by scanning QR at checkout',
      points: 80,
      time: '3 days ago',
      icon: 'shop',
      isNegative: false
    },
    {
      id: '4',
      title: '+80 pts from in-store purchase',
      description: 'Earned by scanning QR at checkout',
      points: 80,
      time: '3 days ago',
      icon: 'shop',
      isNegative: false
    },
    {
      id: '4',
      title: '+8990 pts from in-store purchase',
      description: 'Earned by scanning QR at checkout',
      points: 80,
      time: '3 days ago',
      icon: 'shop',
      isNegative: false
    }
  ])

  // Handlers
  const renderActivityIcon = (iconType) => {
    const iconProps = { size: 20, color: '#059669' }
    switch (iconType) {
      case 'shopping':
        return <Feather name='shopping-cart' {...iconProps} />
      case 'share':
        return <MaterialCommunityIcons name='trending-up' {...iconProps} />
      case 'gift':
        return <Ionicons name='gift' size={20} color='#dc2626' />
      case 'shop':
        return <Feather name='shopping-bag' {...iconProps} />
      default:
        return <Feather name='shopping-cart' {...iconProps} />
    }
  }

  const renderActivity = ({ item: activity }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>{renderActivityIcon(activity.icon)}</View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityDesc}>{activity.description}</Text>
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
      <View style={styles.activityMeta}>
        <Feather name='clock' size={12} color='#9ca3af' />
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
    </View>
  )

  // Effects
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
                width: 55,
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name='chevron-left' size={24} color='#000' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loyalty rewards</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Loyalty Points Card */}
      <View style={styles.loyaltyCard}>
        <View style={styles.loyaltyCardFirstChild}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.cardTitle}>Loyalty Points</Text>
              <View style={styles.tier}>
                <Text style={styles.tierText}>🏅 Gold</Text>
              </View>
            </View>
          </View>

          <View style={styles.pointsContainer}>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsText}>Points</Text>
              <Text style={styles.pointsValue}>1900pts</Text>
            </View>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsValue}>19 $</Text>
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>🏅 100 points until Gold</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '95%' }]} />
            </View>
            <Text style={styles.progressText}>1900/2000</Text>
          </View>
        </View>

        {/* See Details Link */}
        <View style={styles.loyaltyCardSecondChild}>
          <View style={styles.detailsLink}>
            <Text style={styles.detailsText}>See details</Text>
            <Feather name='chevron-right' size={20} color='#0F172A' />
          </View>
        </View>
      </View>

      {/* Refer & Earn Points */}
      <View style={styles.section}>
        <View style={styles.referCard}>
          <View style={styles.referContent}>
            <View style={styles.referIcon}>
              <Feather name='gift' size={20} color='#6b7280' />
            </View>
            <View style={styles.referText}>
              <Text style={styles.referLabel}>Refer & Earn Points</Text>
              <Text style={styles.referDesc}>Invite or scan qr code to earn points</Text>
            </View>
          </View>
          <Feather name='chevron-right' size={20} color='#0F172A' />
        </View>
      </View>

      {/* Recent Activity Header */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity style={styles.sectionAction}>
            <Text style={styles.sectionActionText}>See All</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{height:1, width:"auto", backgroundColor:"#E5E7EB"}}/>
      <FlatList data={activities} renderItem={renderActivity} keyExtractor={(item) => item.id} scrollEnabled={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center'
  },
  scrollContent: {
    paddingBottom: 24
  },
  loyaltyCard: {
    margin: 16,
    backgroundColor: '#5AC12F',
    borderRadius: 12,
    paddingBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  loyaltyCardFirstChild: {
    padding: 16
  },
  loyaltyCardSecondChild: {
    borderBottomEndRadius: 12,
    borderBottomStartRadius: 12,
    backgroundColor: '#F8F9FA'
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  tier: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4
  },
  tierText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff'
  },
  pointsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  pointsBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  pointsText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14
  },
  pointsValue: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14
  },
  progressContainer: {
    marginBottom: 12
  },
  progressLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    fontWeight: '500'
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 4
  },
  progressText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)'
  },
  detailsLink: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4
  },
  detailsText: {
    color: '#5AC12F',
    fontSize: 14,
    fontWeight: '500'
  },
  section: {
    marginHorizontal: 16,
    // marginBottom: 10
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000'
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  sectionActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#63C43B',
    backgroundColor: '#F3FFEE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8
  },
  referCard: {
    flexDirection: 'row',
    // backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between'
    // borderWidth: 1,
    // borderColor: '#e5e7eb'
  },
  referContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  referIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#e5e7eb',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  referText: {
    flex: 1
  },
  referLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000'
  },
  referDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  activityContent: {
    flex: 1
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000'
  },
  activityDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4
  },
  activityTime: {
    fontSize: 11,
    color: '#9ca3af'
  },
  activityPoints: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669'
  },
  activityPointsNegative: {
    color: '#dc2626'
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -8,
    borderWidth: 2,
    borderColor: '#fff'
  },
  avatarText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600'
  },
  iconButton: {
    padding: 8
  }
})
export default ReferralAndLoyaltyRewards
