import { View } from 'react-native'
import TextDefault from '../../../../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../../../../utils/alignment'
import { useTranslation } from 'react-i18next'

const AuthImageWithDescription = ({ title, description, image, currentTheme }) => {
  const { t } = useTranslation()
  return (
    <>
      <View>{image}</View>
      <View>
        <TextDefault
          H2
          bolder
          textColor={currentTheme.newFontcolor}
          style={{
            ...alignment.MTlarge,
            ...alignment.MBmedium
          }}
          isRTL
        >
          {t(title)}
        </TextDefault>

        <TextDefault H5 bold textColor={currentTheme.horizontalLine} style={{ ...alignment.MBmedium }} isRTL>
          {t(description)}
        </TextDefault>
      </View>
    </>
  )
}

export default AuthImageWithDescription
