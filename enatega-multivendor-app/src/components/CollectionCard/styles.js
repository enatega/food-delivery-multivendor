import { StyleSheet } from 'react-native'

const buildStyles = (props = null) =>
  StyleSheet.create({
    collectionCard: {
      width: 104,
      borderRadius: props?.radii?.md ?? 10,
      overflow: 'hidden'
    },
    brandImgContainer: {
      borderRadius: props?.radii?.md ?? 10,
      overflow: 'hidden',
      backgroundColor: props?.colors?.surfaceSubtle ?? '#F7F7F8'
    },
    collectionImage: {
      height: 88,
      width: '100%',
      borderRadius: props?.radii?.md ?? 10
    },
    label: {
      paddingTop: props?.spacing?.sm ?? 8,
      paddingHorizontal: props?.spacing?.xs ?? 4,
      paddingBottom: props?.spacing?.xs ?? 4,
      lineHeight: 18
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
