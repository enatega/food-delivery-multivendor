import AsyncStorage from '@react-native-async-storage/async-storage'

export const storeSearch = async (searchTerm, storeSearchTerm = 'search') => {
  let searchesArray = []
  try {
    const searches = await AsyncStorage.getItem(storeSearchTerm)

    if (searches) {
      searchesArray = JSON.parse(searches)
    }
    if (!searchesArray.includes(searchTerm)) {
      if (searchesArray.length === 10) {
        searchesArray.pop()
      }
      searchesArray.unshift(searchTerm)
      await AsyncStorage.setItem(storeSearchTerm, JSON.stringify(searchesArray))
    }
  } catch (error) {
    console.log('Error storing search:', error)
  }
  return searchesArray // Return the updated searches array
}

export const getRecentSearches = async (storeSearchTerm = 'search') => {
  try {
    const searches = await AsyncStorage.getItem(storeSearchTerm)
    return searches ? JSON.parse(searches) : []
  } catch (error) {
    console.log('Error retrieving searches:', error)
    return []
  }
}

export const clearRecentSearches = async (storeSearchTerm = 'search') => {
  try {
    await AsyncStorage.removeItem(storeSearchTerm)
  } catch (error) {
    console.log('Error clearing searches:', error)
  }
}

export const removeSearchTerm = async (searchTerm, storeSearchTerm = 'search') => {
  try {
    const searches = await AsyncStorage.getItem(storeSearchTerm)
    if (searches) {
      let searchesArray = JSON.parse(searches)
      searchesArray = searchesArray.filter((search) => search !== searchTerm)
      await AsyncStorage.setItem(storeSearchTerm, JSON.stringify(searchesArray))
    }
  } catch (error) {
    console.log('Error removing search:', error)
  }
}

