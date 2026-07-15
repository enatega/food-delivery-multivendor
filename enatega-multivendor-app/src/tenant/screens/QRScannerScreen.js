import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { extractSlugFromPayload } from '../tenantApi'

const BRAND_COLOR = '#90E36D'

export default function QRScannerScreen({ onResult, onBack, loading }) {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!permission?.granted) requestPermission()
  }, [])

  function handleBarCodeScanned({ data }) {
    if (scanned || loading) return
    setScanned(true)
    setError(null)

    const slug = extractSlugFromPayload(data)
    if (!slug) {
      setError('Invalid QR code. Please scan a valid business QR code.')
      setScanned(false)
      return
    }
    onResult(slug)
  }

  function retry() {
    setScanned(false)
    setError(null)
  }

  if (!permission) {
    return <LoadingView message="Requesting camera permission…" />
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Permission Needed</Text>
          <Text style={styles.permissionText}>
            Camera access is required to scan QR codes.
          </Text>
          <TouchableOpacity style={styles.allowBtn} onPress={requestPermission}>
            <Text style={styles.allowBtnText}>Allow Camera Access</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Top bar */}
        <SafeAreaView>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.closeBtn} onPress={onBack}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.topTitle}>Scan QR Code</Text>
            <View style={{ width: 44 }} />
          </View>
        </SafeAreaView>

        {/* Viewfinder */}
        <View style={styles.viewfinderArea}>
          <View style={styles.viewfinder}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            {(scanned || loading) && (
              <ActivityIndicator size="large" color={BRAND_COLOR} />
            )}
          </View>
          <Text style={styles.hint}>
            {loading ? 'Loading business…' : 'Point camera at QR code'}
          </Text>
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={retry}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}

function LoadingView({ message }) {
  return (
    <View style={styles.root}>
      <ActivityIndicator size="large" color={BRAND_COLOR} />
      <Text style={{ color: '#fff', marginTop: 12 }}>{message}</Text>
    </View>
  )
}

const CORNER = 24
const BORDER = 3

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: { flex: 1, width: '100%' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { color: '#fff', fontSize: 18 },
  topTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  viewfinderArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinder: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: BRAND_COLOR,
  },
  topLeft: {
    top: 0, left: 0,
    borderTopWidth: BORDER, borderLeftWidth: BORDER,
    borderTopLeftRadius: 6,
  },
  topRight: {
    top: 0, right: 0,
    borderTopWidth: BORDER, borderRightWidth: BORDER,
    borderTopRightRadius: 6,
  },
  bottomLeft: {
    bottom: 0, left: 0,
    borderBottomWidth: BORDER, borderLeftWidth: BORDER,
    borderBottomLeftRadius: 6,
  },
  bottomRight: {
    bottom: 0, right: 0,
    borderBottomWidth: BORDER, borderRightWidth: BORDER,
    borderBottomRightRadius: 6,
  },
  hint: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
  },
  errorBanner: {
    margin: 20,
    backgroundColor: 'rgba(220,50,50,0.9)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  errorText: { color: '#fff', fontSize: 14, textAlign: 'center', marginBottom: 8 },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  permissionTitle: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  permissionText: { color: 'rgba(255,255,255,0.7)', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  allowBtn: {
    backgroundColor: BRAND_COLOR,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 12,
  },
  allowBtnText: { color: '#000', fontWeight: '700', fontSize: 16 },
  backBtn: { paddingVertical: 12 },
  backBtnText: { color: 'rgba(255,255,255,0.6)', fontSize: 15 },
})
