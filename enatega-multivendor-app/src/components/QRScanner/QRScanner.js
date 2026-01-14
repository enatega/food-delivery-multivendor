import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
// import { BarCodeScanner } from 'expo-barcode-scanner'
import { Ionicons } from '@expo/vector-icons'

const QRScanner = ({ onScanSuccess }) => {
  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)

  // useEffect(() => {
  //   const getBarCodeScannerPermissions = async () => {
  //     const { status } = await BarCodeScanner.requestPermissionsAsync()
  //     setHasPermission(status === 'granted')
  //   }
  //   getBarCodeScannerPermissions()
  // }, [])

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true)
    
    // Extract referral code from QR data
    let referralCode = data
    try {
      // If it's a URL, try to extract referral code
      if (data.includes('ref=') || data.includes('referralCode=')) {
        const url = new URL(data)
        referralCode = url.searchParams.get('ref') || url.searchParams.get('referralCode') || data
      }
    } catch (e) {
      // If not a valid URL, use data as is
      referralCode = data
    }

    onScanSuccess(referralCode)
    
    // Reset scanner after 2 seconds
    setTimeout(() => setScanned(false), 2000)
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera" size={64} color="#ccc" />
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-off" size={64} color="#ccc" />
        <Text style={styles.text}>No access to camera</Text>
      </View>
    )
  }

  return (
    <View style={styles.scannerContainer}>
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
        <Text style={styles.instructionText}>
          {scanned ? 'QR Code Scanned!' : 'Point camera at QR code'}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginTop: 16
  },
  scannerContainer: {
    flex: 1,
    position: 'relative'
  },
  scanner: {
    flex: 1
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scanArea: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
    backgroundColor: 'transparent'
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  }
})

export default QRScanner