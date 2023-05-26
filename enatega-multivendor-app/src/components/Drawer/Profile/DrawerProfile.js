import React, { useContext } from 'react'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import UserContext from '../../../context/User'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'

function DrawerProfile(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { isLoggedIn, loadingProfile, profile } = useContext(UserContext)

  if (loadingProfile) return <TextDefault>Loading...</TextDefault>
  return (
    <View style={styles(currentTheme).mainContainer}>
      {!isLoggedIn && (
        <View style={styles().logInContainer}>
          <TouchableOpacity
            style={{ ...alignment.PTxSmall, ...alignment.PBxSmall }}
            onPress={() => {
              props.navigation.navigate({ name: 'CreateAccount' })
            }}>
            <TextDefault textColor={currentTheme.fontWhite} bold H5>
              Login/Create Account
            </TextDefault>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles().loggedInContainer}>
        {isLoggedIn && profile && (
          <View style={styles().subContainer}>
            <View style={styles(currentTheme).imgContainer}>
              <TextDefault textColor={currentTheme.tagColor} bold H1>
                {profile.name.substr(0, 1).toUpperCase()}
              </TextDefault>
            </View>
            <TextDefault textColor={currentTheme.fontWhite} bold H5>
              {profile.name}
            </TextDefault>
          </View>
        )}
      </View>
    </View>
  )
}

export default DrawerProfile
