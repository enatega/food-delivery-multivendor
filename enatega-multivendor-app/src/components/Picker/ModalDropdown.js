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

const ModalDropdown = ({ theme, visible, onItemPress, onClose }) => {
  const { cities } = useContext(LocationContext)
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        onItemPress(item)
      }}>
      <TextDefault H5 bold textColor={theme.gray700}>{item.name}</TextDefault>
      <Entypo name="chevron-right" size={24} color="black" />
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
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TextDefault textColor={theme.gray900} H3 bolder>
            Explore Cities
          </TextDefault>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x-circle" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={cities}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    height: '20%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: scale(1),
    marginTop: scale(-20)
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(20),
    marginLeft: scale(12),
    marginRight: scale(8),
    marginBottom: scale(16)
  },
  closeButton: {
    alignSelf: 'flex-end',
    margin: scale(10)
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: scale(1),
    borderBottomColor: '#ccc'
  }
})

export default ModalDropdown
