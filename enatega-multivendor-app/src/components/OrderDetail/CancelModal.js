import React from 'react'
import { View, Modal, Pressable } from 'react-native'
import TextDefault from '../Text/TextDefault/TextDefault'
import Button from '../Button/Button'
import styles from './styles'
import { alignment } from '../../utils/alignment'
import { ORDER_STATUS_ENUM } from '../../utils/enums'
import { useTranslation } from 'react-i18next'

export const CancelModal = ({
  theme,
  modalVisible,
  setModalVisible,
  cancelOrder,
  loading,
  orderStatus
}) => {
  const { t } = useTranslation()

  return (
    <Modal animationType="slide" visible={modalVisible} transparent={true}>
      <Pressable style={styles.container(theme)} onPress={setModalVisible}>
        {orderStatus === ORDER_STATUS_ENUM.CANCELLED && (
          <View style={styles.modalContainer(theme)}>
            <View style={{ ...alignment.MBsmall }}>
              <TextDefault H4 bolder textColor={theme.gray900}>
                {t('yourOrderCancelled')}
              </TextDefault>
            </View>
            <View>
              <TextDefault H5 textColor={theme.gray500}>
                {t('anyQuestions')}
              </TextDefault>
            </View>
          </View>
        )}
        {orderStatus !== ORDER_STATUS_ENUM.CANCELLED && (
          <View style={styles.modalContainer(theme)}>
            <View style={{ ...alignment.MBsmall }}>
              <TextDefault H4 bolder textColor={theme.gray900}>
                {t('cancelOrder')}
              </TextDefault>
            </View>
            <View>
              <TextDefault H5 textColor={theme.gray500}>
                {t('cancelAnyway')}
              </TextDefault>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ ...alignment.MTlarge }}>
                <Button
                  text={t('cancelOrder')}
                  buttonProps={{ onPress: cancelOrder, disabled: loading }}
                  buttonStyles={[
                    styles.cancelButtonContainer(theme),
                    { backgroundColor: theme.red600 }
                  ]}
                  textProps={{ textColor: theme.white }}
                  textStyles={{ ...alignment.Pmedium }}
                />
              </View>
              <View style={{ ...alignment.MTsmall }}>
                <Button
                  text={t('waitForOrder')}
                  buttonProps={{ onPress: setModalVisible }}
                  buttonStyles={styles.dismissButtonContainer(theme)}
                  textStyles={{ ...alignment.Pmedium, color: theme.newIconColor }}
                />
              </View>
            </View>
          </View>
        )}
      </Pressable>
    </Modal>
  )
}
