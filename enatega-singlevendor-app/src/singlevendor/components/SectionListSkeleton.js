import { View, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'
import SectionHeader from './SectionHeader'
import LoadingSkeleton from './LoadingSkeleton'
import { scale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'

const SectionListSkeleton = ({ title = 'Limited time deals' }) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  return (
    <View style={styles(currentTheme).container}>
      <SectionHeader title={title} showSeeAll={false} />
      <View style={styles(currentTheme).listContent}>
        <View style={styles(currentTheme).row}>
          <View style={styles(currentTheme).productCard}>
            <LoadingSkeleton height={200} width="100%" borderRadius={12} />
            <View style={styles(currentTheme).skeletonSpacing}>
              <LoadingSkeleton height={16} width="80%" borderRadius={4} />
              <LoadingSkeleton height={16} width="60%" borderRadius={4} />
              <LoadingSkeleton height={20} width="50%" borderRadius={4} />
            </View>
          </View>
          <View style={styles(currentTheme).productCard}>
            <LoadingSkeleton height={200} width="100%" borderRadius={12} />
            <View style={styles(currentTheme).skeletonSpacing}>
              <LoadingSkeleton height={16} width="80%" borderRadius={4} />
              <LoadingSkeleton height={16} width="60%" borderRadius={4} />
              <LoadingSkeleton height={20} width="50%" borderRadius={4} />
            </View>
          </View>
        </View>
        <View style={styles(currentTheme).row}>
          <View style={styles(currentTheme).productCard}>
            <LoadingSkeleton height={200} width="100%" borderRadius={12} />
            <View style={styles(currentTheme).skeletonSpacing}>
              <LoadingSkeleton height={16} width="80%" borderRadius={4} />
              <LoadingSkeleton height={16} width="60%" borderRadius={4} />
              <LoadingSkeleton height={20} width="50%" borderRadius={4} />
            </View>
          </View>
          <View style={styles(currentTheme).productCard}>
            <LoadingSkeleton height={200} width="100%" borderRadius={12} />
            <View style={styles(currentTheme).skeletonSpacing}>
              <LoadingSkeleton height={16} width="80%" borderRadius={4} />
              <LoadingSkeleton height={16} width="60%" borderRadius={4} />
              <LoadingSkeleton height={20} width="50%" borderRadius={4} />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      ...alignment.MTlarge,
      ...alignment.MBsmall
    },
    listContent: {
      ...alignment.PLlarge,
      ...alignment.PRlarge,
      ...alignment.PBsmall
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: scale(16)
    },
    productCard: {
      width: '48%',
      marginRight: 0
    },
    skeletonSpacing: {
      marginTop: scale(8),
      gap: scale(6)
    }
  })

export default SectionListSkeleton

