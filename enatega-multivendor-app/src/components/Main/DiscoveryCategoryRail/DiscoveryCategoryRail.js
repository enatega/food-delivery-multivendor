import React, { memo, useCallback, useMemo } from 'react'
import { FlatList, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import useMultivendorTheme from '../../../ui/designSystem/useMultivendorTheme'
import { scale } from '../../../utils/scaling'
import SectionHeader from '../../../singlevendor/components/SectionHeader'
import { DISCOVERY_GUTTER } from '../../../singlevendor/components/Home/discoveryLayout'
import { discoverySpacing } from '../../../ui/designSystem/tokens'

// Framed tile: a rounded-square photo inset in a softly tinted card, with the
// name underneath. Uses only the app's brand and neutral surface colours.
// Exported so single-vendor Home and its skeleton share the exact geometry.
export const TILE_WIDTH = scale(84)
const TILE_PADDING = scale(4)
export const IMAGE_HEIGHT = scale(64)
const IMAGE_RADIUS = scale(14)
export const TILE_RADIUS = IMAGE_RADIUS + TILE_PADDING
export const TILE_GAP = scale(10)
const LABEL_LINE_HEIGHT = scale(14)
export const TILE_HEIGHT = TILE_PADDING + IMAGE_HEIGHT + scale(6) + LABEL_LINE_HEIGHT * 2 + scale(6)
const ITEM_INTERVAL = TILE_WIDTH + TILE_GAP

const getItemLayout = (_, index) => ({ length: ITEM_INTERVAL, offset: ITEM_INTERVAL * index, index })
const keyExtractor = (item, index) => String(item?._id || item?.id || `${item?.name}-${index}`)

// Strips the cache-busting fragment some admin uploads carry so identical
// images share one native cache entry.
const toImageUri = (item) => (typeof item?.image === 'string' ? item.image.split('#')[0] : null) || null

const FramedTile = memo(function FramedTile({ item, uri, themed, onPress }) {
  const initial = item?.name?.trim()?.charAt(0)?.toUpperCase() || '?'

  return (
    <Pressable
      accessibilityRole='button'
      accessibilityLabel={item?.name}
      onPress={() => onPress(item)}
      style={({ pressed }) => [themed.tile, pressed && styles.tilePressed]}
    >
      <View style={themed.imageWrap}>
        {uri
          ? <Image source={{ uri }} style={styles.image} resizeMode='cover' fadeDuration={150} />
          : <Text style={themed.initial}>{initial}</Text>}
      </View>
      <Text style={themed.label} numberOfLines={2}>
        {item?.name}
      </Text>
    </Pressable>
  )
})

function DiscoveryCategoryRail({ title, data, onItemPress, onSeeAll, getImageUri = toImageUri }) {
  const { i18n } = useTranslation()
  const { tokens } = useMultivendorTheme()
  const isRTL = i18n.dir() === 'rtl'

  const themed = useMemo(() => {
    const { colors } = tokens
    return StyleSheet.create({
      tile: {
        ...styles.tileBase,
        backgroundColor: colors.surfaceSubtle,
        borderColor: colors.borderSubtle
      },
      imageWrap: {
        ...styles.imageWrapBase,
        backgroundColor: colors.accentSubtle
      },
      initial: {
        ...styles.initialBase,
        color: colors.accentForeground
      },
      label: {
        ...styles.labelBase,
        color: colors.textPrimary
      }
    })
  }, [tokens])

  const renderItem = useCallback(
    ({ item }) => <FramedTile item={item} uri={getImageUri(item)} themed={themed} onPress={onItemPress} />,
    [themed, onItemPress, getImageUri]
  )

  if (!data?.length) return null

  return (
    <View style={styles.container}>
      <SectionHeader title={title} onSeeAll={onSeeAll} showSeeAll={!!onSeeAll} />
      <FlatList
        data={data}
        horizontal
        inverted={isRTL}
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialNumToRender={5}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        decelerationRate='fast'
        snapToInterval={ITEM_INTERVAL}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: discoverySpacing.sectionTop,
    marginBottom: discoverySpacing.sectionBottom
  },
  listContent: {
    paddingHorizontal: DISCOVERY_GUTTER,
    gap: TILE_GAP
  },
  tileBase: {
    width: TILE_WIDTH,
    padding: TILE_PADDING,
    paddingBottom: scale(6),
    borderRadius: TILE_RADIUS,
    borderWidth: StyleSheet.hairlineWidth
  },
  tilePressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9
  },
  imageWrapBase: {
    width: '100%',
    height: IMAGE_HEIGHT,
    borderRadius: IMAGE_RADIUS,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  initialBase: {
    fontSize: scale(22),
    fontWeight: '800'
  },
  labelBase: {
    marginTop: scale(6),
    paddingHorizontal: scale(2),
    // Two-line slot keeps every tile the same height so the row stays aligned.
    minHeight: LABEL_LINE_HEIGHT * 2,
    fontSize: scale(11.5),
    lineHeight: LABEL_LINE_HEIGHT,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    letterSpacing: -0.1
  }
})

export default React.memo(DiscoveryCategoryRail)
