import { View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { useTranslation } from 'react-i18next'

const OtpErrorDialogue = ({ otpError, currentTheme }) => {
  const { t } = useTranslation()
  return (
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 }}>
      <Feather name='alert-triangle' size={16} color={currentTheme.red600} />
      <TextDefault textColor={currentTheme.red600} bold H5>
        {t(otpError)}
      </TextDefault>
    </View>
  )
}

export default OtpErrorDialogue
