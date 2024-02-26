import React from 'react'
import { View, Modal, Pressable } from 'react-native'
import TextDefault from '../Text/TextDefault/TextDefault'
import Button from '../Button/Button'
import styles from './styles'
import { alignment } from '../../utils/alignment'

export const CancelModal = ({ theme, modalVisible, setModalVisible, cancelOrder, loading }) => {
  return (<Modal
    animationType='slide'
    visible={modalVisible}
    transparent={true}
  >
    <Pressable style={styles.container(theme)} onPress={setModalVisible}>
      <View style={styles.modalContainer(theme)}>
        <View style={{ ...alignment.MBsmall }}><TextDefault H4 bolder textColor={theme.gray900}>Cancel your order</TextDefault></View>
        <View><TextDefault H5 textColor={theme.gray500}>{"We've got your order and may find you a rider any second now. Cancel anyway"}</TextDefault></View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>

          <View style={{ ...alignment.MTlarge }}>
            <Button
              text={'Cancel Order'}
              buttonProps={{ onPress: cancelOrder, disabled: loading }}
              buttonStyles={[styles.cancelButtonContainer(theme), { backgroundColor: theme.red600 }]}
              textProps={{ textColor: theme.white }}
              textStyles={{ ...alignment.Pmedium }}/>
          </View>
          <View style={{ ...alignment.MTsmall }}>
            <Button
              text={'I will wait for my order'}
              buttonProps={{ onPress: setModalVisible }}
              buttonStyles={styles.dismissButtonContainer(theme)}
              textStyles={{ ...alignment.Pmedium }}/>
          </View>

        </View>
      </View>
    </Pressable>
  </Modal>)
}
