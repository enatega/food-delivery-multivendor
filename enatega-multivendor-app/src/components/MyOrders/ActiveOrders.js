import React, { useContext } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useSubscription } from '@apollo/client'
import gql from 'graphql-tag'
import { subscriptionOrder } from '../../apollo/subscriptions'
import Heading from '../../components/MyOrders/Heading'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextDefault from '../Text/TextDefault/TextDefault'
import TextError from '../Text/TextError/TextError'
import { alignment } from '../../utils/alignment'
import styles from './styles'

const ActiveOrders = ({
  navigation,
  loading,
  error,
  activeOrders,
  showActiveHeader,
  showPastHeader
}) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  if (loading) {
    return <></>
  }
  if (error) return <TextError text={error.message} />

  return (
    <React.Fragment>
      {showActiveHeader && (
        <Heading headerName="Active Order" textWidth="40%" lineWidth="30%" />
      )}
      {activeOrders.map((item, index) => (
        <Item
          key={index.toString()}
          item={item}
          navigation={navigation}
          currentTheme={currentTheme}
        />
      ))}
      {showPastHeader && (
        <Heading headerName="Past Order" textWidth="34%" lineWidth="33%" />
      )}
    </React.Fragment>
  )
}

const Item = ({ item, navigation, currentTheme }) => {
  useSubscription(
    gql`
      ${subscriptionOrder}
    `,
    { variables: { id: item._id } }
  )
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('OrderDetail', { _id: item._id })}>
      <View style={styles(currentTheme).container}>
        <View style={styles().leftContainer}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            small
            bold
            style={alignment.MBxSmall}>
            {item.restaurant.name}
          </TextDefault>
          <TextDefault
            line={3}
            textColor={currentTheme.fontSecondColor}
            small
            bold>
            {item.orderStatus === 'PENDING'
              ? "We're asking the restaurant how long it will take to deliver your food."
              : 'The restaurant rider will be at your place around.'}
          </TextDefault>
        </View>

        <View style={styles(currentTheme).line} />
        <View style={styles().rightContainer}>
          <TextDefault textColor={currentTheme.iconColorPink} bold center>
            {' '}
            {item.orderStatus}
          </TextDefault>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ActiveOrders
