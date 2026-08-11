import React from 'react'
import { View, Modal, Pressable } from 'react-native'
import TextDefault from '../Text/TextDefault/TextDefault'
import Button from '../Button/Button'
import { useStyles } from './styles'
import { alignment } from '../../utils/alignment'
import { useTranslation } from 'react-i18next'

export const WhatsAppNotInstalledModal = ({
  theme,
  modalVisible,
  setModalVisible,
  handleNavigation
}) => {
  const { t } = useTranslation()
  const styles = useStyles(theme)

  return (
    <Modal animationType="slide" visible={modalVisible} transparent={true}>
      {/* <View style={styles.layout}> */}
      <Pressable style={styles.backdrop} onPress={() => setModalVisible()}>
          <View style={styles.modalContainer}>
            <View style={{ ...alignment.MBsmall }}>
              <TextDefault H4 bolder textColor={theme.gray900}>
                {t("Can't open whatsapp")}
              </TextDefault>
            </View>
            <View>
              <TextDefault H5 textColor={theme.gray500}>
                {t('WhatsApp is not installed on the device')}
              </TextDefault>
            </View>

              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ ...alignment.MTlarge }}>
              <Button
                    text={t('Install it')}
                    buttonProps={{ onPress: handleNavigation }}
                    buttonStyles={styles.navigateButtonContainer}
                    textStyles={{ ...alignment.Psmall, color: theme.newIconColor }}
                  />
                </View>
                <View style={{ ...alignment.MTsmall }}>
                  <Button
                    text={t('close')}
                    buttonProps={{ onPress: () => setModalVisible() }}
                    buttonStyles={styles.dismissButtonContainer}
                    textStyles={{ ...alignment.Psmall, color: theme.newIconColor }}
                  />
                </View>
              </View>

          </View>
      </Pressable>
      {/* </View> */}
    </Modal>
  )
}
