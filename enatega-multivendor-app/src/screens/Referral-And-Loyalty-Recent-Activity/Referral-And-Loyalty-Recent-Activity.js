import { useLayoutEffect, useContext, useState, useEffect } from 'react'
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons'
import { useQuery } from '@apollo/client'
import { FETCH_LOYALTY_REFERRAL_HISTORY } from '../../apollo/queries'

import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { HeaderBackButton } from '@react-navigation/elements'
import { scale } from '../../utils/scaling'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
import { useUserContext } from '../../context/User'

function ReferralAndLoyaltyRecentActivity(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const [activities, setActivities] = useState([])
  const isDark = themeContext.ThemeValue === 'Dark'
  
  const { profile } = useUserContext()
  const { data, loading, error } = useQuery(FETCH_LOYALTY_REFERRAL_HISTORY, {
    variables: {
      filter: {
        userId: profile?._id
      }
    },
    fetchPolicy: 'cache-and-network',
    skip: !profile?._id,
    onError: (error) => {
      console.log('FETCH_LOYALTY_REFERRAL_HISTORY Error:', error)
    },
    onCompleted: (data) => {
      console.log('FETCH_LOYALTY_REFERRAL_HISTORY Data:', data)
    }
  })

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.themeBackground
    },
    activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#374151' : '#F3F4F6',
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB'
    },
    activityIcon: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center'
    },
    activityContent: {
      flex: 1
    },
    activityTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: currentTheme.fontMainColor,
      marginBottom: 4
    },
    activityDesc: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 8
    },
    activityMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6
    },
    activityTime: {
      fontSize: 12,
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
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280'
    },
    debugText: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      marginTop: 8
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16
    },
    emptyText: {
      fontSize: 20,
      fontWeight: '600',
      color: currentTheme.fontMainColor,
      marginBottom: 8,
      textAlign: 'center'
    },
    emptySubText: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      lineHeight: 24
    }
  })

  useEffect(() => {
    if (data?.fetchCustomerReferralHistory && Array.isArray(data.fetchCustomerReferralHistory)) {
      try {
        const formattedActivities = data.fetchCustomerReferralHistory
          .filter(activity => activity && activity._id && activity.value && activity.createdAt)
          .sort((a, b) => new Date(parseInt(b.createdAt)) - new Date(parseInt(a.createdAt)))
          .map(activity => ({
            id: activity._id,
            title: `+${activity.value} pts from ${activity.source === 'signup' ? 'referral' : activity.source || 'activity'}`,
            description: activity.source === 'signup' 
              ? `${activity.triggeredBy || 'Someone'} signed up using ${activity.level === 1 ? "your" : `level ${activity.level || 1}`} referral`
              : activity.type || 'Activity completed',
            points: activity.value,
            time: new Date(parseInt(activity.createdAt)).toLocaleDateString(),
            icon: activity.source === 'signup' ? 'share' : 'shopping',
            isNegative: false,
            source: activity.source || 'unknown'
          }))
        setActivities(formattedActivities)
      } catch (err) {
        console.error('Error processing activities:', err)
        setActivities([])
      }
    } else if (data?.fetchCustomerReferralHistory === null) {
      setActivities([])
    }
  }, [data])

  const renderActivityIcon = (activity) => {
    const { source } = activity
    const iconProps = { size: 24, color: currentTheme.primary }
    switch (source) {
      case 'order':
        return <Feather name='shopping-cart' {...iconProps} />
      case 'signup':
        return <MaterialCommunityIcons name='trending-up' {...iconProps} />
      case 'gift':
        return <Ionicons name='gift' size={24} color='#EF4444' />
      case 'shop':
        return <Feather name='shopping-bag' {...iconProps} />
      default:
        return <Feather name='shopping-cart' {...iconProps} />
    }
  }

  const renderActivity = ({ item: activity }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>{renderActivityIcon(activity)}</View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        {activity.description ? <Text style={styles.activityDesc}>{activity.description}</Text> : null}
        <View style={styles.activityMeta}>
          <Feather name='clock' size={12} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <Text style={styles.activityTime}>{activity.time}</Text>
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
          <ActivityIndicator size="large" color={currentTheme.primary} />
          <Text style={styles.loadingText}>Loading activities...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Feather name="alert-circle" size={32} color="#EF4444" />
          </View>
          <Text style={styles.emptyText}>Error loading activities</Text>
          <Text style={styles.emptySubText}>{error.message || 'Something went wrong. Please try again.'}</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!loading && activities.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Feather name="activity" size={32} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </View>
          <Text style={styles.emptyText}>No referral activities yet</Text>
          <Text style={styles.emptySubText}>Start referring friends to see your activity here!</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList 
        data={activities} 
        renderItem={renderActivity} 
        keyExtractor={(item) => item.id} 
        scrollEnabled={true} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }} 
      />
    </SafeAreaView>
  )
}

export default ReferralAndLoyaltyRecentActivity