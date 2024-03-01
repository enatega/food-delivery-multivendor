import React, { useContext } from 'react'
import { View, FlatList, Text, Image, Alert } from 'react-native'
import UserContext from '../../../context/User'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { useTranslation } from 'react-i18next'
import { LocationContext } from '../../../context/Location'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { MaterialIcons } from '@expo/vector-icons'

// suggested Items List Data
const dataItems = [
  { id: '1', name: 'Carrefour', description: '25 mins',  },
  { id: '2', name: 'Carrefour', description: '25 mins',  },
  { id: '3', name: 'Carrefour', description: '25 mins', },
  { id: '3', name: 'Carrefour', description: '25 mins', }
]
function TopBrands(props) {
  const renderItem = ({ item }) => (
   
      <TouchableOpacity style={styles().topbrandsContainer}
        onPress={() => {
          Alert.alert('Alert', 'Under development')
        }}>
      
          <View style={styles().brandImgContainer}>
            <Image
            source={require('../../../assets/images/Carrefour.png')}
            style={styles().brandImg}
            resizeMode="contain"
          />
          </View>
          
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center'
            }}>
           <TextDefault
            style={styles().brandName}
            textColor={currentTheme.fontThirdColor}
            H5
            bolder>
            {item.name}
          </TextDefault>
          <TextDefault
            textColor={currentTheme.fontFifthColor}
            normal>
            {item.description}
          </TextDefault>
          </View>

      </TouchableOpacity>
    
  )
  const { location } = useContext(LocationContext)

  const { t } = useTranslation()

  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <View style={styles().topbrandsSec}>
      <TextDefault
        numberOfLines={1}
        textColor={currentTheme.fontFourthColor}
        bolder
        H4>
        Top Brands
      </TextDefault>
      <View style={{ ...alignment.PRsmall }}>
      <FlatList
        data={dataItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
      />
      </View>
    </View>
  )
}

export default TopBrands
