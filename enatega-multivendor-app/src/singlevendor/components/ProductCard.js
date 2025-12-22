import { View, Text, ImageBackground, StyleSheet, Pressable } from 'react-native'
import React, { useContext } from 'react'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'
import ProductImageOverlay from './ProductImageOverlay'

const ProductCard = ({ product, onAddToCart ,onCardPress}) => {
    const { i18n } = useTranslation()
    const themeContext = useContext(ThemeContext)
    const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

    return (
        <Pressable onPress={onCardPress} style={styles(currentTheme).card}>
            <ImageBackground 
                source={product.image} 
                style={styles(currentTheme).imageContainer}
                imageStyle={styles(currentTheme).productImage}
            >
                <ProductImageOverlay 
                    hasDeal={product.hasDeal} 
                    onAddToCart={onAddToCart} 
                    product={product}
                    dealText={product.dealText || 'Deal'}
                />
            </ImageBackground>
            <View style={styles(currentTheme).contentContainer}>
            <Text style={styles(currentTheme).price}>€ {product.price.toFixed(2)}</Text>
            <Text style={styles(currentTheme).productName}>{product.name}</Text>
            <View style={styles(currentTheme).volumeContainer}>
                <Text style={styles(currentTheme).volume}>{product.volume}</Text>
                <Text style={styles(currentTheme).pricePerLiter}>€ {product.pricePerLiter.toFixed(1)}/l</Text>
            </View>
            </View>
        </Pressable>
    )
}

const styles = (currentTheme) => StyleSheet.create({
    card: {
        width: 150,
        backgroundColor: currentTheme.cardBackground,
        borderRadius: 12,
        marginRight: 12,
        position: 'relative',
        shadowColor: currentTheme.shadowColor,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    contentContainer: {
        padding: 12,
    },
    imageContainer: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        marginBottom: 8,
        overflow: 'hidden',
        position: 'relative'
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: currentTheme.primaryBlue,
        marginBottom: 4
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
        color: currentTheme.fontMainColor,
        marginBottom: 6
    },
    volumeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    volume: {
        fontSize: 12,
        color: currentTheme.fontSecondColor
    },
    pricePerLiter: {
        fontSize: 12,
        color: currentTheme.fontSecondColor
    }
})

export default ProductCard

