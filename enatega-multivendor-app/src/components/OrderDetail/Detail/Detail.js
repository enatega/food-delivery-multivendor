import { View, Image } from 'react-native'
import React from 'react'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'
import { useTranslation } from 'react-i18next'
import { alignment } from '../../../utils/alignment'
import { scale } from '../../../utils/scaling'
import { ChatButton } from './ChatButton'
import { ORDER_STATUS_ENUM } from '../../../utils/enums'

export default function Detail({
  theme,
  from,
  orderNo,
  deliveryAddress,
  items,
  currencySymbol,
  subTotal,
  tip,
  tax,
  deliveryCharges,
  total,
  navigation,
  id,
  rider,
  orderStatus
}) {
  const { t } = useTranslation()
  return (
    <View style={styles.container(theme)}>
      {(rider && orderStatus !== ORDER_STATUS_ENUM.DELIVERED) && (
        <ChatButton
          onPress={() => navigation.navigate('ChatWithRider', { id })}
          title={t('chatWithRider')}
          description={'Ask for contactless delivery'}
          theme={theme}
        />
      )}
      <TextDefault textColor={theme.gray500} bolder H5 style={{ ...alignment.MBsmall }}>
        {t('yourOrder')} ({items.length})
      </TextDefault>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextDefault textColor={theme.gray500} bolder Normal style={{ ...alignment.MBsmall }}>
          {t('itemsAndQuantity')}
        </TextDefault>
        <TextDefault textColor={theme.gray500} bolder Normal style={{ ...alignment.MBsmall }}>
          {t('price')}
        </TextDefault>
      </View>
      <View style={styles.itemsContainer}>
        {items.map(item => (
          <ItemRow
            key={item._id}
            theme={theme}
            quantity={item.quantity}
            title={`${item.title} ${item.variation.title}`}
            currency={currencySymbol}
            price={item.variation.price}
            options={item.addons.map(addon =>
              addon.options.map(({ title }) => title)
            )}
            image={item.image}
          />
        ))}
      </View>
    </View>
  )
}
const ItemRow = ({
  theme,
  quantity,
  title,
  options = ['raita', '7up'],
  price,
  currency,
  image
}) => {
  return (
    <View style={styles.itemRow}>
      <View >
        <Image style={{ width: scale(48), height: scale(64), borderRadius: scale(8) }} source={image ? { uri: image } : require('../../../assets/images/food_placeholder.png')}></Image>
      </View>
      <View style={{ width: '60%', justifyContent: 'space-between' }}>
        <TextDefault
          left
          numberOfLines={1}
          textColor={theme.gray900}
          H5
          bolder
          style={{ ...alignment.MBxSmall }}>
          {title}
        </TextDefault>

        <TextDefault
          bold
          textColor={theme.gray600}
          left
          style={{ ...alignment.MBxSmall }}>
          {options.join(',')}
        </TextDefault>

        <TextDefault Regular left bolder textColor={theme.gray900}>
            x{quantity}
        </TextDefault>

      </View>
      <TextDefault
        right
        style={{ width: '20%' }}
        bolder
        textColor={theme.gray900}
        H5>
        {currency}{price}
      </TextDefault>
    </View>
  )
}