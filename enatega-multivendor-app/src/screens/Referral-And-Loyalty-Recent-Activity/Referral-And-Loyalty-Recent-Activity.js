import { useLayoutEffect, useContext } from 'react'
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native'
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons'

import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { HeaderBackButton } from '@react-navigation/elements'
import { scale } from '../../utils/scaling'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'

const activities = [
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
    id: '5',
    title: '+80 pts from in-store purchase',
    description: 'Earned by scanning QR at checkout',
    points: 80,
    time: '3 days ago',
    icon: 'shop',
    isNegative: false
  },
  {
    id: '6',
    title: '+80 pts from in-store purchase',
    description: 'Earned by scanning QR at checkout',
    points: 80,
    time: '3 days ago',
    icon: 'shop',
    isNegative: false
  },
  {
    id: '7',
    title: '+8990 pts from in-store purchase',
    description: 'Earned by scanning QR at checkout',
    points: 80,
    time: '3 days ago',
    icon: 'shop',
    isNegative: false
  }
]
function ReferralAndLoyaltyRecentActivity(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

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
  }
})
export default ReferralAndLoyaltyRecentActivity
