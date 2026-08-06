import React, { useCallback, useMemo } from 'react'
import { View } from 'react-native'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import useMultivendorTheme from '../../../ui/designSystem/useMultivendorTheme'
import { SectionHeader } from '../../../ui/designSystem'
import { useTranslation } from 'react-i18next'
import NewRestaurantCard from '../RestaurantCard/NewRestaurantCard'
import MainLoadingUI from '../LoadingUI/MainLoadingUI'
import { useNavigation } from '@react-navigation/native'
import { scale } from '../../../utils/scaling'
import { isOpen } from '../../../utils/customFunctions'
import Ripple from 'react-native-material-ripple'
import HorizontalFlashList from '../../Lists/HorizontalFlashList'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'

function PopularSectionSkeleton({ currentTheme, title, t }) {
  return (
    <View style={styles().orderAgainSec}>
      <View style={{ gap: scale(8) }}>
        <SectionHeader
          style={styles().sectionHeader}
          title={t(title)}
          action={<TextDefault bolder textColor={currentTheme.colors.accent}>{t('SeeAll')}</TextDefault>}
        />

        <View style={styles(currentTheme).skeletonRow}>
          {[0, 1].map((item) => (
            <Placeholder
              key={`popular-skeleton-${item}`}
              Animation={(props) => (
                <Fade
                  {...props}
                  style={styles(currentTheme).placeHolderFadeColor}
                  duration={600}
                />
              )}
              style={styles(currentTheme).popularSkeletonCard}
            >
              <PlaceholderLine style={styles().popularSkeletonImage} />
              <PlaceholderLine width={65} />
              <PlaceholderLine width={85} />
              <PlaceholderLine width={95} />
            </Placeholder>
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
      <View style={{ gap: scale(8) }}>
        <SectionHeader
          style={styles().sectionHeader}
          title={t(props?.title)}
          action={<Ripple
            style={styles(tokens).seeAllBtn}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('Menu', {
                selectedType: props?.selectedType ?? 'restaurant',
                queryType: props?.queryType ?? 'restaurant',
                shopType: props?.shopType ?? 'restaurant'
              })
            }}
            rippleColor={'#F5F5F5'}
            rippleDuration={300}
          >
            <TextDefault bolder textColor={tokens.colors.accent}>
              {t('SeeAll')}
            </TextDefault>
          </Ripple>}
        />
        <HorizontalFlashList
          style={styles().offerScroll}
          estimatedItemSize={280}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: scale(10),
            paddingStart: tokens.spacing.lg
          }}
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderRestaurantItem}
          inverted={isRTL}
        />
      </View>
    </View>
  )
}

export default React.memo(MainRestaurantCard)
