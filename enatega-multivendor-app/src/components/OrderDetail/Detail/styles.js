import { StyleSheet, Dimensions } from 'react-native'
import { fontStyles } from '../../../utils/fontStyles'
import { scale, verticalScale } from '../../../utils/scaling'
const { width: WIDTH } = Dimensions.get('window')
export default StyleSheet.create({
  container: theme => ({
    alignItems: 'center',
    backgroundColor: theme.themeBackground
  }),
  line: theme => ({
    height: 1,
    width: '90%',
    backgroundColor: theme.secondaryText
  }),
  chatButton: theme => ({
    paddingVertical: scale(25),
    paddingHorizontal: scale(100),
    backgroundColor: theme.black,
    borderRadius: scale(20)
  }),
  chatButtonText: theme => ({
    color: theme.white,
    fontFamily: fontStyles.MuseoSans500
  }),

  orderDetailsContainer: theme => ({
    paddingVertical: 20,
    backgroundColor: theme.themeBackground
  }),
  addressContainer: {
    width: WIDTH - 20,
    paddingLeft: scale(15)
  },
  row: {
    paddingTop: scale(25),
    flexDirection: 'row',
  },
  addressText: { width: '50%', textAlign: 'left' },
  itemsContainer: {
    width: WIDTH - 20,
    paddingHorizontal: scale(15),
    paddingVertical: scale(20),
    margin: scale(20)
  },
  line2: theme => ({
    marginVertical: scale(10),
    backgroundColor: theme.secondaryText,
    height: scale(1),
    width: '100%'
  }),
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(10)
  }
})
