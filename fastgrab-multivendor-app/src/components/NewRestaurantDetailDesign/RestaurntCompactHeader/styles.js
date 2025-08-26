// components/SmallHeader/styles.js
import { StyleSheet, Platform, StatusBar } from 'react-native';
import { scale } from '../../../utils/scaling';

const styles = (props = null) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    backgroundColor: props?.themeBackground,
    paddingHorizontal: scale(15),
    paddingTop: Platform.OS === 'ios' ? scale(50) : StatusBar.currentHeight
  },
  iconButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: scale(10)
  },
  title: {
    fontSize: scale(16),
    textAlign: 'center'
  }
});

export default styles;