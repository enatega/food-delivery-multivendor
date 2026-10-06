import React from 'react'
import { useQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { GET_SINGLE_VENDOR_DEALS_SECTION } from '../../apollo/queries'
import HorizontalProductsList from '../HorizontalProductsList'
import SectionListError from '../SectionListError'

const DiscoveryDealRail = ({ section, sectionKey, title, deals, discoveryLoading, useLegacyDeals }) => {
  const { data, loading, error, refetch } = useQuery(GET_SINGLE_VENDOR_DEALS_SECTION, {
    variables: { section, skip: 0, limit: 5 },
    skip: !useLegacyDeals,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true
  })

  if (useLegacyDeals && error) {
    return <SectionListError title={title} onRetry={refetch} />
  }

  const items = useLegacyDeals ? data?.singleVendorDeals?.items : deals?.[sectionKey]?.items
  const isLoading = useLegacyDeals ? loading : discoveryLoading

  const hasNoItems = Array.isArray(items)
    ? items.length === 0
    : !isLoading

  if (hasNoItems) {
    return null
  }

  return (
    <HorizontalProductsList
      listTitle={title}
      ListData={items || []}
      isLoading={isLoading && !items}
      showSeeAll={false}
    />
  )
}

const DiscoveryDeals = ({ deals, loading, useLegacyDeals = false }) => {
  const { t } = useTranslation()

  return (
    <>
      <DiscoveryDealRail section='LIMITED_TIME' sectionKey='limitedTime' title={t('Limited time deals')} deals={deals} discoveryLoading={loading} useLegacyDeals={useLegacyDeals} />
      <DiscoveryDealRail section='WEEKLY' sectionKey='weekly' title={t('weekly deals')} deals={deals} discoveryLoading={loading} useLegacyDeals={useLegacyDeals} />
      <DiscoveryDealRail section='NEW_OFFERS' sectionKey='newOffers' title={t('New offers')} deals={deals} discoveryLoading={loading} useLegacyDeals={useLegacyDeals} />
    </>
  )
}

export default DiscoveryDeals
