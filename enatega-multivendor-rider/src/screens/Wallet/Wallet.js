import { TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import WalletScreenBg from '../../components/ScreenBackground/WalletScreenBg'
import styles from './style'
import Amount from '../../components/Amount/Amount'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { useNavigation } from '@react-navigation/native'
import UserContext from '../../context/user'
import Spinner from '../../components/Spinner/Spinner'
import { MIN_WITHDRAW_AMOUNT } from '../../utilities/constants'
import ConfigurationContext from '../../context/configuration'

const Wallet = () => {
  const navigation = useNavigation()
  const { loadingProfile, errorProfile, dataProfile } = useContext(UserContext)
  const configuration = useContext(ConfigurationContext)
  // eslint-disable-next-line no-undef
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
        <TextDefault bold H5>
          Error occured while fetching rider profile
        </TextDefault>
      </View>
    )
  }

  return (
    <WalletScreenBg>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          paddingTop: 10
        }}>
        <Amount
          text="Enatega Cash"
          amount={dataProfile.rider.currentWalletAmount.toFixed(2)}
          shadow
          icon
          disabled={false}
          bg
        />
        <View style={styles.textView}>
          <TextDefault bold H5>
            Min amount for withdrawl is{' '}
          </TextDefault>
          <TextDefault H4 bolder>
            {configuration.currencySymbol} {MIN_WITHDRAW_AMOUNT.toFixed(2)}
          </TextDefault>
        </View>
        <View style={styles.btnView}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Withdraw')}
            activeOpacity={0.8}
            style={[styles.btn, styles.withdrawBtn]}>
            <TextDefault bolder H5 center>
              Withdraw Money
            </TextDefault>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('WalletHistory', { prevBtn: 'walletHistory' })
            }
            activeOpacity={0.8}
            style={[styles.btn, styles.historyBtn]}>
            <TextDefault bolder H5 center>
              Wallet History
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </WalletScreenBg>
  )
}

export default Wallet
