import { StyleSheet } from 'react-native'

const buildStyles = (props = null) =>
  StyleSheet.create({
    collectionCard: {
      backgroundColor: props != null ? props?.cardBackground : '#181818',
      height: 130,
      width: 100,
      borderRadius: 8,
      shadowColor: props !== null ? props?.iconColor : 'gray',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    collectionImage: {
      height: 80,
      width: '100%',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8
    },
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
