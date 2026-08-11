import React from 'react'
import { FlatList, View } from 'react-native'

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
    <FlatList
      style={style}
      horizontal
      data={data || []}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
      inverted={inverted}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      updateCellsBatchingPeriod={16}
      windowSize={7}
      // Keep nearby items mounted while the user swipes backward so reverse
      // swipes stay smooth instead of flashing a blank frame.
      removeClippedSubviews={false}
      scrollEventThrottle={16}
      decelerationRate='fast'
      ItemSeparatorComponent={itemSpacing > 0 ? Spacer : undefined}
    />
  )
}

export default React.memo(HorizontalFlashList)
