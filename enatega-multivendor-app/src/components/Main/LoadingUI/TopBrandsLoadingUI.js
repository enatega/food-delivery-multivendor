import React, { useContext } from 'react'
import { View } from 'react-native'
import styles from './styles'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'

const TopBrandsLoadingUI = () => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <View style={styles(currentTheme).screenBackground}>
      <Placeholder
        Animation={props => (
          <Fade
            {...props}
            style={styles(currentTheme).placeHolderFadeColor}
            duration={600}
          />
        )}
        style={styles(currentTheme).brandsPlaceHolderContainer}>
        <PlaceholderLine style={styles().height80} />
      </Placeholder>
    </View>
  )
}

export default TopBrandsLoadingUI
