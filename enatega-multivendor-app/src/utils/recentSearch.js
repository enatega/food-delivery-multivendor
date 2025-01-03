import AsyncStorage from "@react-native-async-storage/async-storage";


export const storeSearch = async (searchTerm) => {
  let searchesArray = [];
  try {
    const searches = await AsyncStorage.getItem('searches')
   
    if (searches) {
      searchesArray = JSON.parse(searches);
    }
    if (!searchesArray.includes(searchTerm)) {
      if (searchesArray.length === 10) {
        searchesArray.pop();
      }
      searchesArray.unshift(searchTerm)
      await AsyncStorage.setItem('searches', JSON.stringify(searchesArray))
    }
  } catch (error) {
    console.log('Error storing search:', error)
  }
  return searchesArray; // Return the updated searches array
}

export const getRecentSearches = async () => {
  try {
    const searches = await AsyncStorage.getItem('searches')
    return searches ? JSON.parse(searches) : []
  } catch (error) {
    console.log('Error retrieving searches:', error)
    return []
  }
}

export const clearRecentSearches = async () => {
  try {
    await AsyncStorage.removeItem('searches')
  } catch (error) {
    console.log('Error clearing searches:', error)
  }
}
