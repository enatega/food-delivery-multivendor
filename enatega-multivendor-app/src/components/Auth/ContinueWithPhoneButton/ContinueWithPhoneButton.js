import { TouchableOpacity } from 'react-native'
import Spinner from '../../Spinner/Spinner'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'
import { theme } from '../../../utils/themeColors'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

const ContinueWithPhoneButton = ({ title, onPress, isLoading, isDisabled, containerStyles }) => {
  const { t } = useTranslation()

  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[
        styles(currentTheme).viaPhoneButton,
        {
          backgroundColor: isDisabled ? currentTheme.colorBgTertiary : currentTheme.singlevendorcolor
        },
        containerStyles && containerStyles
      ]}
      onPress={() => onPress()}
      disabled={isDisabled ? isDisabled : false}
    >
      {isLoading ? (
        <Spinner spinnerColor={currentTheme?.singlevendorcolor} backColor={currentTheme.backgroundColor} />
      ) : (
        <TextDefault H4 textColor={currentTheme.gray100} center bold style={{ color: isDisabled ? currentTheme.horizontalLine : currentTheme.white }}>
          {t(title)}
        </TextDefault>
      )}
    </TouchableOpacity>
  )
}
export default ContinueWithPhoneButton
