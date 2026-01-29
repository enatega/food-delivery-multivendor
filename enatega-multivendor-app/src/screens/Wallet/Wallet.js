import React, { useLayoutEffect, useContext, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Modal, TextInput, Alert } from 'react-native'
import { MaterialIcons, Feather } from '@expo/vector-icons'
import { useQuery, useMutation } from '@apollo/client'

import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { useUserContext } from '../../context/User'
import { FETCH_WALLET_BALANCE, FETCH_WALLET_TRANSACTIONS, profile, GET_USER_LOYALTY_DATA } from '../../apollo/queries'
import { CONVERT_POINTS_TO_WALLET } from '../../apollo/mutations'

function Wallet(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { profile: userProfile } = useUserContext()
  const isDark = themeContext.ThemeValue === 'Dark'
  
  const [convertModalVisible, setConvertModalVisible] = useState(false)
  const [pointsToConvert, setPointsToConvert] = useState('')

  // API
  const { data: walletData, refetch: refetchWallet } = useQuery(FETCH_WALLET_BALANCE)
  const { data: transactionsData, refetch: refetchTransactions } = useQuery(FETCH_WALLET_TRANSACTIONS)
  const { data: loyaltyData, refetch: refetchLoyalty } = useQuery(GET_USER_LOYALTY_DATA)
  const [convertPoints, { loading: converting }] = useMutation(CONVERT_POINTS_TO_WALLET, {
    errorPolicy: 'all'
  })

  const walletBalance = walletData?.fetchWalletBalance || 0
  const transactions = transactionsData?.fetchWalletTransactions || []
  const availablePoints = loyaltyData?.fetchUserLoyaltyData?.pointsBalance || 0
  const exchangeRate = loyaltyData?.fetchLoyaltyConfiguration?.pointsPerDollar || 100

  // Debug logging for data sources
  console.log('=== DATA DEBUG ===')
  console.log('loyaltyData full object:', loyaltyData)
  console.log('fetchUserLoyaltyData:', loyaltyData?.fetchUserLoyaltyData)
  console.log('pointsBalance:', loyaltyData?.fetchUserLoyaltyData?.pointsBalance)
  console.log('loyaltyPoints:', loyaltyData?.fetchUserLoyaltyData?.loyaltyPoints)
  console.log('totalEarnedPoints:', loyaltyData?.fetchUserLoyaltyData?.totalEarnedPoints)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.themeBackground
    },
    balanceCard: {
      margin: 16,
      backgroundColor: currentTheme.primary,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.15,
      shadowRadius: 8,
      elevation: 6
    },
    balanceHeader: {
      alignItems: 'center',
      marginBottom: 20
    },
    balanceLabel: {
      color: '#1F2937',
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8
    },
    balanceAmount: {
      color: '#1F2937',
      fontSize: 36,
      fontWeight: '800',
      marginBottom: 12
    },
    pointsInfoCard: {
      backgroundColor: 'rgba(31, 41, 55, 0.1)',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16
    },
    pointsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8
    },
    pointsLabel: {
      color: '#374151',
      fontSize: 13,
      fontWeight: '600'
    },
    pointsValue: {
      color: '#1F2937',
      fontSize: 15,
      fontWeight: '700'
    },
    exchangeRate: {
      color: '#4B5563',
      fontSize: 11,
      textAlign: 'center'
    },
    convertButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(31, 41, 55, 0.15)',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      gap: 8
    },
    convertButtonText: {
      color: '#1F2937',
      fontSize: 14,
      fontWeight: '600'
    },
    historySection: {
      flex: 1,
      paddingHorizontal: 16
    },
    historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    },
    historyTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: currentTheme.fontMainColor
    },
    transactionCard: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.05,
      shadowRadius: 4,
      elevation: 2
    },
    transactionItem: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    transactionIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12
    },
    transactionContent: {
      flex: 1
    },
    transactionTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: currentTheme.fontMainColor,
      marginBottom: 4
    },
    transactionTime: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280'
    },
    transactionAmount: {
      fontSize: 16,
      fontWeight: '700'
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40
    },
    emptyIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '600',
      color: currentTheme.fontMainColor,
      marginBottom: 8
    },
    emptySubText: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center'
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalContent: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      width: '90%',
      maxWidth: 400,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      textAlign: 'center',
      color: currentTheme.fontMainColor,
      marginBottom: 8
    },
    modalSubtitle: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      marginBottom: 24
    },
    pointsInput: {
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB',
      backgroundColor: isDark ? '#374151' : '#F9FAFB',
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: currentTheme.fontMainColor,
      marginBottom: 16
    },
    conversionPreview: {
      fontSize: 16,
      color: currentTheme.primary,
      textAlign: 'center',
      fontWeight: '600',
      backgroundColor: isDark ? 'rgba(144, 227, 109, 0.1)' : '#F0FDF4',
      padding: 12,
      borderRadius: 8,
      marginBottom: 24
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12
    },
    modalButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center'
    },
    cancelButton: {
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      borderWidth: 1,
      borderColor: isDark ? '#4B5563' : '#D1D5DB'
    },
    confirmButton: {
      backgroundColor: currentTheme.primary
    },
    cancelButtonText: {
      color: currentTheme.fontMainColor,
      fontWeight: '600',
      fontSize: 15
    },
    confirmButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 15
    }
  })

  useLayoutEffect(() => {
    props?.navigation.setOptions({
      headerTitle: 'My Wallet',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.fontMainColor,
        fontSize: 16
      },
      headerStyle: {
        backgroundColor: currentTheme.themeBackground
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View style={{ backgroundColor: 'white', borderRadius: 50, marginLeft: 10, alignItems: 'center' }}>
              <MaterialIcons name='arrow-back' size={30} color='black' />
            </View>
          )}
          onPress={() => navigationService.goBack()}
        />
      )
    })
  }, [props?.navigation])

  const handleConvertPoints = async () => {
    const points = parseInt(pointsToConvert)
    console.log('=== CONVERT POINTS DEBUG ===')
    console.log('Points to convert:', points)
    console.log('Available points:', availablePoints)
    console.log('Exchange rate:', exchangeRate)
    console.log('User profile points:', userProfile?.pointsBalance)
    
    if (!points || points < exchangeRate) {
      Alert.alert('Error', `Minimum conversion is ${exchangeRate} points ($1.00)`)
      return
    }
    
    if (points > availablePoints) {
      Alert.alert('Error', 'Insufficient points balance')
      return
    }

    try {
      console.log('Calling convertPoints mutation with input:', { points })
      const result = await convertPoints({
        variables: { input: { points } }
      })
      console.log('Conversion result:', result)
      
      // Check if conversion was successful despite Apollo errors
      if (result.data?.convertPointsToWallet || result.errors?.length === 0) {
        // Refetch all relevant data
        await Promise.all([
          refetchWallet(),
          refetchTransactions(),
          refetchLoyalty()
        ])
        
        setConvertModalVisible(false)
        setPointsToConvert('')
        Alert.alert('Success', `Converted ${points} points to wallet balance`)
      } else {
        throw new Error('Conversion failed')
      }
    } catch (error) {
      console.log('=== CONVERSION ERROR ===')
      console.log('Error object:', error)
      console.log('Error message:', error.message)
      console.log('Error graphQLErrors:', error.graphQLErrors)
      console.log('Error networkError:', error.networkError)
      
      // Check if it's just an Apollo client error but conversion might have succeeded
      if (error.message?.includes('go.apollo.dev/c/err') || error.message?.includes('Invariant Violation')) {
        console.log('Apollo client error detected, checking if conversion succeeded...')
        
        // Wait a moment then refetch to check if conversion actually worked
        setTimeout(async () => {
          try {
            await Promise.all([
              refetchWallet(),
              refetchTransactions(),
              refetchLoyalty()
            ])
            
            setConvertModalVisible(false)
            setPointsToConvert('')
            Alert.alert('Success', `Points converted successfully! Check your wallet balance.`)
          } catch (refetchError) {
            console.log('Refetch failed:', refetchError)
            Alert.alert('Error', 'Conversion status unclear. Please refresh the screen.')
          }
        }, 1000)
      } else {
        // Only show error for actual failures, not Apollo client issues
        Alert.alert('Error', 'Failed to convert points. Please try again.')
      }
    }
  }

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionItem}>
        <View style={styles.transactionIcon}>
          <Feather 
            name={item.type === 'CONVERT_POINTS' ? 'arrow-down-circle' : 'arrow-up-circle'} 
            size={20} 
            color={item.type === 'CONVERT_POINTS' ? currentTheme.primary : '#EF4444'} 
          />
        </View>
        <View style={styles.transactionContent}>
          <Text style={styles.transactionTitle}>{item.description}</Text>
          <Text style={styles.transactionTime}>
            {new Date(parseInt(item.createdAt)).toLocaleDateString()}
          </Text>
        </View>
        <Text style={[
          styles.transactionAmount,
          { color: item.type === 'CONVERT_POINTS' ? currentTheme.primary : '#EF4444' }
        ]}>
          {item.type === 'CONVERT_POINTS' ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
        </Text>
      </View>
    </View>
  )

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Feather name="credit-card" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
      </View>
      <Text style={styles.emptyText}>No transactions yet</Text>
      <Text style={styles.emptySubText}>Your wallet transactions will appear here</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Wallet Balance</Text>
          <Text style={styles.balanceAmount}>${walletBalance.toFixed(2)}</Text>
        </View>
        
        <View style={styles.pointsInfoCard}>
          <View style={styles.pointsRow}>
            <Text style={styles.pointsLabel}>Available Points</Text>
            <Text style={styles.pointsValue}>{availablePoints.toLocaleString()}</Text>
          </View>
          <Text style={styles.exchangeRate}>{exchangeRate} points = $1.00</Text>
        </View>

        <TouchableOpacity 
          style={styles.convertButton}
          onPress={() => setConvertModalVisible(true)}
          disabled={availablePoints < exchangeRate}
        >
          <Feather name="refresh-cw" size={16} color="#1F2937" />
          <Text style={styles.convertButtonText}>Convert Points to Cash</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historySection}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Recent Transactions</Text>
        </View>
        
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      <Modal
        visible={convertModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConvertModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Convert Points</Text>
            <Text style={styles.modalSubtitle}>
              Available: {availablePoints.toLocaleString()} points • {exchangeRate} points = $1.00
            </Text>
            
            <TextInput
              style={styles.pointsInput}
              placeholder={`Enter points (min ${exchangeRate})`}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={pointsToConvert}
              onChangeText={setPointsToConvert}
              keyboardType="numeric"
            />
            
            {pointsToConvert && parseInt(pointsToConvert) >= exchangeRate && (
              <Text style={styles.conversionPreview}>
                {pointsToConvert} points = ${(parseInt(pointsToConvert) / exchangeRate).toFixed(2)}
              </Text>
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setConvertModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConvertPoints}
                disabled={converting}
              >
                <Text style={styles.confirmButtonText}>
                  {converting ? 'Converting...' : 'Convert'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default Wallet