import { View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'
import Button from '../../Button/Button'
import { useTranslation } from 'react-i18next'
import { alignment } from '../../../utils/alignment'
import { scale } from '../../../utils/scaling'

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
  rider
}) {
  const { t } = useTranslation()
  return (
    <View style={styles.container(theme)}>
      {rider && (
        <TouchableOpacity onPress={() => navigation.navigate('ChatWithRider', { id })} style={styles.chatButton(theme)}>

          <View style={{ width: '20%' }}>
            <TextDefault
            >icon
            </TextDefault>
          </View>
          <View style={{ width: '60%' }}>
            <TextDefault
            >{t('chatWithRider')}
            </TextDefault>
            <TextDefault
            >Ask for contactless delivery
            </TextDefault>
          </View>
          <View style={{ width: '20%' }}>
            <TextDefault
            >chat
            </TextDefault>
          </View>

        </TouchableOpacity>
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
        {/* <View>
          <PriceRow
            theme={theme}
            title={t('subTotal')}
            currency={currencySymbol}
            price={subTotal.toFixed(2)}
          />
          <PriceRow
            theme={theme}
            title={t('tip')}
            currency={currencySymbol}
            price={tip.toFixed(2)}
          />
          <PriceRow
            theme={theme}
            title={t('taxFee')}
            currency={currencySymbol}
            price={tax.toFixed(2)}
          />
          <PriceRow
            theme={theme}
            title={t('delvieryCharges')}
            currency={currencySymbol}
            price={deliveryCharges.toFixed(2)}
          />
          <View style={{ marginVertical: 20 }} />
          <PriceRow
            theme={theme}
            title={t('total')}
            currency={currencySymbol}
            price={total.toFixed(2)}
          />
        </View> */}
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
