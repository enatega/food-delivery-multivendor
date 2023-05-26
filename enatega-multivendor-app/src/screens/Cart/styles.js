import { StyleSheet, Dimensions } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'
const { height, width } = Dimensions.get('window')
const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 75 },
  map: {
    width: width,
    height: height * 0.4
  },
  cartDetails: {
    flex: 1,
    borderRadius: scale(10),
    backgroundColor: '#F3F4F8',
    marginTop: scale(-60)
  },
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: scale(20)
  },
  lgDeliveryCard: {
    marginTop: scale(-50),
    marginHorizontal: '2%',
    borderRadius: scale(10),
    padding: scale(10),
    alignItems: 'center'
  },
  trashContainer: {
    ...alignment.PLmedium,
    ...alignment.MBxSmall,
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%'
  },
  trashIcon: {
    backgroundColor: 'red',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cartItemsContainer: {
    borderRadius: scale(20),
    paddingTop: scale(10),
    backgroundColor: 'white',
    ...alignment.PLsmall,
    ...alignment.PRsmall,
    paddingBottom: scale(20)
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2
  },
  priceContainer: {
    marginHorizontal: '2%',
    marginBottom: '2%',
    marginTop: scale(-50),
    paddingTop: scale(80),
    borderRadius: scale(20),
    zIndex: -1
  },
  priceRow: {
    marginHorizontal: scale(13),
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: scale(5),
    paddingBottom: scale(10),
    borderBottomWidth: 0.5,
    borderColor: '#484747'
  },
  voucherContainer: {
    margin: '4%',
    paddingBottom: scale(45),
    borderBottomWidth: 0.5,
    borderColor: '#484747'
  },
  totalRow: {
    marginHorizontal: scale(13),
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: scale(5),
    borderColor: '#484747'
  },
  roundContainer: {
    margin: '2%',
    paddingBottom: scale(20),
    backgroundColor: 'white',
    borderRadius: scale(20)
  },
  button: {
    borderRadius: scale(10),
    paddingHorizontal: scale(24),
    paddingVertical: scale(9),
    justifyContent: 'center',
    alignItems: 'center'
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    margin: '4%'
  },
  modal: {
    borderTopEndRadius: scale(20),
    borderTopStartRadius: scale(20),
    shadowOpacity: 0,
    marginBottom: scale(65)
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  handle: {
    width: scale(150),
    backgroundColor: '#b0afbc'
  },
  roundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 13,
    paddingLeft: 10,
    marginBottom: 7
  },
  shippingContainer: {
    padding: 40,
    paddingTop: 35,
    flex: 1
  },
  voucherEnabledContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '4%',
    padding: 10,
    borderWidth: 0.5,
    borderStyle: 'dashed',
    borderRadius: 10,
    alignItems: 'center'
  },
  removeVoucherButton: {
    padding: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: '2%'
  }
})
export default styles
