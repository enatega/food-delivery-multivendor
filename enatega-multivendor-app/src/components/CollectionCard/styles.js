import { StyleSheet } from 'react-native'

const buildStyles = (props = null) =>
  StyleSheet.create({
    collectionCard: {
      width: props?.sizes?.compactTile ?? 80,
      alignItems: 'center'
    },
    brandImgContainer: {
      width: props?.sizes?.compactTile ?? 80,
      height: props?.sizes?.compactTile ?? 80,
      borderRadius: props?.radii?.tile ?? 12,
      overflow: 'hidden',
      backgroundColor: props?.colors?.surfaceSubtle ?? '#F7F7F8'
    },
    collectionImage: {
      height: '100%',
      width: '100%',
      borderRadius: props?.radii?.tile ?? 12
    },
    label: {
      paddingTop: props?.spacing?.sm ?? 8,
      paddingBottom: props?.spacing?.xs ?? 4,
      width: '100%',
      minHeight: 40,
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '500',
      textAlign: 'center'
    }
  })

// Cache the built stylesheet per theme so it isn't rebuilt on every render of
// every card.
const NULL_KEY = { __nullTheme: true }
const stylesCache = new WeakMap()

const styles = (props = null) => {
  const key = props ?? NULL_KEY
  const cached = stylesCache.get(key)
  if (cached) return cached
  const created = buildStyles(props)
  stylesCache.set(key, created)
  return created
}

export default styles
