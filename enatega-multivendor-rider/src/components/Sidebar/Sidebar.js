import React from 'react'
import { View, Platform, Switch, ImageBackground, Linking } from 'react-native'
import NavItem from './NavItem/NavItem'
import Profile from './Profile/Profile'
import styles from './styles'
import TextDefault from '../Text/TextDefault/TextDefault'
import colors from '../../utilities/colors'
import rider from '../../assets/rider.png'
import useSidebar from './useSidebar'
import {useTranslation} from 'react-i18next'

function SidebBar() {
  const { logout, isEnabled, toggleSwitch, datas } = useSidebar()
  const {t} = useTranslation()
  return (
    <ImageBackground
      source={rider}
      height={200}
      width={200}
      style={styles.image}>
      <View style={styles.flex}>
        <View style={[styles.topContainer, styles.opacity, { flex: 4 }]}>
          <Profile />
        </View>
        <View style={[styles.opacity, { flex: 4 }]}>
          <View style={styles.rowDisplay}>
            <TextDefault textColor={colors.white} H4 bolder>
              {t('status')}
            </TextDefault>
            <View style={styles.row}>
              <TextDefault
                H5
                bold
                textColor={colors.primary}
                style={styles.online}>
                {isEnabled ? t('available') : t('notAvailable')}
              </TextDefault>
              <Switch
                trackColor={{
                  false: colors.fontSecondColor,
                  true: colors.primary
                }}
                thumbColor={isEnabled ? colors.headerBackground : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{ marginTop: Platform.OS === 'android' ? -12 : -5 }}
              />
            </View>
          </View>
          {datas.map((data, ind) => (
            <View key={ind} style={styles.item}>
              <NavItem
                onPress={() =>
                  Linking.canOpenURL(data.navigateTo).then(() => {
                    Linking.openURL(data.navigateTo)
                  })
                }
                icon={data.icon}
                title={data.title}
              />
            </View>
          ))}
        </View>
        <View style={[styles.opacity, { flex: 2 }]}>
          <NavItem
            onPress={() => logout()}
            icon="sign-out"
            title={t('titleLogout')}
          />
        </View>
      </View>
    </ImageBackground>
  )
}
export default SidebBar
