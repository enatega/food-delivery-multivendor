import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { extractSlugFromPayload } from '../tenantApi'

const BRAND_COLOR = '#90E36D'

export default function ManualTenantScreen({ onResult, onBack, loading }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  function handleSubmit() {
    setError(null)
    const trimmed = code.trim()
    if (!trimmed) {
      setError('Please enter a business code.')
      return
    }
    const slug = extractSlugFromPayload(trimmed)
    if (!slug) {
      setError('Invalid code format. Use a slug like "foodfast-qa" or a full link.')
      return
    }
    onResult(slug)
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Enter Business Code</Text>
          <Text style={styles.subtitle}>
            Type the business code, slug, or paste a business link below.
          </Text>

          <TextInput
            ref={inputRef}
            style={[styles.input, error ? styles.inputError : null]}
            value={code}
            onChangeText={v => { setCode(v); setError(null) }}
            placeholder="e.g. foodfast-qatar"
            placeholderTextColor="#bbb"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
            onSubmitEditing={handleSubmit}
            editable={!loading}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.submitBtnText}>Load Business</Text>
            )}
          </TouchableOpacity>

          <View style={styles.examplesCard}>
            <Text style={styles.examplesTitle}>Accepted formats:</Text>
            {[
              'foodfast-qatar',
              'enatega://tenant/foodfast-qatar',
              'https://demo.enatega.com/t/foodfast-qatar',
            ].map((ex, i) => (
              <Text key={i} style={styles.example}>
                • {ex}
              </Text>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 24, paddingTop: 16 },
  backBtn: { marginBottom: 24 },
  backBtnText: { fontSize: 16, color: '#555' },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 28,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#fafafa',
    marginBottom: 8,
  },
  inputError: { borderColor: '#e53e3e' },
  errorText: {
    color: '#e53e3e',
    fontSize: 13,
    marginBottom: 12,
    paddingLeft: 4,
  },
  submitBtn: {
    height: 52,
    backgroundColor: BRAND_COLOR,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#000' },
  examplesCard: {
    backgroundColor: '#f4f6f8',
    borderRadius: 12,
    padding: 16,
  },
  examplesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  example: {
    fontSize: 12,
    color: '#777',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 4,
  },
})
