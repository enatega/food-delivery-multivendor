import React, { useContext } from 'react'
import { View, FlatList, Text, TouchableOpacity } from 'react-native'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import NewRestaurantCard from '../RestaurantCard/NewRestaurantCard'
import MainLoadingUI from '../LoadingUI/MainLoadingUI'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import { isOpen } from '../../../utils/customFunctions'
import Ripple from 'react-native-material-ripple'

const ICONS = {
  grocery: 'local-grocery-store',
  restaurant: 'restaurant',
  store: 'store',
  trending: 'local-fire-department'
}

function MainRestaurantCard(props) {
  const { t, i18n } = useTranslation()
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  if (props?.loading) return <MainLoadingUI />
  if (props?.error) return <Text>Error: {props?.error?.message}</Text>
  if (props?.orders?.length <= 0) return <></>
  return (
    <View style={styles().orderAgainSec}>
      <View style={{ gap: scale(8) }}>
        <View style={styles(currentTheme).header}>
          <View style={styles(currentTheme).row}>
            <TextDefault
              numberOfLines={1}
              textColor={currentTheme.fontFourthColor}
              bolder
              H4
            // style={styles().ItemTitle}
            >
              {t(props?.title)}
            </TextDefault>
            {props?.icon && (
              <MaterialIcons
                name={ICONS[props?.icon]}
                size={24}
                color={currentTheme.editProfileButton}
              />
            )}
          </View>
          <Ripple
            style={styles(currentTheme).seeAllBtn}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('Menu', {
                selectedType: props?.selectedType ?? 'restaurant',
                queryType: props?.queryType ?? 'restaurant',
                shopType: props?.shopType ?? 'restaurant',
              })
            }}
            rippleColor={'#F5F5F5'}
            rippleDuration={300}
          >
            <TextDefault H5 bolder textColor={currentTheme.main}>
              {t('SeeAll')}
            </TextDefault>
          </Ripple>
        </View>
        <FlatList
          style={styles().offerScroll}
          contentContainerStyle={{ flexGrow: 1, ...alignment.PRlarge }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={props?.orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const restaurantOpen = isOpen(item)
            return <NewRestaurantCard {...item} isOpen={restaurantOpen} />
          }}
          inverted={currentTheme?.isRTL ? true : false}
        />
      </View>
    </View>
  )
}

export default MainRestaurantCard
