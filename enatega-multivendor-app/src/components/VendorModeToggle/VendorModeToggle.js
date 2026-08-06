import React from 'react'
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { Feather } from '@expo/vector-icons'

import { useAppMode } from '../../mode/AppModeContext'
import { APP_MODES } from '../../mode/constants'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { scale } from '../../utils/scaling'

const VendorModeToggle = ({ hasActiveOrder = false, hasCartItems = false }) => {
  const { i18n, t } = useTranslation()
  const themeContext = React.useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const {
    mode,
    isModeSwitchBlocked,
    isSwitchingMode,
    singleVendorAvailable,
    switchMode
  } = useAppMode()
  const labels = {
    [APP_MODES.MULTI]: t('multiVendor', { defaultValue: 'Multi Vendor' }),
    [APP_MODES.SINGLE]: t('singleVendor', { defaultValue: 'Single Vendor' })
  }
  const icons = {
    [APP_MODES.MULTI]: 'grid',
    [APP_MODES.SINGLE]: 'shopping-bag'
  }

  const requestSwitch = nextMode => {
    if (nextMode === mode || isSwitchingMode) return
    if (isModeSwitchBlocked) {
      Alert.alert(
        'Please wait',
        'You cannot switch services while a payment or order request is in progress.'
      )
      return
    }

    const performSwitch = () => {
      switchMode(nextMode).catch(() => {})
    }

    if (hasActiveOrder || hasCartItems) {
      Alert.alert(
        'Switch delivery mode?',
        'Your cart and active orders will remain on the current service. Switch back to continue tracking or checkout.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Switch', onPress: performSwitch }
        ]
      )
      return
    }

    performSwitch()
  }

  return (
    <View style={styles(currentTheme).container} accessibilityRole='radiogroup'>
      {Object.values(APP_MODES)
        .filter(itemMode =>
          itemMode !== APP_MODES.SINGLE || singleVendorAvailable
        )
        .map(itemMode => {
          const selected = itemMode === mode
          return (
            <TouchableOpacity
              accessibilityRole='radio'
              accessibilityState={{ checked: selected, disabled: isSwitchingMode || isModeSwitchBlocked }}
              activeOpacity={0.72}
              disabled={isSwitchingMode || isModeSwitchBlocked}
              key={itemMode}
              onPress={() => requestSwitch(itemMode)}
              style={[
                styles(currentTheme).button,
                itemMode === APP_MODES.MULTI && singleVendorAvailable && styles(currentTheme).segmentDivider,
                selected && styles(currentTheme).selectedButton
              ]}
            >
              <Feather
                name={icons[itemMode]}
                size={scale(15)}
                color={selected ? currentTheme.primaryBlue : currentTheme.colorTextMuted}
                style={styles(currentTheme).buttonIcon}
              />
              <Text style={[styles(currentTheme).label, selected && styles(currentTheme).selectedLabel]}>
                {labels[itemMode]}
              </Text>
            </TouchableOpacity>
          )
        })}
      {isSwitchingMode
        ? (
          <View style={styles(currentTheme).loader}>
            <ActivityIndicator color={currentTheme.primaryBlue} size='small' />
          </View>
          )
        : null}
    </View>
  )
}

const styles = (currentTheme) => StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: currentTheme.themeBackground,
    flexDirection: 'row',
    minHeight: scale(48)
  },
  button: {
    flex: 1,
    alignSelf: 'stretch',
    borderBottomColor: 'transparent',
    borderBottomWidth: scale(2),
    paddingHorizontal: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  segmentDivider: {
    borderRightColor: currentTheme.newBorderColor2 || currentTheme.colorBorder,
    borderRightWidth: StyleSheet.hairlineWidth
  },
  selectedButton: {
    backgroundColor: `${currentTheme.primaryBlue}12`,
    borderBottomColor: currentTheme.primaryBlue
  },
  label: {
    color: currentTheme.colorTextMuted,
    fontSize: scale(13),
    fontWeight: '600'
  },
  selectedLabel: {
    color: currentTheme.primaryBlue
  },
  buttonIcon: { marginRight: scale(7) },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${currentTheme.themeBackground || '#FFFFFF'}CC`
  }
})

export default VendorModeToggle
