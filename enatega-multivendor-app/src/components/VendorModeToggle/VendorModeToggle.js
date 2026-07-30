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

import { useAppMode } from '../../mode/AppModeContext'
import { APP_MODES } from '../../mode/constants'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'

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
              disabled={isSwitchingMode || isModeSwitchBlocked}
              key={itemMode}
              onPress={() => requestSwitch(itemMode)}
              style={[styles(currentTheme).button, selected && styles(currentTheme).selectedButton]}
            >
              <Text style={[styles(currentTheme).label, selected && styles(currentTheme).selectedLabel]}>
                {labels[itemMode]}
              </Text>
            </TouchableOpacity>
          )
        })}
      {isSwitchingMode ? <ActivityIndicator color={currentTheme.primaryBlue} size='small' style={styles(currentTheme).loader} /> : null}
    </View>
  )
}

const styles = (currentTheme) => StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: currentTheme.colorBgTertiary,
    borderColor: currentTheme.colorBorder,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 4
  },
  button: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  selectedButton: {
    backgroundColor: currentTheme.primaryBlue
  },
  label: {
    color: currentTheme.colorTextMuted,
    fontSize: 13,
    fontWeight: '600'
  },
  selectedLabel: {
    color: '#FFFFFF'
  },
  loader: {
    marginLeft: 6
  }
})

export default VendorModeToggle
