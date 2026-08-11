import { scale, verticalScale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: props !== null ? props?.cartContainer : '#FFF',
      borderRadius: scale(8),
      elevation: 3,
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: verticalScale(1)
      },
      shadowOpacity: 0.5,
      shadowRadius: verticalScale(1),
      //flexDirection: 'row',
      justifyContent: 'space-between',
      ...alignment.MRsmall,
      ...alignment.MLsmall,
      ...alignment.MTsmall,
      ...alignment.PTxSmall,
      ...alignment.PBxSmall,
      ...alignment.PRsmall,
      ...alignment.PLxSmall
    },
    image: {
      height: '100%',
      width: '25%',
      borderRadius: scale(10)
    },
    textContainer: {
      width: '55%',
      ...alignment.PTlarge,
      ...alignment.PBlarge,
      ...alignment.PLsmall
    },
    textContainer2: {
      width: '58%',
      paddingHorizontal: scale(10)
    },
    subContainerLeft: {
      width: '100%'
    },
    leftContainer: {
      width: '95%'
    },
    rightContainer: {
      width: '20%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    subContainerRight: {
      justifyContent: 'flex-start',
      width: '35%',
    },
    rateOrderContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      marginTop: scale(20),
      justifyContent: 'center',
      alignItems: 'flex-end'
    },
    subContainerButton: {
      backgroundColor: props !== null ? props?.newheaderColor : '#90E36D',
      ...alignment.MTxSmall,
      borderRadius: 40,
      width: '70%',
      height: verticalScale(30),
      alignItems: 'center',
      justifyContent: 'center'
    },
    subContainerReviewButton: {
      backgroundColor: props !== null ? props?.secondaryBackground : 'grey',
      ...alignment.MTxSmall,
      borderRadius: 10,
      width: scale(80),
      height: verticalScale(25),
      alignItems: 'center',
      justifyContent: 'center'
    },
    headingContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: props !== null ? props?.themeBackground : 'grey',
      alignItems: 'center',
      ...alignment.PTlarge,
      ...alignment.PBlarge,
      ...alignment.MTsmall
    },
    line: {
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: props !== null ? props?.horizontalLine : 'grey'
    },
    headingLine: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: props !== null ? props?.horizontalLine : 'grey'
    },
    subContainer: {
      flex: 1,
      backgroundColor: props !== null ? props?.cardBackground : '#F3F4F6',
      borderColor: props !== null ? props?.customBorder : '#fff',
      borderWidth:scale(1),
      borderRadius: scale(8),
      elevation: 1,
      ...alignment.MRmedium,
      ...alignment.MLmedium,
      ...alignment.MTsmall,
      ...alignment.Pmedium
    },
    restaurantImage: {
      height: 85,
      width: 85,
      borderRadius: 10,
    },
    restaurantImage1: {
      height: 85,
      width: 85,
      borderRadius: 10
    },
    orderInfo: {
      ...alignment.MBxSmall
    },
    subContainerImage: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      ...alignment.PBlarge
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.MBxSmall
    },
    descriptionEmpty: {
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.Plarge
    },
    emptyButton: {
      width: '85%',
      padding: scale(10),
      backgroundColor: props !== null ? props?.buttonBackground : 'grey',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: scale(10)
    },
    starsContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' :'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      height: scale(50)
      //backgroundColor: props !== null ? props?.gray200 : '#F3F4F6'
    },
    starsStyle: {
      borderColor: props !== null ? props?.newheaderColor : '#90E36D',
      borderWidth: 1,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    },
    orderDescriptionContainer: {
      ...alignment.MTxSmall
    }
  })

export default styles
