import AsyncStorage from '@react-native-async-storage/async-storage'

const ThemeReducer = (state, action) => {
  switch (action.type) {
    case 'Pink':
      AsyncStorage.setItem('theme', 'Pink')
      return 'Pink'
    case 'Dark':
      AsyncStorage.setItem('theme', 'Dark')
      return 'Dark'
    default:
      AsyncStorage.setItem('theme', 'Pink')
      return 'Pink'
  }
}
export default ThemeReducer
