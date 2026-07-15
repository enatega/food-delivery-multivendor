import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native'
import { fetchTenantConfig, extractSlugFromPayload, humanizeError } from '../tenantApi'
import { useTenant } from '../TenantContext'
import QRScannerScreen from './QRScannerScreen'
import ManualTenantScreen from './ManualTenantScreen'

const BRAND_COLOR = '#90E36D'

export default function TenantSelectionScreen() {
  const { setTenant } = useTenant()
  const [screen, setScreen] = useState('home') // 'home' | 'qr' | 'manual'
  const [loading, setLoading] = useState(false)

  async function onSlugResolved(slug) {
    setLoading(true)
    try {
      const config = await fetchTenantConfig(slug)
      await setTenant(config)
      // TenantProvider state update causes AppCore to re-render into the main app
    } catch (err) {
      Alert.alert('Error', humanizeError(err.message))
    } finally {
      setLoading(false)
    }
  }

  if (screen === 'qr') {
    return (
      <QRScannerScreen
        onResult={onSlugResolved}
        onBack={() => setScreen('home')}
        loading={loading}
      />
    )
  }

  if (screen === 'manual') {
    return (
      <ManualTenantScreen
        onResult={onSlugResolved}
        onBack={() => setScreen('home')}
        loading={loading}
      />
    )
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🚀</Text>
          </View>
          <Text style={styles.brand}>Enatega</Text>
          <Text style={styles.tagline}>Multi-Vendor Delivery</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select Your Business</Text>
          <Text style={styles.cardSubtitle}>
            Scan the QR code provided by your business, or enter your business code manually.
          </Text>

          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => setScreen('qr')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryIcon}>📷</Text>
            <Text style={styles.btnPrimaryText}>Scan QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnSecondary]}
            onPress={() => setScreen('manual')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnSecondaryText}>Enter Code Manually</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>
          Don't have a code? Contact your business to get started.
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoArea: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BRAND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoEmoji: { fontSize: 36 },
  brand: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  btn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  btnPrimary: { backgroundColor: BRAND_COLOR },
  btnPrimaryIcon: { fontSize: 20, marginRight: 8 },
  btnPrimaryText: { fontSize: 16, fontWeight: '700', color: '#000' },
  btnSecondary: { borderWidth: 1.5, borderColor: '#e0e0e0', backgroundColor: '#fff' },
  btnSecondaryText: { fontSize: 16, fontWeight: '600', color: '#333' },
  hint: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
})
