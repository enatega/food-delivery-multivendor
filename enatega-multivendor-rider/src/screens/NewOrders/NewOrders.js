import { View, FlatList, Dimensions } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import ScreenBackground from '../../components/ScreenBackground/ScreenBackground'
import styles from './style'
import Tabs from '../../components/Tabs/Tabs'
import Order from '../../components/Order/Order'
import { TabsContext } from '../../context/tabs'
import { useFocusEffect } from '@react-navigation/native'
import ConfigurationContext from '../../context/configuration'
import UserContext from '../../context/user'
import Spinner from '../../components/Spinner/Spinner'
import TextError from '../../components/Text/TextError/TextError'
import LottieView from 'lottie-react-native'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import colors from '../../utilities/colors'
import { NetworkStatus } from '@apollo/client'
import i18next from '../../../i18next'
import {useTranslation} from 'react-i18next'


const { height, width } = Dimensions.get('window')
const NewOrders = ({ navigation }) => {
  const {t} = useTranslation()
  const { setActive } = useContext(TabsContext)
  const configuration = useContext(ConfigurationContext)
  const {
    loadingAssigned,
    errorAssigned,
    assignedOrders,
    refetchAssigned,
    networkStatusAssigned
  } = useContext(UserContext)
  const [orders, setOrders] = useState([])

  useFocusEffect(() => {
    setActive('NewOrders')
  })

  useEffect(() => {
    if (assignedOrders) {
      setOrders(
        assignedOrders.filter(
          o => o.orderStatus === 'ACCEPTED' && !o.rider && !o.isPickedUp
        )
      )
    }
  }, [assignedOrders])

  const noNewOrders = orders.length === 0
  useEffect(() => {
    // Trigger refetch when orders length changes
    if (noNewOrders) {
      refetchAssigned()
    }
  }, [noNewOrders])

  return (
    <ScreenBackground>
      <View style={styles.innerContainer}>
        <View>
          <Tabs navigation={navigation} />
        </View>
        {loadingAssigned && (
          <View style={styles.margin500}>
            <Spinner />
          </View>
        )}
        {errorAssigned && (
          <View style={styles.margin500}>
            <TextError text={t('errorText')} />
          </View>
        )}
        <FlatList
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  minHeight:
                    height > 670
                      ? height - height * 0.5
                      : height - height * 0.6,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                <LottieView
                  style={{
                    width: width-100,
                    height: 250
                  }}
                  source={require('../../assets/loader.json')}
                  autoPlay
                  loop
                />

                {noNewOrders ? (
                  <TextDefault
                    bold
                    center
                    H3
                    textColor={colors.fontSecondColor}>
                    {t('noNewOrders')}
                  </TextDefault>
                ) : (
                  <TextDefault
                    bold
                    center
                    H3
                    textColor={colors.fontSecondColor}>
                    {t('pullToRefresh')}
                  </TextDefault>
                )}
              </View>
            )
          }}
          style={styles.ordersContainer}
          keyExtractor={item => item._id}
          data={orders}
          showsVerticalScrollIndicator={false}
          refreshing={networkStatusAssigned === NetworkStatus.loading}
          onRefresh={refetchAssigned}
          renderItem={({ item }) => (
            <Order
              order={item}
              key={item._id}
              id={item._id}
              orderAmount={`${configuration.currencySymbol}${item.orderAmount}`}
            />
          )}
        />
      </View>
    </ScreenBackground>
  )
}

export default NewOrders
