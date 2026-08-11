// Core
import React from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native'

// Components
import ImageHeader from '../Restaurant/ImageHeader'
import { SkeletonBlock } from '../../ui/designSystem'
import { scale } from '../../utils/scaling'

const RestaurantProductsScreenLoader = (
    { styles, currentTheme, iconColor, iconSize, search,
        iconBackColor, iconRadius, iconTouchWidth,
        iconTouchHeight, propsData, loading, searchOpen,
        showSearchResults, searchHandler, searchPopupHandler,
        translationY, HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT,
        TOP_BAR_HEIGHT, data, setSearch
    }
) => {
    return (
        <View style={[styles(currentTheme).flex]}>
            <ImageHeader
                iconColor={iconColor}
                iconSize={iconSize}
                iconBackColor={iconBackColor}
                iconRadius={iconRadius}
                iconTouchWidth={iconTouchWidth}
                iconTouchHeight={iconTouchHeight}
                restaurantName={propsData?.name ?? data?.restaurant?.name}
                restaurantId={propsData?._id}
                restaurantImage={propsData?.image ?? data?.restaurant?.image}
                restaurant={data?.restaurant}
                topBarData={[]}
                loading={loading}
                minimumOrder={propsData?.minimumOrder ?? data?.restaurant?.minimumOrder}
                tax={propsData?.tax ?? data?.restaurant?.tax}
                updatedDeals={[]}
                searchOpen={searchOpen}
                showSearchResults={showSearchResults}
                setSearch={setSearch}
                search={search}
                searchHandler={searchHandler}
                searchPopupHandler={searchPopupHandler}
                translationY={translationY}
            />
            <View
                style={[
                    styles(currentTheme).navbarContainer,
                    styles(currentTheme).flex,
                    {
                        paddingTop: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - TOP_BAR_HEIGHT
                    }
                ]}
            >
                <View style={loaderStyles.tabs}>
                  {[0, 1, 2, 3].map((item) => (
                    <SkeletonBlock key={item} width={scale(80)} height={scale(34)} borderRadius={scale(17)} />
                  ))}
                </View>
                <View style={loaderStyles.rows}>
                  {Array.from(Array(6), (_, i) => (
                    <View key={i} style={[loaderStyles.row, { borderBottomColor: currentTheme.colors?.borderSubtle || 'rgba(128, 128, 128, 0.22)' }]}>
                      <View style={loaderStyles.copy}>
                        <SkeletonBlock width='62%' height={scale(17)} borderRadius={scale(6)} />
                        <SkeletonBlock width='90%' height={scale(12)} borderRadius={scale(6)} />
                        <SkeletonBlock width='28%' height={scale(14)} borderRadius={scale(6)} />
                      </View>
                      <SkeletonBlock width={scale(96)} height={scale(84)} borderRadius={scale(12)} />
                    </View>
                  ))}
                </View>
            </View>
        </View>
    )
}

const loaderStyles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    gap: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    overflow: 'hidden'
  },
  rows: {
    paddingHorizontal: scale(12)
  },
  row: {
    minHeight: scale(106),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingVertical: scale(10),
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  copy: {
    flex: 1,
    gap: scale(9)
  }
})

export default RestaurantProductsScreenLoader
