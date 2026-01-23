import React, { useContext } from 'react'
import { SafeAreaView, ScrollView, View, RefreshControl } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { MembershipHeader, MembershipLogo, PlansList, FAQLink, SubscribeButton } from '../../components/Membership'
import ConfigurationContext from '../../../context/Configuration'
import useMembership from './useMembership'

import styles from './styles'
import CardModal from '../../components/Membership/CardModal'
import Spinner from '../../../components/Spinner/Spinner'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale } from '../../../utils/scaling'

const Membership = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const useConfigurations = useContext(ConfigurationContext)

  const { data, loading, showCardModal, setShowCardModal, selectedPlan, setSelectedPlan, handleSubscribe, handleOnPay, handleCancelSubscription, activePlanId, handleUpdateSubscription, error, refetch, refetchProfile, isRefreshing } = useMembership()

  const handleFAQ = () => {
    // TODO: Navigate to FAQ or open FAQ modal
    console.log('Open FAQ')
  }  

  const handleRefresh = async () => {
    await refetch();
    await refetchProfile()
  }

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <MembershipHeader currentTheme={currentTheme} onBack={() => navigation.goBack()} />

      <ScrollView refreshControl={<RefreshControl onRefresh={handleRefresh} refreshing={isRefreshing} />} style={styles(currentTheme).scrollView} contentContainerStyle={styles(currentTheme).scrollContent} showsVerticalScrollIndicator={false}>
        <MembershipLogo currentTheme={currentTheme} />

        {loading ? (
          <View style={styles(currentTheme).verticalMargin}>
            <Spinner spinnerColor={currentTheme?.primaryBlue} />
          </View>
        ) : error ? (
          <View style={[styles().verticalMargin, { padding: scale(14), borderRadius: scale(10), borderWidth: 1, borderColor: currentTheme?.newBorderColor2, justifyContent: 'center', alignItems: 'center' }]}>
            <TextDefault H5 bold textColor={currentTheme?.red600}>
              {t('Something went wrong, please try again!')}
            </TextDefault>
          </View>
        ) : (
          <>
            <PlansList plans={data} selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} currentTheme={currentTheme} configurations={useConfigurations} onCancel={handleCancelSubscription} activePlanId={activePlanId} />
            <FAQLink currentTheme={currentTheme} onPress={handleFAQ} />
          </>
        )}
      </ScrollView>

      <CardModal currentTheme={currentTheme} visible={showCardModal} setVisible={setShowCardModal} onClose={() => setShowCardModal(!showCardModal)} onPay={() => handleOnPay()} />
      <SubscribeButton currentTheme={currentTheme} title={activePlanId ? 'Update Subscription' : 'Subscribe'} onPress={!activePlanId ? handleSubscribe : handleUpdateSubscription} isDisable={!selectedPlan || selectedPlan === activePlanId || loading} />
    </SafeAreaView>
  )
}

export default Membership
