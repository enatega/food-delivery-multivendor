import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { formatDateTime } from '../../../utils/formatDateTime'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

const TicketCard = ({ item }) => {
  const { i18n, t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const navigation = useNavigation()

  const getStatusColor = () => {
    if (item?.status === 'open') {
      return currentTheme?.primaryBlue
    } else if (item?.status === 'inProgress') {
      return currentTheme?.primary
    } else {
      return currentTheme?.red600
    }
  }

  const getStatusText = () => {
    if (item?.status === 'open') {
      return 'Open'
    } else if (item?.status === 'inProgress') {
      return 'In progress'
    } else {
      return 'Closed'
    }
  }

  return (
    <Pressable style={styles(currentTheme).card} disabled={item?.status === 'closed'} onPress={() => navigation?.navigate('HelpConversation')}>
      <View style={styles(currentTheme).contentContainer}>
        <View style={styles(currentTheme).flex}>
          <View style={styles().flex2}>
            <Ionicons name='ticket-outline' size={24} color={currentTheme?.iconColor} />
            <TextDefault H4 bolder numberOfLines={1}>
              {item?.title}
            </TextDefault>
          </View>
          <View style={{ backgroundColor: getStatusColor(), paddingVertical: scale(4), paddingHorizontal: scale(6), borderRadius: 4 }}>
            <TextDefault textColor='white' bolder>
              {getStatusText()}
            </TextDefault>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            gap: scale(2)
          }}
        >
          <TextDefault bold>
            {t('Last updated at')} {formatDateTime(item?.updatedAt)}
          </TextDefault>
          <TextDefault bold>
            {t('Created at')} {formatDateTime(item?.createdAt)}
          </TextDefault>
        </View>

        {item?.status !== 'closed' && (
          <View style={{ alignItems: 'center', paddingVertical: scale(4) }}>
            <TextDefault H5 bolder textColor={currentTheme?.primaryBlue}>
              {t('Continue Conversation')}
            </TextDefault>
          </View>
        )}
      </View>
    </Pressable>
  )
}

export default TicketCard

const styles = (currentTheme) =>
  StyleSheet.create({
    flex: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    flex2: {
      display: 'flex',
      flexDirection: 'row',
      gap: scale(8),
      justifyContent: 'center',
      alignItems: 'center'
    },
    card: {
      backgroundColor: currentTheme?.cardBackground ?? '#fff',
      borderRadius: 12,
      position: 'relative',
      shadowColor: currentTheme?.shadowColor,
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginBottom: scale(18)
    },
    contentContainer: {
      padding: 12,
      gap: scale(8)
    }
  })
