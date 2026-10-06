import React, { useCallback, useMemo } from 'react'
import { View } from 'react-native'
import styles from './styles'
import useMultivendorTheme from '../../../ui/designSystem/useMultivendorTheme'
import { SectionAction, SectionHeader, SkeletonBlock } from '../../../ui/designSystem'
import { useTranslation } from 'react-i18next'
import NewRestaurantCard from '../RestaurantCard/NewRestaurantCard'
import MainLoadingUI from '../LoadingUI/MainLoadingUI'
import { useNavigation } from '@react-navigation/native'
import { isOpen } from '../../../utils/customFunctions'
import HorizontalFlashList from '../../Lists/HorizontalFlashList'
import { scale } from '../../../utils/scaling'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { RESTAURANT_CARD_WIDTH } from '../RestaurantCard/styles'
import { alignment } from '../../../utils/alignment'

const SECTION_ICONS = {
  trending: 'fire',
  restaurant: 'silverware-fork-knife',
  store: 'storefront-outline',
  history: 'history'
}

// Card width + its trailing margin: lets the rail skip per-item measurement.
const RESTAURANT_ITEM_INTERVAL = RESTAURANT_CARD_WIDTH + alignment.MRsmall.marginRight
const getRestaurantItemLayout = (_, index) => ({
  length: RESTAURANT_ITEM_INTERVAL,
  offset: RESTAURANT_ITEM_INTERVAL * index,
  index
})
const keyExtractor = (item) => item._id

const SectionIcon = ({ name, tokens }) => {
  const glyph = SECTION_ICONS[name]
  if (!glyph) return null
  return <MaterialCommunityIcons name={glyph} size={scale(22)} color={tokens.colors.accentForeground} />
}

function PopularSectionSkeleton({ currentTheme, title, icon, t }) {
  return (
    <View style={styles().orderAgainSec}>
      <View>
        <SectionHeader
          style={styles(currentTheme).sectionHeader}
          title={t(title)}
          icon={<SectionIcon name={icon} tokens={currentTheme} />}
          action={<SectionAction label={t('SeeAll')} />}
        />

        <View style={styles(currentTheme).skeletonRow}>
          {[0, 1].map((item) => (
            <View key={`popular-skeleton-${item}`} style={styles(currentTheme).popularSkeletonCard}>
              <SkeletonBlock height={scale(165)} borderRadius={scale(14)} />
              <View style={{ padding: scale(10), gap: scale(9) }}>
                <SkeletonBlock width='62%' height={scale(18)} borderRadius={scale(6)} />
                <SkeletonBlock width='84%' height={scale(12)} borderRadius={scale(6)} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <SkeletonBlock width='26%' height={scale(12)} borderRadius={scale(6)} />
                  <SkeletonBlock width='26%' height={scale(12)} borderRadius={scale(6)} />
                  <SkeletonBlock width='18%' height={scale(12)} borderRadius={scale(6)} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

function MainRestaurantCard(props) {
  const { t, i18n } = useTranslation()
  const navigation = useNavigation()
  const { tokens } = useMultivendorTheme()
  const isRTL = i18n.dir() === 'rtl'

  const orders = useMemo(() => props?.orders || [], [props?.orders])

  const renderRestaurantItem = useCallback(({ item }) => {
    const restaurantOpen = isOpen(item)
    return <NewRestaurantCard {...item} isOpen={restaurantOpen} />
  }, [])

  if (props?.loading) {
    if (props?.queryType === 'topPicks') {
      return (
        <PopularSectionSkeleton
          currentTheme={{ ...tokens, isRTL }}
          title={props?.title}
          icon={props?.icon}
          t={t}
        />
      )
    }

    return <MainLoadingUI />
  }
  // A failed/empty section should simply not render — never surface a raw
  // error string on the discovery page. Hide the whole section instead.
  if (props?.error || orders?.length <= 0) return <></>
  return (
    <View style={styles().orderAgainSec}>
      <View>
        <SectionHeader
          style={styles(tokens).sectionHeader}
          title={t(props?.title)}
          icon={<SectionIcon name={props?.icon} tokens={tokens} />}
          action={<SectionAction
            label={t('SeeAll')}
            onPress={() => {
              navigation.navigate('Menu', {
                selectedType: props?.selectedType ?? 'restaurant',
                queryType: props?.queryType ?? 'restaurant',
                shopType: props?.shopType ?? 'restaurant'
              })
            }}
          />}
        />
        <HorizontalFlashList
          estimatedItemSize={224}
          contentContainerStyle={{
            flexGrow: 1,
            paddingStart: tokens.spacing.md,
            paddingEnd: tokens.spacing.sm,
            alignItems: 'flex-start'
          }}
          data={orders}
          keyExtractor={keyExtractor}
          getItemLayout={getRestaurantItemLayout}
          initialNumToRender={3}
          renderItem={renderRestaurantItem}
          inverted={isRTL}
        />
      </View>
    </View>
  )
}

export default React.memo(MainRestaurantCard)
