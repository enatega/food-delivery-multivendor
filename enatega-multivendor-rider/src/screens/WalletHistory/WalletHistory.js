import { FlatList, View } from 'react-native'
import React, { useContext } from 'react'
import WalletScreenBg from '../../components/ScreenBackground/WalletScreenBg'
import Amount from '../../components/Amount/Amount'
import styles from './style'
import { riderWithdrawRequest } from '../../apollo/queries'
import { gql, NetworkStatus, useQuery } from '@apollo/client'
import Spinner from '../../components/Spinner/Spinner'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import colors from '../../utilities/colors'
import RequestCard from '../../components/WalletCard/WithDrawRequestCard'
import UserContext from '../../context/user'
import i18n from '../../../i18n'

const WALLET_HISTORY = gql`
  ${riderWithdrawRequest}
`

const WalletHistory = () => {
  const { loading, error, data, refetch, fetchMore, networkStatus } = useQuery(
    WALLET_HISTORY,
    {
      variables: { offset: 0 },
      fetchPolicy: 'network-only'
    }
  )
  const { loadingProfile, errorProfile, dataProfile } = useContext(UserContext)
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
        <TextDefault>{i18n.t('errorFetchingRider')}</TextDefault>
      </View>
    )
  }
  return (
    <WalletScreenBg backBtn>
      {loading ? (
        <Spinner />
      ) : error ? (
        <TextDefault center H5 textColor={colors.fontSecondColor}>
          {i18n.t('errorOccured')}
        </TextDefault>
      ) : (
        <FlatList
          style={styles.transactionHistory}
          ListHeaderComponent={
            <Amount
              text={i18n.t('totalEarned')}
              amount={dataProfile.rider.totalWalletAmount}
            />
          }
          data={data.riderWithdrawRequests}
          renderItem={({ item }) => <RequestCard item={item} />}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          onEndReached={() =>
            fetchMore({
              variables: { offset: data.riderWithdrawRequests.length }
            })
          }
          refreshing={networkStatus === NetworkStatus.refetch}
        />
      )}
    </WalletScreenBg>
  )
}

export default WalletHistory
