// Core
import React from 'react'
import { View } from 'react-native'

// Placeholder
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'

// Components
import ImageHeader from '../Restaurant/ImageHeader'

const RestaurantProductsScreenLoader = (
    { styles, currentTheme, iconColor, iconSize, search,
        iconBackColor, iconRadius, iconTouchWidth,
        iconTouchHeight, propsData, loading, searchOpen,
        showSearchResults, searchHandler, searchPopupHandler,
        translationY, HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT,
        TOP_BAR_HEIGHT, PlaceholderMedia, data, setSearch
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
                {Array.from(Array(10), (_, i) => (
                    <Placeholder
                        key={i}
                        Animation={(props) => (
                            <Fade
                                {...props}
                                style={{ backgroundColor: currentTheme.gray }}
                                duration={600}
                            />
                        )}
                        Left={PlaceholderMedia}
                        style={{
                            padding: 12
                        }}
                    >
                        <PlaceholderLine width={80} />
                        <PlaceholderLine width={80} />
                    </Placeholder>
                ))}
            </View>
        </View>
    )
}

export default RestaurantProductsScreenLoader