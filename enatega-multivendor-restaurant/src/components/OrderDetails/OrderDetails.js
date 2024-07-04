import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { TextDefault } from '..'
import styles from './styles'
import { colors } from '../../utilities'
import { Configuration } from '../../ui/context'
import { useTranslation } from 'react-i18next'

export default function OrderDetails({ orderData }) {
  const { orderId, user, deliveryAddress } = orderData
  const { t } = useTranslation()
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cardContainer}>
        <View style={styles.row}>
          <Text style={styles.heading}>{t('orderNo')}.</Text>
          <Text style={styles.text} selectable>
            {orderId}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.heading}>{t('email')}</Text>
          <Text style={styles.text} selectable>
            {user.email}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.heading}>{t('contact')}</Text>
          <Text style={styles.text} selectable>
            {user.phone}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.heading}>{t('address')}</Text>
          <Text style={styles.text} selectable>
            {deliveryAddress.deliveryAddress}
          </Text>
        </View>
      </View>
      <OrderItems orderData={orderData} />
    </View>
  )
}
function OrderItems({ orderData }) {
  const { t } = useTranslation()
  const {
    items,
    orderAmount,
    tipping,
    deliveryCharges,
    taxationAmount
  } = orderData
  const configuration = useContext(Configuration.Context)
  let subTotal = 0

  return (
    <View style={[styles.cardContainer, { marginTop: 30, marginBottom: 45 }]}>
      {items &&
        items.map((item, index) => {
          subTotal = subTotal + item.variation.price

        
          return (
            <View>
              <View style={styles.itemRow} key={index}>
                <TextDefault
                  H5
                  textColor={colors.fontSecondColor}
                  bold>{`${item.quantity}x ${item.title}`}</TextDefault>
                <TextDefault
                  bold>{`${configuration.currencySymbol}${item.variation.price}`}</TextDefault>
              </View>

              <View style={styles.itemColumn}>
                <TextDefault H6 textColor={colors.fontSecondColor} bold>
                  Variations
                </TextDefault>
                <View>
                  {item?.variation ? (
                    <View style={styles.itemRow}>
                      <TextDefault H6 textColor={colors.fontSecondColor}>
                        - {item?.variation.title}
                      </TextDefault>
                      <TextDefault H6>{`${configuration.currencySymbol}${
                        item?.variation.price ?? 0
                      }`}</TextDefault>
                    </View>
                  ) : (
                    <TextDefault>-</TextDefault>
                  )}
                </View>
              </View>

              <View style={{marginBottom:5}}></View>

              <View style={styles.itemColumn}>
                <TextDefault H6 textColor={colors.fontSecondColor} bold>
                  Add-ons
                </TextDefault>
                <View>
                  {item?.addons?.length > 0 ? (
                    item.addons.map((addon, index) => {
                      return (
                        <View style={styles.itemColumn}>
                          <TextDefault H7 textColor={colors.fontSecondColor}>
                            {index + 1} - {addon.title} (Options)
                          </TextDefault>
                          <View style={styles.itemColumn}>
                            {addon.options.map((option, addOnIndex) => (
                              <View style={styles.itemRow}>
                                <TextDefault
                                  key={index}
                                  textColor={colors.fontSecondColor}
                                  style={{ marginLeft: 22 }}>
                                  {index + 1}.{addOnIndex + 1} - {option.title}
                                </TextDefault>
                                <TextDefault H6>{`${
                                  configuration.currencySymbol
                                }${option.price ?? 0}`}</TextDefault>
                              </View>
                            ))}
                          </View>
                        </View>
                      )
                    })
                  ) : (
                    <TextDefault>-</TextDefault>
                  )}
                </View>
              </View>

              <View style={styles.itemRowBar}></View>
            </View>
          )
        })}
      <View style={styles.itemRow}>
        <TextDefault
          H6
          textColor={colors.fontSecondColor}
          bold
          style={styles.itemHeading}>
          {t('subT')}
        </TextDefault>
        <TextDefault bold style={styles.itemText}>
          {`${configuration.currencySymbol}${subTotal.toFixed(2)}`}
        </TextDefault>
      </View>
      <View style={styles.itemRow}>
        <TextDefault
          H6
          textColor={colors.fontSecondColor}
          bold
          style={styles.itemHeading}>
          {t('tip')}
        </TextDefault>
        <TextDefault bold style={styles.itemText}>
          {`${configuration.currencySymbol}${tipping}`}
        </TextDefault>
      </View>
      <View style={styles.itemRow}>
        <TextDefault
          H6
          textColor={colors.fontSecondColor}
          bold
          style={styles.itemHeading}>
          {t('taxCharges')}
        </TextDefault>
        <TextDefault bold style={styles.itemText}>
          {`${configuration.currencySymbol}${taxationAmount}`}
        </TextDefault>
      </View>
      <View style={styles.itemRow}>
        <TextDefault
          H6
          textColor={colors.fontSecondColor}
          bold
          style={styles.itemHeading}>
          {t('deliveryCharges')}
        </TextDefault>
        <TextDefault bold style={styles.itemText}>
          {`${configuration.currencySymbol}${deliveryCharges}`}
        </TextDefault>
      </View>

      <View style={[styles.itemRow, { marginTop: 30 }]}>
        <TextDefault
          H6
          textColor={colors.fontSecondColor}
          bold
          style={styles.itemHeading}>
          {t('total')}
        </TextDefault>
        <TextDefault bold style={styles.itemText}>
          {`${configuration.currencySymbol}${orderAmount}`}
        </TextDefault>
      </View>
    </View>
  )
}
