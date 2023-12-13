import { View } from 'react-native'
import React from 'react'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'
import Button from '../../Button/Button'
import {useTranslation} from 'react-i18next'

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

  const {t} = useTranslation()
  return (
    <View style={styles.container(theme)}>
      {rider && (
        <>
          <View
            style={{
              paddingVertical: 47
            }}>
            <Button
              buttonProps={{
                onPress: () => navigation.navigate('ChatWithRider', { id })
              }}
              buttonStyles={styles.chatButton(theme)}
              textStyles={styles.chatButtonText(theme)}
              text={t('chatWithRider')}
            />
          </View>
          <View style={styles.line(theme)}></View>
        </>
      )}
      <View style={styles.orderDetailsContainer}>
        <TextDefault textColor={theme.main} bold H3>
          {t('orderDetail')}
        </TextDefault>
      </View>

      <View style={styles.addressContainer}>
        <View style={styles.row}>
          <TextDefault
            left
            textColor={theme.secondaryText}
            bold
            style={styles.addressText}>
            {t('OrderFrom')}
          </TextDefault>
          <TextDefault left bolder style={styles.addressText}>
            {from}
          </TextDefault>
        </View>
        <View style={styles.row}>
          <TextDefault
            left
            textColor={theme.secondaryText}
            bold
            style={styles.addressText}>
            {t('OrderNo')}
          </TextDefault>
          <TextDefault left bolder style={styles.addressText}>
            {' '}
            {orderNo}
          </TextDefault>
        </View>
        <View style={styles.row}>
          <TextDefault
            left
            textColor={theme.secondaryText}
            bold
            style={styles.addressText}>
            {t('deliveryAddress')}
            {':'}
          </TextDefault>
          <TextDefault left bolder style={styles.addressText} numberOfLines={4}>
            {deliveryAddress}
          </TextDefault>
        </View>
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
          />
        ))}
        <View>
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
        </View>
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
  currency
}) => {
  return (
    <View>
      <View style={styles.itemRow}>
        <TextDefault left style={{ width: '10%' }} bolder>
          {quantity}x
        </TextDefault>
        <View style={{ width: '60%' }}>
          <TextDefault
            left
            textCoonumberOfLines={4}
            textColor={theme.secondaryText}>
            {title}
          </TextDefault>
          {options.map((option, index) => (
            <TextDefault
              small
              textColor={theme.secondaryText}
              left
              key={title + option + index}>
              +{option}
            </TextDefault>
          ))}
        </View>
        <TextDefault
          right
          style={{ width: '20%' }}
          textColor={theme.secondaryText}
          H5>
          {currency} {price}
        </TextDefault>
      </View>
      <View style={styles.line2(theme)}></View>
    </View>
  )
}

const PriceRow = ({ theme, title, currency, price }) => {
  return (
    <View style={styles.priceRow}>
      <TextDefault H5 textColor={theme.secondaryText}>
        {title}
      </TextDefault>
      <TextDefault H5 textColor={theme.secondaryText}>
        {currency} {price}
      </TextDefault>
    </View>
  )
}
