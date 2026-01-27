// import React, { useContext } from 'react'
// import { View, StyleSheet } from 'react-native'
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
// import { useTranslation } from 'react-i18next'
// import ThemeContext from '../../../../ui/ThemeContext/ThemeContext'
// import { theme } from '../../../../utils/themeColors'
// import { scale } from '../../../../utils/scaling'
// import TextDefault from '../../../../components/Text/TextDefault/TextDefault'

// const ORDER_STATUSES = {
//   // PENDING:'PENDING'
//   // CONFIRMED: 'confirmed',
//   // PACKED: 'packed',
//   // PICKED_UP: 'picked_up',
//   // ON_THE_WAY: 'on_the_way',
//   // DELIVERED: 'delivered'
//   PENDING: 'PENDING',
//   ACCEPTED: 'ACCEPTED',
//   ASSIGNED: 'ASSIGNED',
//   PICKED: 'PICKED',
//   DELIVERED: 'DELIVERED',
//   COMPLETED: 'COMPLETED',
//   CANCELLED: 'CANCELLED',
//   CANCELLEDBYREST: 'CANCELLEDBYREST'
// }

// const OrderStatusTimeline = ({ currentStatus, statusTimes = {} }) => {
//   const { t, i18n } = useTranslation()
//   const themeContext = useContext(ThemeContext)
//   const currentTheme = {
//     isRTL: i18n.dir() === 'rtl',
//     ...theme[themeContext.ThemeValue]
//   }

//   const statuses = [
//     { key: ORDER_STATUSES.CONFIRMED, label: t('Order confirmed') || 'Order confirmed', icon: 'check' },
//     { key: ORDER_STATUSES.PACKED, label: t('Packed') || 'Packed', icon: 'package' },
//     { key: ORDER_STATUSES.PICKED_UP, label: t('Picked up') || 'Picked up', icon: 'check' },
//     { key: ORDER_STATUSES.ON_THE_WAY, label: t('On the way') || 'On the way', icon: 'bike' }
//   ]

//   const getStatusIndex = (status) => statuses.findIndex((s) => s.key === status)
//   const currentIndex = getStatusIndex(currentStatus)

//   const getStatusState = (index) => {
//     if (index < currentIndex) return 'completed'
//     if (index === currentIndex) return 'active'
//     return 'pending'
//   }

//   const getStatusText = (status, state) => {
//     // Only show time for completed statuses
//     if (state === 'completed') {
//       const time = statusTimes[status.key]
//       if (time) return time
//     }
//     // Show progress text for active status
//     if (state === 'active') {
//       if (status.key === ORDER_STATUSES.PACKED) return t('Packing...') || 'Packing...'
//       if (status.key === ORDER_STATUSES.PICKED_UP) return t('Picking...') || 'Picking...'
//     }
//     // Pending statuses show nothing
//     return ''
//   }

//   const renderIcon = (status, state, index) => {
//     const isCompleted = state === 'completed'
//     const isActive = state === 'active'
//     const iconColor = isCompleted || isActive ? currentTheme.primaryBlue || '#0EA5E9' : currentTheme.gray400
//     const bgColor = isCompleted ? currentTheme.primaryBlue || '#0EA5E9' : 'transparent'

//     if (status.icon === 'bike') {
//       return (
//         <View style={[styles().iconContainer, { backgroundColor: bgColor }]}>
//           <MaterialCommunityIcons name='bike-fast' size={18} color={isCompleted ? '#fff' : iconColor} />
//         </View>
//       )
//     }

//     if (status.icon === 'package' && isActive) {
//       return (
//         <View style={[styles().iconContainer, styles(currentTheme).activeIcon]}>
//           <Feather name='refresh-cw' size={16} color={currentTheme.primaryBlue || '#0EA5E9'} />
//         </View>
//       )
//     }

//     return (
//       <View style={[styles().iconContainer, isCompleted && { backgroundColor: currentTheme.primaryBlue || '#0EA5E9' }]}>
//         <Feather name={isCompleted ? 'check' : status.icon} size={16} color={isCompleted ? '#fff' : iconColor} />
//       </View>
//     )
//   }

//   return (
//     <View style={styles(currentTheme).container}>
//       {statuses.map((status, index) => {
//         const state = getStatusState(index)
//         const isLast = index === statuses.length - 1
//         const statusText = getStatusText(status, state)

//         return (
//           <View key={status.key} style={styles().statusItem}>
//             <View style={styles().leftSection}>
//               {renderIcon(status, state, index)}
//               {!isLast && <View style={[styles().connector, state === 'completed' && { backgroundColor: currentTheme.singlevendorcolor || '#0090CD' }]} />}
//             </View>
//             <View style={styles().contentSection}>
//               <TextDefault textColor={state === 'pending' ? currentTheme.gray400 : currentTheme.fontMainColor} bold={state !== 'pending'} isRTL>
//                 {status.label}
//               </TextDefault>
//             </View>
//             <View style={styles().rightSection}>
//               <TextDefault textColor={currentTheme.gray500} small isRTL bold>
//                 {statusText}
//               </TextDefault>
//             </View>
//           </View>
//         )
//       })}
//     </View>
//   )
// }

