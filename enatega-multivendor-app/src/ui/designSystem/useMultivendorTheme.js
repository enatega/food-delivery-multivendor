import { useContext, useMemo } from 'react'
import ThemeContext from '../ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { resolveMultivendorTokens } from './tokens'

const useMultivendorTheme = () => {
  const themeContext = useContext(ThemeContext)
  const themeName = themeContext.ThemeValue
  const legacyTheme = theme[themeName]
  const tokens = useMemo(
    () => resolveMultivendorTokens(themeName, legacyTheme),
    [themeName, legacyTheme]
  )

  return {
    themeName,
    legacyTheme,
    tokens
  }
}

export default useMultivendorTheme
