import React, { useContext } from 'react'
import { TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import styles from './styles'
import { scale } from '../../../utils/scaling'
import Spinner from '../../../components/Spinner/Spinner'
import { theme } from '../../../utils/themeColors'
import ThemeContext from '../../ThemeContext/ThemeContext'
import { alignment } from '../../../utils/alignment'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import {useTranslation} from 'react-i18next'

const FdEmailBtn = props => {
  const {t} = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles().mainContainer}
      onPress={props.onPress}>
      {props.loadingIcon ? (
        <Spinner backColor="rgba(0,0,0,0.1)" spinnerColor={'#FFF'} />
      ) : (
        <>
          <MaterialIcons
            style={styles().marginLeft5}
            name="mail-outline"
            size={scale(18)}
            color={currentTheme.white}
          />
          <TextDefault
            H4
            textColor={currentTheme.buttonTextPink}
            style={alignment.MLsmall}
            bold>
            {t('ContinueWithEmail')}
          </TextDefault>
        </>
      )}
    </TouchableOpacity>
  )
}

export default FdEmailBtn
