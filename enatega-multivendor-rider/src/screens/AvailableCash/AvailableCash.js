import { FlatList, View } from 'react-native'
import React, { useContext } from 'react'
import WalletScreenBg from '../../components/ScreenBackground/WalletScreenBg'
import Amount from '../../components/Amount/Amount'
import WalletCard from '../../components/WalletCard/WalletCard'
import styles from './style'
import { riderEarnings } from '../../apollo/queries'
import { gql, useQuery } from '@apollo/client'
import Spinner from '../../components/Spinner/Spinner'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import colors from '../../utilities/colors'
import UserContext from '../../context/user'
import {useTranslation} from 'react-i18next'

const AVAILABLE_CASH = gql`
  ${riderEarnings}
`

const AvailableCash = () => {
  const {t} = useTranslation()
  const { loadingProfile, errorProfile, dataProfile } = useContext(UserContext)
  const { loading, error, data, refetch, networkStatus, fetchMore } = useQuery(
    AVAILABLE_CASH,
    {
      variables: { offset: 0 },
      fetchPolicy: 'network-only',
      pollInterval: 60000
    }
  )
  if (loadingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    )
  }
  if (errorProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TextDefault>{t('errorFetchingRider')}</TextDefault>
      </View>
    )
  }
  return (
    <WalletScreenBg backBtn>
      {loading ? (
        <Spinner />
      ) : error ? (
        <TextDefault center H5 textColor={colors.fontSecondColor}>
          {t('errorOccured')}
        </TextDefault>
      ) : (
        <FlatList
          onRefresh={refetch}
          refreshing={networkStatus !== 7}
          style={styles.transactionHistory}
          ListHeaderComponent={
            <Amount
              text={t('totalAmount')}
              amount={dataProfile.rider.totalWalletAmount}
            />
          }
          data={data.riderEarnings}
          renderItem={({ item }) => <WalletCard item={item} />}
          keyExtractor={item => item.orderId}
          showsVerticalScrollIndicator={false}
          onEndReached={() =>
            fetchMore({ variables: { offset: data.riderEarnings.length } })
          }
        />
      )}
    </WalletScreenBg>
  )
}

export default AvailableCash
