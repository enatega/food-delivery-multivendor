import React, { useState } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Platform
} from 'react-native'
import { TextDefault, Spinner } from '../../components'
import { useLogin } from '../../ui/hooks'
import { colors } from '../../utilities'
import styles from './styles'
import { Image, Button, Input, Icon } from 'react-native-elements'
import {useTranslation} from 'react-i18next'

const { height } = Dimensions.get('window')
export default function Login() {
  const {
    onLogin,
    isValid,
    loading,
    errors,
    setPassword,
    setUserName,
    username,
    password
  } = useLogin()

  const [showPassword, setShowPassword] = useState(false)
  const {t} = useTranslation()
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          height: Platform.OS === 'ios' ? height * 1.0 : height * 1.05
        }}>
        <View style={{ flex: 1, backgroundColor: colors.white }}>
          <View style={styles.topContainer}>
            <View>
              <Image
                source={require('../../assets/Header.png')}
                PlaceholderContent={<ActivityIndicator />}
                style={{ width: 150, height: 140 }}
              />
            </View>
          </View>
          <View style={styles.lowerContainer}>
            <View style={styles.headingText}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                {t('signInWithEmail')}
              </Text>
            </View>
            <View style={{ flex: 0.5, alignSelf: 'center' }}>
              <Input
                placeholder={t('email')}
                onChangeText={text => setUserName(text)}
                inputContainerStyle={styles.inputStyle}
                errorMessage={
                  errors && errors.username ? errors.username.join(',') : ''
                }
                onBlur={isValid}
                autoCapitalize="none"
                errorStyle={{ color: colors.textErrorColor }}
                keyboardType="email-address"
                defaultValue={username}
                returnKeyType="next"
                style={{ paddingLeft: 8 }}
              />
              <Input
                placeholder={t('password')}
                onChangeText={text => setPassword(text)}
                inputContainerStyle={styles.inputStyle}
                returnKeyType="go"
                style={{ paddingLeft: 8 }}
                containerStyle={{ marginTop: 15 }}
                secureTextEntry={!showPassword}
                rightIconContainerStyle={{ marginRight: 10 }}
                errorMessage={
                  errors && errors.password ? errors.password.join(',') : ''
                }
                onBlur={isValid}
                autoCapitalize="none"
                errorStyle={{ color: colors.textErrorColor }}
                defaultValue={password}
                rightIcon={
                  <Icon
                    onPress={() => setShowPassword(!showPassword)}
                    type="font-awesome"
                    color="gray"
                    name={showPassword ? 'eye' : 'eye-slash'}
                    size={20}
                  />
                }
              />
            </View>
            <View
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                flex: 0.2
              }}>
              <Button
                title={t('signIn')}
                disabled={loading}
                onPress={onLogin}
                buttonStyle={{
                  backgroundColor: '#FFFF',
                  borderColor: 'transparent',
                  borderWidth: 0,
                  borderRadius: 5,
                  width: 250,
                  height: 50
                }}
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,

                  elevation: 3
                }}
                titleStyle={{ color: 'black' }}>
                {loading ? (
                  <Spinner spinnerColor={colors.buttonText} />
                ) : (
                  <TextDefault textColor={colors.buttonText} H3 bold>
                    {t('login')}
                  </TextDefault>
                )}
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
