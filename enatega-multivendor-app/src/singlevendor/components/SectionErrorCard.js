import React, { useContext, useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

import TextDefault from '../../components/Text/TextDefault/TextDefault'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { scale } from '../../utils/scaling'

const SectionErrorCard = ({ title, message, onRetry, compact = false, style }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const [retrying, setRetrying] = useState(false)
  const currentTheme = useMemo(
    () => ({ isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }),
    [i18n, themeContext.ThemeValue]
  )
  const themedStyles = styles(currentTheme, compact)

  const handleRetry = async() => {
    if (!onRetry || retrying) return
    setRetrying(true)
    try {
      await onRetry()
    } catch (_) {
      // Apollo exposes the latest error to the section; keep this card visible.
    } finally {
      setRetrying(false)
    }
  }

  return (
    <View accessibilityRole='alert' style={[themedStyles.card, style]}>
      <View style={themedStyles.iconWrap}>
        <Feather name='wifi-off' size={scale(compact ? 17 : 20)} color={currentTheme.primaryBlue} />
      </View>
      <View style={themedStyles.copy}>
        {!!title && (
          <TextDefault bold style={themedStyles.title} numberOfLines={1}>
            {title}
          </TextDefault>
        )}
        <TextDefault style={themedStyles.message} numberOfLines={compact ? 2 : 3}>
          {message || t('sectionLoadFailed', { defaultValue: 'This section could not be loaded.' })}
        </TextDefault>
      </View>
      {!!onRetry && (
        <Pressable
          accessibilityRole='button'
          accessibilityLabel={t('retry', { defaultValue: 'Retry' })}
          disabled={retrying}
          hitSlop={8}
          onPress={handleRetry}
          style={({ pressed }) => [themedStyles.retry, pressed && themedStyles.retryPressed]}
        >
          {retrying
            ? <ActivityIndicator color='#FFFFFF' size='small' />
            : <Feather name='refresh-cw' size={scale(15)} color='#FFFFFF' />}
          {!compact && (
            <TextDefault bold style={themedStyles.retryText}>
              {t('retry', { defaultValue: 'Retry' })}
            </TextDefault>
          )}
        </Pressable>
      )}
    </View>
  )
}

const styles = (colors, compact) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: scale(compact ? 62 : 78),
    marginHorizontal: scale(16),
    marginVertical: scale(8),
    padding: scale(compact ? 11 : 14),
    borderRadius: scale(14),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.newBorderColor2 || colors.colorBorder,
    backgroundColor: colors.cardBackground,
    shadowColor: colors.shadowColor || '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2
  },
  iconWrap: {
    width: scale(compact ? 32 : 38),
    height: scale(compact ? 32 : 38),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(20),
    backgroundColor: `${colors.primaryBlue || '#0EA5E9'}18`
  },
  copy: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: scale(10)
  },
  title: {
    color: colors.fontMainColor,
    fontSize: scale(14),
    marginBottom: scale(2)
  },
  message: {
    color: colors.colorTextMuted || colors.fontSecondColor,
    fontSize: scale(compact ? 11 : 12),
    lineHeight: scale(compact ? 15 : 17)
  },
  retry: {
    minWidth: scale(compact ? 34 : 74),
    minHeight: scale(34),
    paddingHorizontal: scale(compact ? 8 : 11),
    flexDirection: 'row',
    gap: scale(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(10),
    backgroundColor: colors.primaryBlue || '#0EA5E9'
  },
  retryPressed: { opacity: 0.78 },
  retryText: { color: '#FFFFFF', fontSize: scale(12) }
})

export default SectionErrorCard
