// import React, { useContext } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import { useTranslation } from 'react-i18next';
// import ThemeContext from '../../../../ui/ThemeContext/ThemeContext';
// import { theme } from '../../../../utils/themeColors';
// import { scale } from '../../../../utils/scaling';
// import TextDefault from '../../../../components/Text/TextDefault/TextDefault';

// const DeliveredStatus = ({ appName = 'FAST' }) => {
//   const { t, i18n } = useTranslation();
//   const themeContext = useContext(ThemeContext);
//   const currentTheme = {
//     isRTL: i18n.dir() === 'rtl',
//     ...theme[themeContext.ThemeValue]
//   };

//   return (
//     <View style={styles(currentTheme).container}>
//       <View style={styles(currentTheme).iconWrapper}>
//         <View style={styles(currentTheme).blurCircle} />
//         <View style={styles(currentTheme).iconContainer}>
//           <Feather name="check" size={48} color="#fff" />
//         </View>
//       </View>
//       <TextDefault
//         textColor={currentTheme.fontMainColor}
//         H3
//         bolder
//         isRTL
//         style={styles().title}
//       >
//         {t('Delivered') || 'Delivered'}
//       </TextDefault>
//       <TextDefault
//         textColor={currentTheme.colorTextMuted}
//         isRTL
//         center
//         bolder
//         style={styles().subtitle}
//       >
//         {t('Your grocery has been delivered.') || 'Your grocery has been delivered.'}
//       </TextDefault>
//       <TextDefault
//         textColor={currentTheme.colorTextMuted}
//         isRTL
//         center
//         bolder
//       >
//         {t('Thanks for using') || 'Thanks for using'} {appName}.
//       </TextDefault>
//     </View>
//   );
// };

// const styles = (props = null) =>
//   StyleSheet.create({
//     container: {
//       alignItems: 'center',
//       paddingVertical: scale(32),
//       paddingHorizontal: scale(16)
//     },
//     iconWrapper: {
//       alignItems: 'center',
//       justifyContent: 'center',
//       marginBottom: scale(16)
//     },
//     blurCircle: {
//       position: 'absolute',
//       width: scale(85),
//       height: scale(85),
//       borderRadius: scale(50),
//       backgroundColor: props?.headerMainFontColor || '#006189',
//       opacity: 0.2
//     },
//     iconContainer: {
//       width: scale(70),
//       height: scale(70),
//       borderRadius: scale(48),
//       backgroundColor: props?.headerMainFontColor || '#006189',
//       alignItems: 'center',
//       justifyContent: 'center'
//     },
//     title: {
//       marginBottom: scale(8)
//     },
//     subtitle: {
//       marginBottom: scale(4)
//     }
//   });

// export default DeliveredStatus;


import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

import ThemeContext from '../../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../../utils/themeColors'
import { scale } from '../../../../utils/scaling'
import TextDefault from '../../../../components/Text/TextDefault/TextDefault'

const DeliveredStatus = ({
  appName = 'FAST',
  title,
  subtitle,
  error = false,
  isPickUpOrder = false
}) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const iconName = error ? 'x' : 'check'
  const mainColor = error
    ? currentTheme.red || '#E53935'
    : currentTheme.headerMainFontColor || '#006189'

  const resolvedTitle =
    title || (error ? t('Order cancelled') : isPickUpOrder ? t('Collected') : t('Delivered'))

  const resolvedSubtitle =
    subtitle ||
    (error
      ? t('Your order has been cancelled')
      : isPickUpOrder ? t('Your grocery has been collected.') : t('Your grocery has been delivered.'))

  return (
    <View style={styles(currentTheme).container}>
      <View style={styles(currentTheme).iconWrapper}>
        <View
          style={[
            styles(currentTheme).blurCircle,
            { backgroundColor: mainColor }
          ]}
        />
        <View
          style={[
            styles(currentTheme).iconContainer,
            { backgroundColor: mainColor }
          ]}
        >
          <Feather name={iconName} size={48} color="#fff" />
        </View>
      </View>

      <TextDefault
        textColor={currentTheme.fontMainColor}
        H3
        bolder
        isRTL
        style={styles().title}
      >
        {resolvedTitle}
      </TextDefault>

      <TextDefault
        textColor={currentTheme.colorTextMuted}
        isRTL
        center
        bolder
        style={styles().subtitle}
      >
        {resolvedSubtitle}
      </TextDefault>

      {!error && (
        <TextDefault
          textColor={currentTheme.colorTextMuted}
          isRTL
          center
          bolder
        >
          {t('Thanks for using')} {appName}.
        </TextDefault>
      )}
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: scale(32),
      paddingHorizontal: scale(16)
    },
    iconWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: scale(16)
    },
    blurCircle: {
      position: 'absolute',
      width: scale(85),
      height: scale(85),
      borderRadius: scale(50),
      opacity: 0.2
    },
    iconContainer: {
      width: scale(70),
      height: scale(70),
      borderRadius: scale(48),
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      marginBottom: scale(8)
    },
    subtitle: {
      marginBottom: scale(4)
    }
  })

export default DeliveredStatus
