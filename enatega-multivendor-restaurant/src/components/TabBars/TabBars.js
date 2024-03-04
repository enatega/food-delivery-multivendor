import React from 'react'
import { View, Pressable } from 'react-native'
import { TextDefault } from '..'
import styles from './styles'
import { colors } from '../../utilities'
import { Badge } from 'react-native-elements'
import { useTranslation } from 'react-i18next'

export default function TabBars(props) {
  const { setActiveBar, newAmount, processingAmount } = props
  const handleProcess = async () => {
    setActiveBar(1)
  }
  const handleDelivered = async () => {
    setActiveBar(2)
  }
  const { t } = useTranslation()
  return (
    <View style={styles.barContainer}>
      <Pressable
        onPress={() => setActiveBar(0)}
        style={[
          styles.barContent,
          {
            backgroundColor: props.activeBar === 0 ? 'black' : colors.white,
            zIndex: props.activeBar === 0 ? 1 : -1
          }
        ]}>
        {props.activeBar !== 0 ? (
          <Badge
            status="primary"
            value={newAmount}
            containerStyle={{ position: 'absolute', top: 0, left: 0 }}
            badgeStyle={{ backgroundColor: 'black' }}
            textStyle={{ color: colors.white }}
          />
        ) : null}

        <TextDefault
          style={{ color: props.activeBar === 0 ? colors.green : 'black' }}>
          {t('newOrders')}
        </TextDefault>
      </Pressable>

      <Pressable
        onPress={handleProcess}
        style={[
          styles.barContent,
          {
            backgroundColor: props.activeBar === 1 ? 'black' : colors.white,
            zIndex: props.activeBar === 1 ? 1 : -1
          }
        ]}>
        {props.activeBar !== 1 ? (
          <Badge
            status="primary"
            value={processingAmount}
            containerStyle={{ position: 'absolute', top: 0, left: 2 }}
            badgeStyle={{ backgroundColor: colors.darkgreen }}
            textStyle={{ color: colors.white }}
          />
        ) : null}
        <TextDefault
          style={{ color: props.activeBar === 1 ? colors.green : 'black' }}>
          {t('processing')}
        </TextDefault>
      </Pressable>
      <Pressable
        onPress={handleDelivered}
        style={[
          styles.barContent,
          {
            backgroundColor: props.activeBar === 2 ? 'black' : colors.white
          }
        ]}>
        <TextDefault
          style={{ color: props.activeBar === 2 ? colors.green : 'black' }}>
          {t('deliveredOrders')}
        </TextDefault>
      </Pressable>
    </View>
  )
}
