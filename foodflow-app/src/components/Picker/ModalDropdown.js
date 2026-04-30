import React, { useContext } from 'react'
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'
import { Feather, Entypo } from '@expo/vector-icons'
import TextDefault from '../Text/TextDefault/TextDefault'
import { scale } from '../../utils/scaling'
import { LocationContext } from '../../context/Location'
import { useTranslation } from 'react-i18next'
import Spinner from '../Spinner/Spinner'

const ModalDropdown = ({ theme, visible, onItemPress, onClose }) => {
  const { t } = useTranslation()
  const { cities, loading, isConnected } = useContext(LocationContext)
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item(theme)}
      onPress={() => {
        onItemPress({
          name: item.name,
          latitude: item.latitude,
          longitude: item.longitude
        })
      }}>
      <TextDefault H5 bold textColor={theme.color7}>
        {item.name}
      </TextDefault>
      <Entypo name={theme.isRTL ? "chevron-left" : "chevron-right"} size={24} color={theme.newIconColor} />
    </TouchableOpacity>
  )

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      backdropOpacity={1}
      transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContainer(theme)}>
        <View style={styles.header(theme)}>
          <TextDefault textColor={theme.gray900} H3 bolder>
            {t('exploreCities')}
          </TextDefault>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x-circle" size={30} color={theme.newIconColor} />
          </TouchableOpacity>
        </View>
        {!isConnected ? (
            <View style={{paddingTop:100,paddingBottom:130,paddingLeft:50}}>
          <TextDefault textColor={theme.gray900}  >
           You're offline.Check your internet connection.
           </TextDefault>
           </View>
        ) :loading ? (
            <Spinner backColor={theme.cardBackground} spinnerColor={theme.iconColor}  />
        ):(
          <FlatList
            data={cities}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    height: '60%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  modalContainer: theme => ({
    flex: 1,
    justifyContent: 'flex-end',
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    backgroundColor: theme.cardBackground,
    borderColor: theme.customBorder,
    borderWidth: scale(1),
    marginTop: scale(-22)
  }),
  header: theme => ({
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: theme.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    marginTop: scale(20),
    marginLeft: scale(12),
    marginRight: scale(8),
    marginBottom: scale(16)
  }),
  closeButton: {
    alignSelf: 'flex-end',
    margin: scale(10)
  },
  item: theme =>({
    flexDirection: theme.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: theme.cardBackground,
    borderBottomWidth: scale(0.5),
    borderBottomColor: '#ccc'
  })
})

export default ModalDropdown
