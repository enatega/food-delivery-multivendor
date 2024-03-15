import React from 'react'
import { TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import styles from './styles'
import { scale } from '../../../utils/scaling'
import Spinner from '../../../components/Spinner/Spinner'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import { useTranslation } from 'react-i18next'
const FdGoogleBtn = props => {
  const { t } = useTranslation()
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.mainContainer}
      onPressIn={props.onPressIn}
      onPress={props.onPress}>
      {props.loadingIcon ? (
        <Spinner backColor="#fff" spinnerColor={'#90E36D'} />
      ) : (
        <>
          <FontAwesome name="google" size={scale(18)} color="#000" />
          <TextDefault H4 textColor="#000" style={alignment.MLlarge} bold>
            {t('ContinueWithGoogle')}
          </TextDefault>
        </>
      )}
    </TouchableOpacity>
  )
}

export default FdGoogleBtn
