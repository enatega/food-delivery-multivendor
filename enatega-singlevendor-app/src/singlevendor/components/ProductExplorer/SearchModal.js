// import React, { memo, useState, useMemo } from 'react'
// import { View, StyleSheet, Modal } from 'react-native'
// import { FlashList } from '@shopify/flash-list'

// import SearchHeader from './SearchHeader'
// import ProductCard from '../ProductCard'
// import { useSafeAreaInsets } from 'react-native-safe-area-context'

// const SearchModal = ({ visible, onClose, items }) => {
//   const insets = useSafeAreaInsets()
//   const [query, setQuery] = useState('')

//   const filteredItems = useMemo(() => {
//     if (!query.trim()) return items

//     const q = query.toLowerCase()

//     return items.filter((item) => item.title?.toLowerCase().includes(q))
//   }, [query, items])

//   return (
//     <Modal visible={visible} animationType='slide' presentationStyle='fullScreen' onRequestClose={onClose}>
//       <View style={[styles.container, { paddingTop: insets.top ,paddingBottom:insets.bottom}]}>

//         <SearchHeader value={query} placeholder='Search items' onChangeText={setQuery} onBackPress={onClose} />

//         <FlashList
//         style={{paddingHorizontal:10}}
//           data={filteredItems}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <ProductCard
//               product={item}
//               containerStyles={{
//                 width: '94%',
//                 marginBottom: 10,
//                 marginLeft: 6,
//                 marginRight: 6
//               }}
//             />
//           )}
//           numColumns={2}
//           estimatedItemSize={190}
//           showsVerticalScrollIndicator={false}
//         />
//       </View>
//     </Modal>
//   )
// }

// export default memo(SearchModal)

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF',
//   }
// })

// import React, { memo, useState, useMemo, useEffect } from 'react'
// import { View, StyleSheet, Modal, ActivityIndicator } from 'react-native'
// import { FlashList } from '@shopify/flash-list'
// import { useSafeAreaInsets } from 'react-native-safe-area-context'

// import SearchHeader from './SearchHeader'
// import ProductCard from '../ProductCard'
// import useHomeProducts from '../../screens/Home/useHomeProducts'
// import { useNavigation } from '@react-navigation/native'

// const PAGE_LIMIT = 10

// const SearchModal = ({ visible, onClose, items = [], isPaginated = false, categoryId = null }) => {
//   const insets = useSafeAreaInsets()
//   const navigation = useNavigation()
//   const [query, setQuery] = useState('')
//   const [listData, setListData] = useState([])
//   const [page, setPage] = useState(0)
//   console.log('page:', page)

//   const { data, loading, refetch, error } = useHomeProducts(
//     isPaginated
//       ? {
//           categoryId,
//           skip: page * PAGE_LIMIT,
//           limit: PAGE_LIMIT,
//           search: query
//         }
//       : {}
//   )
//   console.log('data:', data,error)
//   const serverItems = data?.getCategoryItemsSingleVendor?.items ?? []
//   console.log('serverItems:', serverItems)
//   const pagination = data?.getCategoryItemsSingleVendor?.pagination
//   console.log('pagination:', pagination)
//   useEffect(() => {
//     if (!isPaginated) return

//     if (page === 0) {
//       setListData(serverItems)
//     } else {
//       setListData((prev) => [...prev, ...serverItems])
//     }
//   }, [.])

//   const filteredLocalItems = useMemo(() => {
//     if (!query.trim()) return items
//     const q = query.toLowerCase()
//     return items.filter((i) => i.title?.toLowerCase().includes(q))
//   }, [query, items])

//   const onEndReached = () => {
//     console.log('onEndReached:searchModal', isPaginated)
//     if (!isPaginated) return
//     if (!pagination?.hasMore || loading) return

//     setPage((prev) => prev + 1)
//   }

//   const onSearchChange = (text) => {
//     setQuery(text)

//     if (isPaginated) {
//       setPage(0)
//       refetch({
//         categoryId,
//         skip: 0,
//         limit: PAGE_LIMIT,
//         search: text
//       })
//     }
//   }

//   const onProductPress = (id) => {
//     onClose && onClose()
//     navigation.navigate('ProductDetails', {
//       productId: id
//     })
//   }

//   const handleAddToCart = (drink) => {
//     // Handle add to cart action
//     console.log('Add to cart:', drink.name)
//   }

//   const dataSource = isPaginated ? listData : filteredLocalItems

//   return (
//     <Modal visible={visible} animationType='slide' presentationStyle='fullScreen' onRequestClose={onClose}>
//       <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
//         <SearchHeader value={query} placeholder='Search items' onChangeText={onSearchChange} onBackPress={onClose} />

//         <FlashList
//           style={{ paddingHorizontal: 10 }}
//           data={dataSource}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <ProductCard
//               product={item}
//               onCardPress={onProductPress}
//               onAddToCart={handleAddToCart}
//               containerStyles={{
//                 width: '94%',
//                 marginBottom: 10,
//                 marginLeft: 6,
//                 marginRight: 6
//               }}
//             />
//           )}
//           numColumns={2}
//           estimatedItemSize={190}
//           showsVerticalScrollIndicator={false}
//           onEndReached={onEndReached}
//           onEndReachedThreshold={0.4}
//           ListFooterComponent={isPaginated && loading ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
//         />
//       </View>
//     </Modal>
//   )
// }

// export default memo(SearchModal)

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF'
//   }
// })

import React, { memo, useState, useMemo, useContext } from 'react'
import { View, StyleSheet, Modal, ActivityIndicator } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import HorizontalProductsEmptyView from '../HorizontalProductsEmptyView'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'

import SearchHeader from './SearchHeader'
import ProductCard from '../ProductCard'
import useHomeProducts from '../../screens/Home/useHomeProducts'
import ProductsList from './ProductsList'

const PAGE_LIMIT = 10

const SearchModal = ({
  visible,
  onClose,
  items = [],
  isPaginated = false,
  categoryId = null,
}) => {
 

  return (
    <Modal visible={visible} animationType='slide' presentationStyle='fullScreen' onRequestClose={onClose}>
     <ProductsList onClose={onClose} items={items} isPaginated={isPaginated} categoryId={categoryId} />
    </Modal>
  )
}

export default memo(SearchModal)

const styles = (currentTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: currentTheme?.themeBackground || '#FFF'
  }
})
