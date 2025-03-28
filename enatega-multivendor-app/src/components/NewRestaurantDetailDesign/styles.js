import { StyleSheet, Platform, StatusBar } from 'react-native';
import { scale } from '../../utils/scaling';
import { verticalScale } from '../../utils/scaling';
import { alignment } from '../../utils/alignment';
import { textStyles } from '../../utils/textStyles';

const styles = (props = null) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: props?.themeBackground
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: props?.cardBackground
  },
  iconButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: props?.gray100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchBarContainer: {
    flex: 1,
    height: scale(45),
    marginHorizontal: scale(10),
    backgroundColor: props?.searchBarColor,
    borderRadius: scale(25),
    display:'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    borderWidth: 1,
    borderColor: props?.borderColor
  },
  searchIcon: {
    marginRight: scale(10),
    opacity: 0.5,
    color: props?.searchBarText
  },
  searchText: {
    fontSize: scale(16),
    color: props?.searchBarText,
    flex: 1
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: scale(20)
  },
  buttonContainer: {
    width: '100%',
    height: '10%',
    backgroundColor: props !== null ? props.themeBackground : 'black',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: props !== null ? props.shadowColor : 'black',
    shadowOffset: {
      width: 0,
      height: -verticalScale(3)
    },
    shadowOpacity: 0.5,
    shadowRadius: verticalScale(2)
  },
  button: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scale(40),
    backgroundColor: props !== null ? props.main : 'black',
    height: '75%',
    width: '95%',
    ...alignment.PLsmall,
    ...alignment.PRsmall
  },
  buttonText: {
    width: '30%',
    color: 'black'
  },
  buttonTextRight: {
    width: '35%'
  },
  buttontLeft: {
    width: '35%',
    height: '50%',
    justifyContent: 'center'
  },
  buttonLeftCircle: {
    backgroundColor: props != null ? props.black : 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonTextLeft: {
    ...textStyles.Bolder,
    ...textStyles.Center,
    ...textStyles.Smaller,
    backgroundColor: 'transparent',
    color: props != null ? props.white : 'white'
  }
});

export default styles;