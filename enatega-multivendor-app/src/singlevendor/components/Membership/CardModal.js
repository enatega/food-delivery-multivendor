import { Modal, View, Text, Pressable, StyleSheet, Keyboard } from 'react-native'
import { CardField } from '@stripe/stripe-react-native'
import { scale } from '../../../utils/scaling'

function CardModal({ visible, setVisible, onClose, onPay, currentTheme }) {
  return (
    <Modal visible={visible} animationType='slide' transparent={true}>
      <Pressable onPress={onClose} style={styles(currentTheme).modalOverlay}>
        <View style={styles().modalContent}>
          <Text style={styles().modalTitle}>Enter Card Details</Text>

          <CardField
            postalCodeEnabled={false}
            autofocus={true}
            placeholders={{
              number: '4242 4242 4242 4242'
            }}
            style={{ height: 50 }}
            cardStyle={{
              borderRadius: 8,
              borderWidth: 1,
              borderColor: currentTheme?.borderColor ?? '#efefef'
            }}
          />
          <View style={{ display: 'flex', flexDirection: 'row-reverse', width: '100%', justifyContent: 'space-between' }}>
            <Pressable style={styles(currentTheme).payBtn} onPress={() => onPay()}>
              <Text style={styles().payText}>Pay</Text>
            </Pressable>

            <Pressable style={styles(currentTheme).closeBtn} onPress={onClose}>
              <Text style={styles().cancel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  )
}

export default CardModal

const styles = (currentTheme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: 'white',
      borderTopStartRadius: scale(16),
      borderTopEndRadius: scale(16),
      padding: 24,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      gap: 20
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
      marginBottom: 10
    },
    payBtn: {
      backgroundColor: currentTheme?.primaryBlue ?? '#0EA5E9',
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 20,
      alignItems: 'center',
      width: '48%'
    },
    closeBtn: {
      backgroundColor: currentTheme?.colorBgTertiary ?? '#F4F4F5',
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 20,
      alignItems: 'center',
      width: '48%'
    },
    payText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600'
    },
    cancel: {
      color: '#666',
      fontSize: 16,
      fontWeight: '600'
    }
  })
