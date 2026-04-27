import { View, Image } from 'react-native'
import React from 'react'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'
import { useTranslation } from 'react-i18next'
import { alignment } from '../../../utils/alignment'
import { scale } from '../../../utils/scaling'
import { ChatButton } from './ChatButton'
import { ORDER_STATUS_ENUM } from '../../../utils/enums'
import { formatNumber } from '../../../utils/formatNumber'

export default function Detail({ theme, from, orderNo, deliveryAddress, items, currencySymbol, subTotal, tip, tax, deliveryCharges, total, navigation, id, rider, orderStatus }) {
  const riderPhone = rider?.phone
  const { t } = useTranslation()
 console.log(JSON.stringify(items, null, 2))
  return (
    <View style={styles.container(theme)}>
      {rider && orderStatus !== ORDER_STATUS_ENUM.DELIVERED && orderStatus !== ORDER_STATUS_ENUM.CANCELLED && <ChatButton onPress={() => navigation.navigate('ChatWithRider', { id, orderNo, total, riderPhone })} title={t('chatWithRider')} description={t('askContactlessDelivery')} theme={theme} />}
      <TextDefault textColor={theme.gray500} bolder H4 style={{ ...alignment.MBsmall }} isRTL>
        {from}
      </TextDefault>
      <View style={{ flexDirection: theme?.isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }}>
        <TextDefault textColor={theme.gray500} bolder H5 style={{ ...alignment.MBmedium }} isRTL>
          {t('yourOrder')}
        </TextDefault>
        <TextDefault textColor={theme.lightBlue} bolder H4 style={{ ...alignment.MBmedium }} isRTL>
          #{orderNo}
        </TextDefault>
      </View>

      <View style={{ flexDirection: theme?.isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', ...alignment.MBsmall, paddingRight: 10 }}>
        <TextDefault textColor={theme.gray500} bolder H5 bold isRTL>
          {t('itemsAndQuantity')} ({items.length})
        </TextDefault>
        <TextDefault textColor={theme.gray500} bolder H5 bold isRTL>
          {t('price')}
        </TextDefault>
      </View>

      <View style={styles.itemsContainer}>
        {items?.map((item) => {
          // Calculate total price including addons
          const basePrice = item.variation.price
          const addonPrice = item.addons.reduce((total, addon) => {
            return total + addon.options.reduce((addonTotal, option) => {
              return addonTotal + (option.price || 0)
            }, 0)
          }, 0)
          const totalItemPrice = basePrice + addonPrice
          
          return (
            <ItemRow 
              key={item._id} 
              theme={theme} 
              quantity={item.quantity} 
              variationTitle={item.variation.title} 
              title={`${item.title}`} 
              currency={currencySymbol} 
              price={totalItemPrice} 
              options={item.addons.map((addon) => addon.options.map(({ title }) => title))} 
              image={item?.image} 
            />
          )
        })}
      </View>
    </View>
  )
}
const ItemRow = ({ theme, quantity, title, variationTitle, options = ['raita', '7up'], price, currency, image }) => {
  const { t } = useTranslation()
  return (
    <View style={styles.itemRow(theme)}>
      <View>
        <Image
          style={{
            width: scale(48),
            height: scale(64),
            borderRadius: scale(8)
          }}
          source={image ? { uri: image } : require('../../../assets/images/food_placeholder.png')}
        ></Image>
      </View>
      <View style={{ width: '60%', justifyContent: 'center' }}>
        <TextDefault left numberOfLines={1} textColor={theme.gray900} H5 bolder style={{ ...alignment.MBxSmall }} isRTL>
          {title}
        </TextDefault>
        <TextDefault left numberOfLines={1} textColor={theme.gray900} style={{ ...alignment.MBxSmall }} isRTL>
          {`(${variationTitle})`}
        </TextDefault>

        {options.length > 0 && (
          <TextDefault bold textColor={theme.gray600} left style={{ ...alignment.MBxSmall }} isRTL>
            {options.join(',')}
          </TextDefault>
        )}

        <TextDefault Regular left bolder textColor={theme.gray900} isRTL>
          x{quantity}
        </TextDefault>
      </View>
      <TextDefault style={{ width: '20%', textAlign: 'right', paddingRight: 10 }} bolder textColor={theme.gray900} H5 isRTL>
        {currency}
        {formatNumber(price)}
      </TextDefault>
    </View>
  )
}
