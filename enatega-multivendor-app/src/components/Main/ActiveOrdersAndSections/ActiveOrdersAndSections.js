import React, { useContext } from 'react'
import { View, FlatList } from 'react-native'
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
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <View style={[styles().PB10, { ...alignment.PTmedium }]}>
      {sections.map(resSection => (
        <View key={resSection._id}>
          <TextDefault
            numberOfLines={1}
            textColor={currentTheme.fontMainColor}
            style={{
              ...alignment.MLlarge,
              ...alignment.PBsmall
            }}
            bolder
            H4>
            {resSection.name}
          </TextDefault>
          <View
            style={{
              width: '100%',
              ...alignment.PBmedium
            }}>
            <FlatList
              style={styles().offerScroll}
              contentContainerStyle={{ flexGrow: 1, ...alignment.PRlarge }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={resSection ? resSection.restaurants : []}
              keyExtractor={(item, index) => item._id}
              renderItem={({ item, index }) => {
                return <RestaurantCard {...item} index={index} />
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
