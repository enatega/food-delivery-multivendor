import React from 'react'
import { View, StyleSheet, Linking, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'

const LegalContent = ({ type, url, currentTheme }) => {
  const { t } = useTranslation()

  const handleOpenUrl = () => {
    if (url) {
      Linking.openURL(url)
    }
  }

  const getLastUpdatedText = () => {
    return t('lastUpdated2MonthsAgo')
  }

  const getSections = () => {
    if (type === 'privacy') {
      return [
        {
          title: t('informationWeCollect'),
          content: t('privacyInfoCollectContent')
        },
        {
          title: t('howWeUseYourInformation'),
          content: t('privacyHowWeUseContent')
        },
        {
          title: t('howWeShareYourInformation'),
          content: t('privacyHowWeShareContent')
        },
        {
          title: t('dataSecurity'),
          content: t('privacyDataSecurityContent')
        },
        {
          title: t('yourRights'),
          content: t('privacyYourRightsContent')
        },
        {
          title: t('changesToThisPrivacyPolicy'),
          content: t('privacyChangesContent')
        },
        {
          title: t('contactUs'),
          content: t('privacyContactContent')
        }
      ]
    }

    return [
      {
        title: t('useOfService'),
        content: t('termsUseOfServiceContent')
      },
      {
        title: t('userContent'),
        content: t('termsUserContentContent')
      },
      {
        title: t('serviceAvailabilityAndUpdates'),
        content: t('termsServiceAvailabilityContent')
      },
      {
        title: t('limitationOfLiability'),
        content: t('termsLimitationContent')
      },
      {
        title: t('governingLaw'),
        content: t('termsGoverningLawContent')
      },
      {
        title: t('contactUs'),
        content: t('termsContactContent')
      }
    ]
  }

  const sections = getSections()

  return (
    <View style={styles(currentTheme).container}>
      <TextDefault
        textColor={currentTheme.colorTextMuted}
        style={styles(currentTheme).lastUpdated}
      >
        {getLastUpdatedText()}
      </TextDefault>

      <TextDefault
        textColor={currentTheme.colorTextMuted}
        style={styles(currentTheme).introText}
      >
        {type === 'privacy' ? t('privacyIntroText') : t('termsIntroText')}
      </TextDefault>

      {sections.map((section, index) => (
        <View key={index} style={styles(currentTheme).section}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            style={styles(currentTheme).sectionTitle}
            bolder
          >
            {section.title}
          </TextDefault>
          <TextDefault
            textColor={currentTheme.colorTextMuted}
            style={styles(currentTheme).sectionContent}
          >
            {section.content}
          </TextDefault>
        </View>
      ))}

      {url && (
        <TouchableOpacity onPress={handleOpenUrl} style={styles(currentTheme).linkButton}>
          <TextDefault
            textColor={currentTheme.singlevendorcolor || '#0090CD'}
            style={styles(currentTheme).linkText}
          >
            {t('viewFullDocument')}
          </TextDefault>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1
    },
    lastUpdated: {
      fontSize: scale(12),
      marginBottom: verticalScale(16)
    },
    introText: {
      fontSize: scale(14),
      lineHeight: scale(22),
      marginBottom: verticalScale(24)
    },
    section: {
      marginBottom: verticalScale(20)
    },
    sectionTitle: {
      fontSize: scale(16),
      marginBottom: verticalScale(8)
    },
    sectionContent: {
      fontSize: scale(14),
      lineHeight: scale(22)
    },
    linkButton: {
      marginTop: verticalScale(16),
      paddingVertical: verticalScale(12)
    },
    linkText: {
      fontSize: scale(14),
      textDecorationLine: 'underline'
    }
  })

export default LegalContent
