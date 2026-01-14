import React, { useLayoutEffect, useContext, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Modal, TextInput, Alert } from 'react-native'
import { MaterialIcons, Feather } from '@expo/vector-icons'
import { useQuery, useMutation } from '@apollo/client'

import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { useUserContext } from '../../context/User'
import { FETCH_WALLET_BALANCE, FETCH_WALLET_TRANSACTIONS, profile } from '../../apollo/queries'
import { CONVERT_POINTS_TO_WALLET } from '../../apollo/mutations'

function Wallet(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { profile: userProfile } = useUserContext()
  
  const [convertModalVisible, setConvertModalVisible] = useState(false)
  const [pointsToConvert, setPointsToConvert] = useState('')

  // API
  const { data: walletData, refetch: refetchWallet } = useQuery(FETCH_WALLET_BALANCE)
  const { data: transactionsData, refetch: refetchTransactions } = useQuery(FETCH_WALLET_TRANSACTIONS)
  const [convertPoints, { loading: converting }] = useMutation(CONVERT_POINTS_TO_WALLET)

  const walletBalance = walletData?.fetchWalletBalance || 0
  const transactions = transactionsData?.fetchWalletTransactions || []

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
    if (!points || points <= 0) {
      Alert.alert('Error', 'Please enter valid points amount')
      return
    }
    
    if (points > userProfile?.pointsBalance) {
      Alert.alert('Error', 'Insufficient points balance')
      return
    }

    try {
      await convertPoints({
        variables: { input: { points } },
        refetchQueries: [{ query: FETCH_WALLET_BALANCE }, { query: profile }]
      })
      
      setConvertModalVisible(false)
      setPointsToConvert('')
      refetchWallet()
      refetchTransactions()
      Alert.alert('Success', `Converted ${points} points to wallet`)
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Feather 
          name={item.type === 'CONVERT_POINTS' ? 'arrow-down-circle' : 'arrow-up-circle'} 
          size={20} 
          color={item.type === 'CONVERT_POINTS' ? '#059669' : '#dc2626'} 
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
        { color: item.type === 'CONVERT_POINTS' ? '#059669' : '#dc2626' }
      ]}>
        {item.type === 'CONVERT_POINTS' ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
      </Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Wallet Balance</Text>
        <Text style={styles.balanceAmount}>${walletBalance.toFixed(2)}</Text>
        
        <View style={styles.pointsInfo}>
          <Text style={styles.pointsLabel}>Available Points: {userProfile?.pointsBalance || 0}</Text>
        </View>

        <TouchableOpacity 
          style={styles.convertButton}
          onPress={() => setConvertModalVisible(true)}
        >
          <Feather name="refresh-cw" size={16} color="white" />
          <Text style={styles.convertButtonText}>Convert Points</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>Transaction History</Text>
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No transactions yet</Text>
          }
        />
      </View>

      <Modal
        visible={convertModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setConvertModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Convert Points to Wallet</Text>
            <Text style={styles.modalSubtitle}>
              Available: {userProfile?.pointsBalance || 0} points
            </Text>
            
            <TextInput
              style={styles.pointsInput}
              placeholder="Enter points to convert"
              value={pointsToConvert}
              onChangeText={setPointsToConvert}
              keyboardType="numeric"
            />
            
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  balanceCard: {
    margin: 16,
    backgroundColor: '#5AC12F',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center'
  },
  balanceLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8
  },
  balanceAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16
  },
  pointsInfo: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16
  },
  pointsLabel: {
    color: 'white',
    fontSize: 14
  },
  convertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8
  },
  convertButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500'
  },
  historySection: {
    flex: 1,
    padding: 16
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  transactionContent: {
    flex: 1
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4
  },
  transactionTime: {
    fontSize: 12,
    color: '#6b7280'
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600'
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 40
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20
  },
  pointsInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#f3f4f6'
  },
  confirmButton: {
    backgroundColor: '#5AC12F'
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '500'
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '500'
  }
})

export default Wallet