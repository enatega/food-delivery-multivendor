import React from 'react'
import { useQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { GET_SINGLE_VENDOR_DEALS_SECTION } from '../../apollo/queries'
import HorizontalProductsList from '../HorizontalProductsList'
import SectionListError from '../SectionListError'

const DiscoveryDealRail = ({ section, title }) => {
  const { data, loading, error, refetch } = useQuery(GET_SINGLE_VENDOR_DEALS_SECTION, {
    variables: { section, skip: 0, limit: 5 },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true
  })

  if (error) {
    return <SectionListError title={title} onRetry={refetch} />
  }

  const items = data?.singleVendorDeals?.items

  const hasNoItems = Array.isArray(items)
    ? items.length === 0
    : !loading

  if (hasNoItems) {
    return null
  }

  return (
    <HorizontalProductsList
      listTitle={title}
      ListData={items || []}
      isLoading={loading && !data}
      showSeeAll={false}
    />
  )
}

const DiscoveryDeals = () => {
  const { t } = useTranslation()

  return (
    <>
      <DiscoveryDealRail section='LIMITED_TIME' title={t('Limited time deals')} />
      <DiscoveryDealRail section='WEEKLY' title={t('weekly deals')} />
      <DiscoveryDealRail section='NEW_OFFERS' title={t('New offers')} />
    </>
  )
}

export default DiscoveryDeals
