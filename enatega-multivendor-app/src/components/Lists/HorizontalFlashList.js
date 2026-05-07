import React from 'react'
import { View, Platform } from 'react-native'
import { FlashList } from '@shopify/flash-list'

function HorizontalFlashList({
  style,
  data,
  renderItem,
  keyExtractor,
  contentContainerStyle,
  inverted,
  estimatedItemSize = 160,
  itemSpacing = 0
}) {
  const Spacer = React.useCallback(() => <View style={{ width: itemSpacing }} />, [itemSpacing])

  return (
    <FlashList
      style={style}
      horizontal
      data={data || []}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
      inverted={inverted}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      estimatedItemSize={estimatedItemSize}
      removeClippedSubviews={Platform.OS === 'ios'}
      ItemSeparatorComponent={itemSpacing > 0 ? Spacer : undefined}
    />
  )
}

export default React.memo(HorizontalFlashList)
