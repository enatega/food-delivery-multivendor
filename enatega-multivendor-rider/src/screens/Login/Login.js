import React from 'react'
import {
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import colors from '../../utilities/colors'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import RiderLogin from '../../assets/svg/RiderLogin.png'
import { FontAwesome } from '@expo/vector-icons'
import Spinner from '../../components/Spinner/Spinner'
import useLogin from './useLogin'
import {useTranslation} from 'react-i18next'

export default function Login() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    usernameError,
    passwordError,
    onSubmit,
    showPassword,
    setShowPassword,
    loading,
    height
  } = useLogin()

    const {t} = useTranslation()
  return (
    <SafeAreaView style={[styles.flex, styles.bgColor]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ height: height * 1 }}
        style={styles.container}>
        <Image
          source={RiderLogin}
          style={[styles.image]}
          height={150}
          width={250}
        />
        <View style={styles.innerContainer}>
          <TextDefault bolder H2 center style={styles.signInText}>
            {t('signInText')}
          </TextDefault>
          <TextInput
            style={[styles.textInput, usernameError && styles.errorInput]}
            placeholder={t('username')}
            value={username}
            onChangeText={e => setUsername(e)}
          />
          {usernameError ? (
            <TextDefault
              style={styles.error}
              bold
              textColor={colors.textErrorColor}>
              {usernameError}
            </TextDefault>
          ) : null}
          <View style={styles.passwordField}>
            <TextInput
              secureTextEntry={showPassword}
              placeholder={t('password')}
              style={[
                styles.textInput,
                styles.passwordInput,
                passwordError && styles.errorInput
              ]}
              value={password}
              onChangeText={e => setPassword(e)}
            />
            <FontAwesome
              onPress={() => setShowPassword(!showPassword)}
              name={showPassword ? 'eye' : 'eye-slash'}
              size={24}
              style={styles.eyeBtn}
            />
            {console.log(username)}
          </View>
          {passwordError ? (
            <View>
              <TextDefault
                style={styles.error}
                bold
                textColor={colors.textErrorColor}>
                {passwordError}
              </TextDefault>
            </View>
          ) : null}
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.btn, loading ? styles.pt5 : styles.pt15]}
            onPress={() => onSubmit()}>
            <TextDefault H4 bold textColor={colors.white}>
              {loading ? <Spinner size="small" /> : t('signInBtn')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
