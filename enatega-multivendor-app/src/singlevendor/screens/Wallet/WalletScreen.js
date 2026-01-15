import React, { useContext, useState } from 'react'
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { FlashList } from '@shopify/flash-list'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import OrderHistoryItem from '../../components/OrderHistory/OrderHistoryItem'
import { scale, verticalScale } from '../../../utils/scaling'
import styles from './style'

const WalletScreen = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    ...theme[themeContext.ThemeValue]
  }

  const [selectedFilter, setSelectedFilter] = useState('All')

  // Dummy refund data
  const dummyRefunds = [
    {
      id: '1',
      name: 'Apple Juice',
      date: 'Sep 1, 1:42 AM',
      price: '€ 15.00',
      status: 'Refunded',
      image: require('../../assets/images/sliderImg1.png')
    },
    {
      id: '2',
      name: 'Veggie Spring Rolls',
      date: 'Aug 24, 8:19 PM',
      price: '€ 55.00',
      status: 'Refunded',
      image: require('../../assets/images/sliderImg1.png')
    },
    {
      id: '3',
      name: 'Chicken Burger',
      date: 'Aug 20, 3:15 PM',
      price: '€ 60.00',
      status: 'Refunded',
      image: require('../../assets/images/sliderImg1.png')
    }
  ]

  const handleBrowseProducts = () => {
    navigation.navigate('Search')
  }

  const handleRefundPress = (refund) => {
    // Handle refund item press if needed
    console.log('Refund pressed:', refund)
  }

  const renderItem = ({ item }) => (
    <OrderHistoryItem
      orders={item}
      currentTheme={currentTheme}
      onOrderPress={handleRefundPress}
    />
  )

  const keyExtractor = (item) => item.id

  const filterOptions = ['All', 'This week', 'This month']

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
           {t('Your refunded amounts are credited here and can be used for future orders. No cash withdrawals or chargebacks.')}
          </TextDefault>
        </View>


        <View style={styles(currentTheme).balanceCard}>
          <TextDefault
            textColor={currentTheme.colorTextMuted || currentTheme.fontSecondColor}
            style={styles(currentTheme).balanceLabel}
          >
           {t('You have number of free deliveries')}
          </TextDefault>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            style={styles(currentTheme).balanceAmount}
            bolder
          >
           1
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
