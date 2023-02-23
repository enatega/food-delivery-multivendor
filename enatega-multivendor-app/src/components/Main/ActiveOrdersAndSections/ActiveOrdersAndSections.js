import React, { useContext } from 'react'
import { View, FlatList } from 'react-native'
import ActiveOrders from '../ActiveOrders'
import UserContext from '../../../context/User'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import RestaurantCard from './RestaurantCard'
import i18n from '../../../../i18n'
import { scale } from '../../../utils/scaling'

function ActiveOrdersAndSections(props) {
  const { sections } = props
  const { isLoggedIn, profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <View style={styles().PB10}>
      <View>{isLoggedIn && profile && <ActiveOrders />}</View>
      {sections.map(resSection => (
        <View key={resSection._id}>
          <TextDefault
            numberOfLines={1}
            textColor={currentTheme.fontMainColor}
            style={{ ...alignment.MLlarge, ...alignment.PBsmall }}
            bolder
            H3>
            {resSection.name}
          </TextDefault>
          <View style={{ width: '100%', ...alignment.PBmedium }}>
            <FlatList
              style={styles().offerScroll}
              contentContainerStyle={{ flexGrow: 1, ...alignment.PRlarge }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={resSection ? resSection.restaurants : []}
              keyExtractor={(item, index) => item._id}
              renderItem={({ item }) => {
                return <RestaurantCard {...item} />
              }}
            />
          </View>
        </View>
      ))}
      <TextDefault
        numberOfLines={1}
        textColor={currentTheme.fontMainColor}
        style={{
          ...alignment.MLlarge,
          ...alignment.PBsmall,
          marginRight: scale(20)
        }}
        bolder
        H3>
        {i18n.t('allRestaurant')}
      </TextDefault>
    </View>
  )
}

export default ActiveOrdersAndSections
