import React, { useContext } from 'react'
import { View, TouchableOpacity, Pressable } from 'react-native'
import { useSubscription } from '@apollo/client'
import gql from 'graphql-tag'
import { subscriptionOrder } from '../../apollo/subscriptions'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextDefault from '../Text/TextDefault/TextDefault'
import TextError from '../Text/TextError/TextError'
import ConfigurationContext from '../../context/Configuration'
import { alignment } from '../../utils/alignment'
import styles from './styles'

const InActiveOrders = ({ navigation, loading, error, order }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const configuration = useContext(ConfigurationContext)

  if (loading) {
    return <></>
  }
  if (error) return <TextError text={error.message} />

  useSubscription(
    gql`
      ${subscriptionOrder}
    `,
    { variables: { id: order._id } }
  )
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('OrderDetail', {
          _id: order?._id,
          currencySymbol: configuration.currencySymbol,
          restaurant: order?.restaurant,
          user: order?.user
        })
      }>
      <View style={styles(currentTheme).subContainer}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <View style={styles().subContainerLeft}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              medium
              bold
              style={alignment.MBxSmall}>
              {order?.restaurant.name}
            </TextDefault>

            <TextDefault
              textColor={currentTheme.fontMainColor}
              small
              bolder
              style={alignment.MBxSmall}>
              {`${order?.items.length} Items | ${
                configuration.currencySymbol
              } ${order?.orderAmount.toFixed(2)}`}
            </TextDefault>
            <TextDefault
              numberOfLines={1}
              style={{ ...alignment.MTxSmall }}
              textColor={currentTheme.fontMainColor}
              small>
              {new Date(order?.createdAt).toDateString()}
            </TextDefault>
          </View>

          <View style={styles().subContainerRight}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles(currentTheme).subContainerButton}
              onPress={() => navigation.navigate('Reorder', { order })}>
              <TextDefault
                textColor={currentTheme.buttonText}
                smaller
                bolder
                B700
                center
                uppercase>
                {' '}
                Reorder
              </TextDefault>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles(currentTheme).line} />
        <Pressable style={styles(currentTheme).subBtn}>
          <TextDefault bold textColor={currentTheme.fontMainColor}>
            {order?.orderStatus}
          </TextDefault>
        </Pressable>
      </View>
    </TouchableOpacity>
  )
}

export default InActiveOrders
