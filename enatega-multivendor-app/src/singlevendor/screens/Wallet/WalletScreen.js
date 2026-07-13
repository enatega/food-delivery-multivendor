import React, { useContext } from 'react'
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/client'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { GET_ALL_USER_CREDITS, GET_USER_CREDITS_HISTORY } from '../../apollo/queries'
import FreeDeliveriesSkeleton from './FreeDeliveriesSkeleton'
import styles from './style'
import ConfigurationContext from '../../../context/Configuration'
import { formatDateTime } from '../../../utils/formatDateTime'
import FreeDeliveriesCountCard from '../../components/FreeDeliveries/FreeDeliveriesCountCard'
import { usePullToRefresh } from '../../hooks/usePullToRefresh'

const WalletScreen = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const configuration = useContext(ConfigurationContext)
  const currentTheme = {
    ...theme[themeContext.ThemeValue]
  }

  const { data: creditsData, loading: creditsLoading, refetch: refetchCreditsData } = useQuery(GET_ALL_USER_CREDITS)
  const { data: creditsHistoryData, loading: creditsHistoryLoading, refetch: refetchCreditsHistoryData } = useQuery(GET_USER_CREDITS_HISTORY)
  const { refreshing, handleRefresh, spinnerColor } = usePullToRefresh([refetchCreditsData, refetchCreditsHistoryData])
  const currencySymbol = configuration?.currencySymbol || '€'
  const creditBalance = creditsData?.getAllUserCredits?.credits ?? 0
  const creditsHistory = creditsHistoryData?.getUserCreditsHistory ?? []

  const handleBrowseProducts = () => {
    navigation.navigate('Search')
  }

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <AccountSectionHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView
        style={styles(currentTheme).scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles(currentTheme).scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={spinnerColor} colors={[spinnerColor]} />}
      >
        {/* Wallet Title */}
        <View style={styles(currentTheme).titleContainer}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            style={styles(currentTheme).walletTitle}
            bolder
          >
             {t('Wallet') }
          </TextDefault>
          <TextDefault
            textColor={currentTheme.colorTextMuted || currentTheme.fontSecondColor}
            style={styles(currentTheme).walletDescription}
          >
           {t('Your credit is applied automatically on your next order. No cash withdrawals.')}
          </TextDefault>
        </View>

        <FreeDeliveriesCountCard currentTheme={currentTheme} />

        {creditsLoading ? (
          <FreeDeliveriesSkeleton currentTheme={currentTheme} styles={styles} />
        ) : (
          <View style={styles(currentTheme).balanceCard}>
            <TextDefault
              textColor={currentTheme.colorTextMuted || currentTheme.fontSecondColor}
              style={styles(currentTheme).balanceLabel}
            >
              {t('Available Credit')}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              style={styles(currentTheme).balanceAmount}
              bolder
            >
              {currencySymbol} {Number(creditBalance).toFixed(2)}
            </TextDefault>

            <View style={styles(currentTheme).buttonContainer}>
              <TouchableOpacity
                style={styles(currentTheme).browseButton}
                onPress={handleBrowseProducts}
                activeOpacity={0.7}
              >
                <TextDefault
                  textColor={currentTheme.white}
                  style={styles(currentTheme).browseButtonText}
                  bolder
                >
                  {t('Browse Products')}
                </TextDefault>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles(currentTheme).historyContainer}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            style={styles(currentTheme).historyTitle}
            bolder
          >
            {t('Credit History')}
          </TextDefault>

          {creditsHistoryLoading ? (
            <FreeDeliveriesSkeleton currentTheme={currentTheme} styles={styles} />
          ) : creditsHistory.length === 0 ? (
            <TextDefault
              textColor={currentTheme.colorTextMuted || currentTheme.fontSecondColor}
              style={styles(currentTheme).historyEmpty}
            >
              {t('No credit history')}
            </TextDefault>
          ) : (
            <View style={styles(currentTheme).historyList}>
              {creditsHistory.map((item) => (
                <View key={item?._id} style={styles(currentTheme).historyItem}>
                  <View style={styles(currentTheme).historyLeft}>
                    <TextDefault
                      textColor={currentTheme.fontMainColor}
                      bolder
                      style={styles(currentTheme).historyAmount}
                    >
                      {currencySymbol} {Number(item?.amount || 0).toFixed(2)}
                    </TextDefault>
                    <TextDefault
                      textColor={currentTheme.colorTextMuted || currentTheme.fontSecondColor}
                      style={styles(currentTheme).historyMeta}
                    >
                      {item?.orderId ? `${t('Order')} #${item.orderId}` : t('Credit')}
                    </TextDefault>
                  </View>
                  <View style={styles(currentTheme).historyRight}>
                    <View style={styles(currentTheme).historyBadge}>
                      <TextDefault textColor={currentTheme.white} small>
                        {item?.recordType || t('Credit')}
                      </TextDefault>
                    </View>
                    <TextDefault
                      textColor={currentTheme.colorTextMuted || currentTheme.fontSecondColor}
                      style={styles(currentTheme).historyDate}
                      small
                    >
                      {formatDateTime(item?.createdAt)}
                    </TextDefault>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Refund History Section */}
        {/* <View style={styles(currentTheme).refundHistoryContainer}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            style={styles(currentTheme).refundHistoryTitle}
            bolder
          >
           {t('Refund History')}
          </TextDefault>    

          <View style={styles(currentTheme).filterContainer}>
            {filterOptions.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles(currentTheme).filterButton,
                  selectedFilter === filter && styles(currentTheme).filterButtonActive
                ]}
                onPress={() => setSelectedFilter(filter)}
                activeOpacity={0.7}
              >
                <TextDefault
                  textColor={
                    selectedFilter === filter
                      ? currentTheme.primaryBlue || currentTheme.primary
                      : currentTheme.colorTextMuted || currentTheme.fontSecondColor
                  }
                  style={styles(currentTheme).filterButtonText}
                  bolder={selectedFilter === filter}
                >
                  {filter}
                </TextDefault>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles(currentTheme).listContainer}>
            <FlashList
              data={dummyRefunds}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              estimatedItemSize={80}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  )
}

export default WalletScreen
