import React, { useContext } from 'react'
import { View } from 'react-native'
import { scale } from '../../../utils/scaling'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import styles from '../../components/Cart/styles'
import LoadingSkeleton from '../../components/LoadingSkeleton'

const FavoriteCartSkeleton = () => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <View style={styles(currentTheme).itemContainer}>
      <View style={styles().imageContainer}>
        <LoadingSkeleton width={scale(60)} height={scale(60)} borderRadius={scale(8)} />
      </View>

      <View style={styles().mainContent}>
        <LoadingSkeleton width="60%" height={scale(12)} style={{ marginBottom: scale(8) }} />
        {/* <LoadingSkeleton width="40%" height={scale(14)} style={{ marginBottom: scale(8) }} /> */}

        <View style={styles().bottomRow}>
          <LoadingSkeleton width={scale(25)} height={scale(25)} borderRadius={scale(20)} />
          <LoadingSkeleton width={scale(50)} height={scale(16)} />
        </View>
      </View>
    </View>
  )
}

export default FavoriteCartSkeleton
