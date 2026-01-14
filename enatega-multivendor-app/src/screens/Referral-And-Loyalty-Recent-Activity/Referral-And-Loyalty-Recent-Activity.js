import { useLayoutEffect, useContext, useState, useEffect } from 'react'
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons'
import { useQuery } from '@apollo/client'
import { GET_REFERRAL_ACTIVITIES } from '../../apollo/queries'

import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { HeaderBackButton } from '@react-navigation/elements'
import { scale } from '../../utils/scaling'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
function ReferralAndLoyaltyRecentActivity(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const [activities, setActivities] = useState([])
  
  const { data, loading, error } = useQuery(GET_REFERRAL_ACTIVITIES, {
    fetchPolicy: 'cache-and-network'
  })

  useEffect(() => {
    if (data?.getReferralActivities) {
      const formattedActivities = data.getReferralActivities.map(activity => ({
        id: activity._id,
        title: `+${activity.points} pts from ${activity.type === 'REFERRAL_SIGNUP' ? 'referral' : 'order'}`,
        description: activity.type === 'REFERRAL_SIGNUP' 
          ? `${activity.referredUser?.name || 'Someone'} joined using your code`
          : `Earned from order #${activity.orderId || 'N/A'}`,
        points: activity.points,
        time: new Date(activity.createdAt).toLocaleDateString(),
        icon: activity.type === 'REFERRAL_SIGNUP' ? 'share' : 'shopping',
        isNegative: false
      }))
      setActivities(formattedActivities)
    }
  }, [data])

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
      headerTitle: 'Recent Activity',
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={currentTheme.main} />
          <Text style={styles.loadingText}>Loading activities...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error || activities.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Feather name="activity" size={48} color="#9ca3af" />
          <Text style={styles.emptyText}>No referral activities yet</Text>
          <Text style={styles.emptySubText}>Start referring friends to see your activity here!</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={activities} renderItem={renderActivity} keyExtractor={(item) => item.id} scrollEnabled={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    textAlign: 'center'
  },
  emptySubText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center'
  }
})
export default ReferralAndLoyaltyRecentActivity
