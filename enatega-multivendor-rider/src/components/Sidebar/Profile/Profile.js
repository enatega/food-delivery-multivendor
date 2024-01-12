import React from 'react'
import { View } from 'react-native'
import { useQuery, gql } from '@apollo/client'
import styles from './styles'
import { profile } from '../../../apollo/queries'
import TextDefault from '../../Text/TextDefault/TextDefault'
import CustomColors from '../../../utilities/colors'
import Spinner from '../../Spinner/Spinner'
import TextError from '../../Text/TextError/TextError'
import { useTranslation } from 'react-i18next'

const PROFILE = gql`
  ${profile}
`

function Profile() {
  const { colors } = CustomColors()
  const { t } = useTranslation()
  const { data, loading, error } = useQuery(PROFILE)

  if (loading && !data) return <Spinner />
  if (error) return <TextError text={t('errorText')} />
  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).img}>
        <TextDefault textColor={colors.black} bold H2 center>
          {data.rider.name}
        </TextDefault>
      </View>
      <TextDefault center H3 textColor={colors.white}>
        {t('welcomeText')}
      </TextDefault>
    </View>
  )
}

export default Profile
