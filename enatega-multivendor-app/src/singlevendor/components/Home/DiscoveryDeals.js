import React, { useCallback, useMemo } from 'react'
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import { GET_SINGLE_VENDOR_DEALS_SECTION } from '../../apollo/queries'
import useMultivendorTheme from '../../../ui/designSystem/useMultivendorTheme'
import { discoverySpacing } from '../../../ui/designSystem/tokens'
import { scale } from '../../../utils/scaling'
import SectionListError from '../SectionListError'
import DealCard, { DEAL_CARD } from './DealCard'
import { DealRailSkeleton } from './HomeSectionSkeletons'
import { DISCOVERY_GUTTER } from './discoveryLayout'

// Every deal rail uses the brand green; only the icon and tagline tell the
// sections apart.
const SECTION_ICONS = { limitedTime: 'flash', weekly: 'calendar', newOffers: 'sparkles' }

const getSectionTones = (colors) => {
  const brand = {
    accent: colors.accent,
    onAccent: colors.textOnAccent,
    subtle: colors.accentSubtle,
    foreground: colors.accentForeground
  }
  const tones = Object.fromEntries(
    Object.entries(SECTION_ICONS).map(([key, icon]) => [key, { ...brand, icon }])
  )
  // New offers sit on a neutral frame; the green stays on the pill and price.
  tones.newOffers.frame = colors.surfaceSubtle
  return tones
}

const DEAL_SECTIONS = [
  { section: 'LIMITED_TIME', key: 'limitedTime', title: 'Limited time deals', tagline: 'Grab them before they are gone' },
  { section: 'WEEKLY', key: 'weekly', title: 'weekly deals', tagline: 'Fresh savings every week' },
  { section: 'NEW_OFFERS', key: 'newOffers', title: 'New offers', tagline: 'Just landed in store' }
]

const keyExtractor = (item) => String(item.id)

const DealSectionHeader = ({ title, tagline, tone, tokens }) => (
  <View style={styles.header}>
    <View style={[styles.headerIcon, { backgroundColor: tone.subtle }]}>
      <Ionicons name={tone.icon} size={scale(18)} color={tone.foreground} />
    </View>
    <View style={styles.headerCopy}>
      <Text style={[styles.headerTitle, { color: tokens.colors.textPrimary }]} numberOfLines={1}>{title}</Text>
      <Text style={[styles.headerTagline, { color: tokens.colors.textMuted }]} numberOfLines={1}>{tagline}</Text>
    </View>
  </View>
)

const DiscoveryDealRail = ({ config, tone, tokens, deals, discoveryLoading, useLegacyDeals }) => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const title = t(config.title)

  const { data, loading, error, refetch } = useQuery(GET_SINGLE_VENDOR_DEALS_SECTION, {
    variables: { section: config.section, skip: 0, limit: 5 },
    skip: !useLegacyDeals,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true
  })

  const onProductPress = useCallback((productId, categoryId) => {
    navigation.navigate('ProductDetails', { productId, categoryId })
  }, [navigation])

  const renderItem = useCallback(
    ({ item }) => <DealCard product={item} tone={tone} tokens={tokens} onPress={onProductPress} />,
    [tone, tokens, onProductPress]
  )

  if (useLegacyDeals && error) {
    return <SectionListError title={title} onRetry={refetch} />
  }

  const items = useLegacyDeals ? data?.singleVendorDeals?.items : deals?.[config.key]?.items
  const isLoading = useLegacyDeals ? loading : discoveryLoading

  if (isLoading && !items) {
    return <DealRailSkeleton />
  }

  if (!items?.length) {
    return null
  }

  return (
    <View style={styles.container}>
      <DealSectionHeader
        title={title}
        tagline={t(config.tagline, { defaultValue: config.tagline })}
        tone={tone}
        tokens={tokens}
      />
      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        initialNumToRender={3}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        decelerationRate='fast'
        snapToInterval={DEAL_CARD.width + DEAL_CARD.gap}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

const DiscoveryDeals = ({ deals, loading, useLegacyDeals = false }) => {
  const { tokens } = useMultivendorTheme()
  const tones = useMemo(() => getSectionTones(tokens.colors), [tokens])

  return (
    <>
      {DEAL_SECTIONS.map((config) => (
        <DiscoveryDealRail
          key={config.key}
          config={config}
          tone={tones[config.key]}
          tokens={tokens}
          deals={deals}
          discoveryLoading={loading}
          useLegacyDeals={useLegacyDeals}
        />
      ))}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: discoverySpacing.sectionTop,
    marginBottom: discoverySpacing.sectionBottom
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    paddingHorizontal: DISCOVERY_GUTTER,
    marginBottom: 15
  },
  headerIcon: {
    width: DEAL_CARD.headerIcon,
    height: DEAL_CARD.headerIcon,
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerCopy: {
    flex: 1
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  headerTagline: {
    marginTop: scale(1),
    fontSize: scale(12)
  },
  listContent: {
    paddingHorizontal: DISCOVERY_GUTTER,
    paddingVertical: scale(2),
    gap: DEAL_CARD.gap
  }
})

export default DiscoveryDeals
