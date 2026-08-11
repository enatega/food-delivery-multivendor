import { StyleSheet, Dimensions } from 'react-native'
import { fontStyles } from '../../../utils/fontStyles'
import { scale, verticalScale } from '../../../utils/scaling'
const { width: WIDTH } = Dimensions.get('window')
export default StyleSheet.create({
  container: theme => ({
    marginHorizontal: scale(12)
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
    flexDirection: theme?.isRTL ? 'row-reverse' : 'row'
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
  itemsContainer: {
    width: '100%'
  },
  line2: theme => ({
    marginVertical: scale(10),
    backgroundColor: theme.secondaryText,
    height: scale(1),
    width: '100%'
  }),
  itemRow: theme=>({
    flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: scale(10),
    paddingVertical: scale(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderSubtle
  }),
  itemCopy: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center'
  },
  itemPrice: {
    minWidth: scale(58),
    textAlign: 'right'
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(10)
  },
  chatIcon: theme => ({
    flex: 1,
    alignItems: theme?.isRTL ? 'flex-start' : 'flex-end',
    justifyContent: 'center',
  })
})