// const styles = (props = null) =>
//   StyleSheet.create({
//     container: {
//       paddingHorizontal: scale(16),
//       paddingTop: scale(16)
//     },
//     statusItem: {
//       flexDirection: 'row',
//       alignItems: 'flex-start',
//       minHeight: scale(48)
//     },
//     leftSection: {
//       alignItems: 'center',
//       width: scale(32)
//     },
//     iconContainer: {
//       width: scale(28),
//       height: scale(28),
//       borderRadius: scale(14),
//       alignItems: 'center',
//       justifyContent: 'center',
//       backgroundColor: props?.gray100 || '#F3F4F6'
//     },
//     activeIcon: {
//       backgroundColor: props?.blue50 || '#EFF6FF'
//     },
//     connector: {
//       width: 2,
//       flex: 1,
//       minHeight: scale(20),
//       backgroundColor: props?.gray200 || '#E5E7EB',
//       marginVertical: scale(4)
//     },
//     contentSection: {
//       flex: 1,
//       paddingLeft: scale(12),
//       paddingTop: scale(4)
//     },
//     rightSection: {
//       paddingTop: scale(4)
//     }
//   })

// export { ORDER_STATUSES }
// export default OrderStatusTimeline



import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

import ThemeContext from '../../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../../utils/themeColors'
import { scale } from '../../../../utils/scaling'
import TextDefault from '../../../../components/Text/TextDefault/TextDefault'

/**
 * Backend enums (DO NOT CHANGE)
 */
export const ORDER_STATUSES = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  ASSIGNED: 'ASSIGNED',
  PICKED: 'PICKED',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  CANCELLEDBYREST: 'CANCELLEDBYREST'
}

/**
 * UI timeline mapping (ORDER MATTERS)
 */
const TIMELINE_STATUSES = [
  {
    key: ORDER_STATUSES.ACCEPTED,
    labelKey: 'Order accepted',
    icon: 'check'
  },
  {
    key: ORDER_STATUSES.ASSIGNED,
    labelKey: 'Rider assigned',
    icon: 'user'
  },
  {
    key: ORDER_STATUSES.PICKED,
    labelKey: 'Picked up',
    icon: 'package'
  },
  {
    key: ORDER_STATUSES.DELIVERED,
    labelKey: 'On the way',
    icon: 'bike'
  }
]

const PICKED_UP_TIMELINE_STATUSES = [
  {
    key: ORDER_STATUSES.ACCEPTED,
    labelKey: 'Order acceptedd',
    icon: 'check'
  },
  {
    key: ORDER_STATUSES.DELIVERED,
    labelKey: 'Collected',
    icon: 'package'
  }
]

const OrderStatusTimeline = ({ currentStatus, statusTimes = {}, isPickUpOrder }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const decidedStatuses = isPickUpOrder ? PICKED_UP_TIMELINE_STATUSES : TIMELINE_STATUSES

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const getCurrentIndex = () =>
    decidedStatuses.findIndex((s) => s.key === currentStatus)

  const currentIndex = getCurrentIndex()

  const getState = (index) => {
    if (index < currentIndex) return 'completed'
    if (index === currentIndex) return 'active'
    return 'pending'
  }

  const renderIcon = (status, state) => {
    const isCompleted = state === 'completed'
    const isActive = state === 'active'

    const color =
      isCompleted || isActive
        ? currentTheme.primaryBlue
        : currentTheme.gray400

    if (status.icon === 'bike') {
      return (
        <View style={[styles(currentTheme).iconContainer, isCompleted && styles(currentTheme).completed]}>
          <MaterialCommunityIcons
            name="bike-fast"
            size={18}
            color={isCompleted ? '#fff' : color}
          />
        </View>
      )
    }

    return (
      <View
        style={[
          styles(currentTheme).iconContainer,
          isCompleted && styles(currentTheme).completed,
          isActive && styles(currentTheme).active
        ]}
      >
        <Feather
          name={isCompleted ? 'check' : status.icon}
          size={16}
          color={isCompleted ? '#fff' : color}
        />
      </View>
    )
  }

  return (
    <View style={styles(currentTheme).container}>
      {decidedStatuses.map((status, index) => {
        const state = getState(index)
        const isLast = index === decidedStatuses.length - 1

        return (
          <View key={status.key} style={styles(currentTheme).row}>
            <View style={styles(currentTheme).left}>
              {renderIcon(status, state)}
              {!isLast && (
                <View
                  style={[
                    styles(currentTheme).line,
                    state === 'completed' && {
                      backgroundColor: currentTheme.primaryBlue
                    }
                  ]}
                />
              )}
            </View>

            <View style={styles(currentTheme).center}>
              <TextDefault
                bold={state !== 'pending'}
                textColor={
                  state === 'pending'
                    ? currentTheme.gray400
                    : currentTheme.fontMainColor
                }
                isRTL
              >
                {t(status.labelKey)}
              </TextDefault>
            </View>

            <View style={styles(currentTheme).right}>
              <TextDefault small textColor={currentTheme.gray500} isRTL>
                {state === 'completed' ? statusTimes?.[status.key] || '' : ''}
              </TextDefault>
            </View>
          </View>
        )
      })}
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    container: {
      padding: scale(16)
    },
    row: {
      flexDirection: 'row',
      minHeight: scale(50)
    },
    left: {
      width: scale(32),
      alignItems: 'center'
    },
    iconContainer: {
      width: scale(28),
      height: scale(28),
      borderRadius: scale(14),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.gray100
    },
    completed: {
      backgroundColor: theme.primaryBlue
    },
    active: {
      backgroundColor: theme.blue50
    },
    line: {
      width: 2,
      flex: 1,
      backgroundColor: theme.gray200,
      marginVertical: scale(4)
    },
    center: {
      flex: 1,
      paddingLeft: scale(12),
      paddingTop: scale(4)
    },
    right: {
      paddingTop: scale(4)
    }
  })

export default OrderStatusTimeline
