import { Image, Pressable, StyleSheet, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import ConfigurationContext from '../../../context/Configuration'
import ContinueWithPhoneButton from '../../../components/Auth/ContinueWithPhoneButton/ContinueWithPhoneButton'
import ToggleFavorite from '../ToggleFavorite'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'

const ProductInfo = ({ t, productInfoData, currentTheme, onAddToCart ,isAddingToCart}) => {
  const config = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const iconColor = themeContext.ThemeValue === 'Dark' ? 'white' : 'black'

  // Todo: temp states for handling fav and item count
  const [itemCount, setItemCount] = useState(0)

  return (
    <>
      <View style={styles().imageContainer}>
        <Image source={{ uri: productInfoData?.image }} style={styles().image} />
      </View>

      <View style={[styles().containerPadding, { gap: 18 }]}>
        <View style={styles().titleContainer}>
          <TextDefault
           bolder
           H2>
            {productInfoData?.title}
          </TextDefault>
          <ToggleFavorite id={productInfoData?.id} />
        </View>

        <View style={[styles().flex, { alignItems: 'center', gap: 12 }]}>
          <TextDefault H4 bolder textColor={currentTheme.singlevendorcolor}>
            {config?.currencySymbol}
            {'\u00A0'}
            {productInfoData?.price}
          </TextDefault>
          {productInfoData?.isPopular && (
            <View style={[styles(currentTheme).popular, styles().flexCenter]}>
              <MaterialCommunityIcons name='fire' size={18} color={currentTheme.white} />
              <TextDefault H5 bold textColor={currentTheme.white}>
                {t('Popular')}
              </TextDefault>
            </View>
          )}
        </View>

        <View style={[styles().flex, { justifyContent: 'space-between', width: '100%' }]}>
          <View style={[styles().flex, { gap: 8, alignItems: 'center', width: '30%' }]}>
            <Pressable style={[styles().pressableContainer, { borderWidth: 1.5, borderColor: currentTheme.borderColor }]} disabled={itemCount == 0} onPress={() => setItemCount((prev) => prev - 1)}>
              <AntDesign name='minus' size={16} color={iconColor} />
            </Pressable>
            <TextDefault  H4 bolder>
              {itemCount}
            </TextDefault>
            <Pressable style={[styles().pressableContainer, { borderWidth: 1.5, borderColor: currentTheme.borderColor }]} onPress={() => setItemCount((prev) => prev + 1)}>
              <AntDesign name='plus' size={16} color={iconColor} />
            </Pressable>
          </View>
          <View style={{ width: '65%' }}>
            <ContinueWithPhoneButton isLoading={isAddingToCart} isDisabled={isAddingToCart || itemCount === 0} title='addToCart' onPress={() => onAddToCart(itemCount)} />
          </View>
        </View>
      </View>
    </>
  )
}

export default ProductInfo

const styles = (props = null) =>
  StyleSheet.create({
    containerPadding: {
      paddingHorizontal: 15
    },
    flex: {
      display: 'flex',
      flexDirection: 'row'
    },
    flexCenter: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    imageContainer: {
      height: 300,
      width: '100%',
      borderTopLeftRadius: scale(10),
      borderTopRightRadius: scale(10),
      overflow: 'hidden'
    },
    image: {
      height: '100%',
      width: '100%'
    },
    titleContainer: {
      width: '100%',
      paddingTop: 12,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    pressableContainer: {
      backgroundColor: props !== null ? props?.colorBgTertiary : 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
      height: 32,
      width: 32
    },
    popular: {
      backgroundColor: props !== null ? props?.primaryBlue : '#0090CD',
      minWidth: 80,
      maxWidth: 120,
      gap: 4,
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: 6
    }
  })