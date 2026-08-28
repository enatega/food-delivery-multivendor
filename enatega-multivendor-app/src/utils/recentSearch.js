import AsyncStorage from '@react-native-async-storage/async-storage'

export const storeSearch = async(searchTerm) => {
  let searchesArray = []
  try {
    const searches = await AsyncStorage.getItem('searches')

    if (searches) {
      searchesArray = JSON.parse(searches)
    }
    if (!searchesArray.includes(searchTerm)) {
      if (searchesArray.length === 10) {
        searchesArray.pop()
      }
      searchesArray.unshift(searchTerm)
      await AsyncStorage.setItem('searches', JSON.stringify(searchesArray))
    }
  } catch (error) {
    console.error('Error storing search:', error)
  }
  return searchesArray
}

export const getRecentSearches = async() => {
  try {
    const searches = await AsyncStorage.getItem('searches')
    return searches ? JSON.parse(searches) : []
  } catch (error) {
    console.error('Error retrieving searches:', error)
    return []
  }
}

export const clearRecentSearches = async() => {
  try {
    await AsyncStorage.removeItem('searches')
  } catch (error) {
    console.error('Error clearing searches:', error)
  }
}

export const removeSearchTerm = async(searchTerm) => {
  let searchesArray = []

  try {
    const searches = await AsyncStorage.getItem('searches')
    searchesArray = searches ? JSON.parse(searches) : []

    const updatedSearches = searchesArray.filter((term) => term !== searchTerm)

    if (updatedSearches.length > 0) {
      await AsyncStorage.setItem('searches', JSON.stringify(updatedSearches))
    } else {
      await AsyncStorage.removeItem('searches')
    }

    return updatedSearches
  } catch (error) {
    console.error('Error removing search:', error)
    return searchesArray
  }
}
