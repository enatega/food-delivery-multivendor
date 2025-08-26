import { StyleSheet } from 'react-native';
import { scale } from '../../utils/scaling';
import { alignment } from '../../utils/alignment';

const styles = (props = null) =>
  StyleSheet.create({
    backdrop: {
      height: '70%'
    },
    layout: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: props !== null ? props?.cardBackground : '#FFF',
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
      paddingHorizontal: scale(20),
      paddingTop: scale(20),
      paddingBottom: scale(20),
      borderWidth: scale(1),
      borderColor: props !== null ? props?.customBorder : '#E5E7EB',
      flex: 1,
      justifyContent: 'center',
    },
    modalView: {
      width: '100%',
      backgroundColor: props !== null ? props?.cardBackground : 'white',
      paddingHorizontal: scale(20),
    },
    modalHead: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      ...alignment.PBsmall,
    },
    btn: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
      height: scale(40),
      borderRadius: 40,
      marginVertical: scale(5),
      backgroundColor: props !== null ? props?.color3 : 'transparent',
      borderWidth: 1,
    },
    btnCancel: {
      borderColor: props !== null ? props?.iconColor : '#717171'
    },
    btnDelete: {
      borderColor: props !== null ? props?.red600 : '#DC2626'
    },
    btnEdit: {
      borderColor: props !== null ? props?.linkColor : '#0EA5E9'
    }
  });

export default styles;
