import { StyleSheet, Dimensions } from 'react-native'
import { fontStyles } from '../../../utils/fontStyles'
import { scale, verticalScale } from '../../../utils/scaling'
const { width: WIDTH } = Dimensions.get('window')
export default StyleSheet.create({
  container: theme => ({
    marginHorizontal: scale(10),

  
  }),
  line: theme => ({
    height: 1,
    width: '90%',
    backgroundColor: theme.secondaryText
  }),
  chatButton: theme => ({
    paddingVertical: scale(25),
    // paddingHorizontal: scale(100),
    backgroundColor: theme.themeBackground,
    borderRadius: scale(20),
    flexDirection: 'row'
  }),

  orderDetailsContainer: theme => ({
    backgroundColor: theme.themeBackground
  }),
  addressContainer: {
    width: WIDTH - 20
  },
  row: {
    paddingTop: scale(25),
    flexDirection: 'row'
  },
  addressText: { width: '50%', textAlign: 'left' },
  itemsContainer: {
    width: WIDTH - 20,
  },
  line2: theme => ({
    marginVertical: scale(10),
    backgroundColor: theme.secondaryText,
    height: scale(1),
    width: '100%'
  }),
  itemRow: theme=>({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginVertical: scale(5),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.gray100,
    borderRadius:scale(10)
  }),
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(10)
  },
  chatIcon: theme => ({
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  })
})
