import * as Localization from 'expo-localization'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import i18n from 'i18n-js'
import { en } from './translations/en'
import { fr } from './translations/fr'
import { km } from './translations/km'
import { zh } from './translations/zh'
import { de } from './translations/de'
import { ar } from './translations/ar'
import {hi} from './translations/hi'
import {es} from './translations/es'
import {bn} from './translations/bn'
import {pt} from './translations/pt'
import {ru} from './translations/ru'
import {ur} from './translations/ur'
import {id} from './translations/id'
import {jp} from './translations/jp'
import {tr} from './translations/tr'
import {mr} from './translations/mr'
import {te} from './translations/te'
import {vi} from './translations/vi'
import {ko} from './translations/ko'
import {it} from './translations/it'
import {th} from './translations/th'
import {gu} from './translations/gu'
import {fa} from './translations/fa'
import {pl} from './translations/pl'
import {ps} from './translations/ps'
import {ro} from './translations/ro'
import {ku} from './translations/ku'
import {uz} from './translations/uz'
import {az} from './translations/az'
import {nl} from './translations/nl'



i18n.initAsync = async () => {
  i18n.fallbacks = true
  i18n.translations = { fr, en, km, zh, de, ar,hi,es,bn,pt,ru,ur,id,jp,tr,mr,te,vi,ko,it,th,gu,fa,pl,ps,ro,ku,uz,az,nl }
  // i18n.locale = 'km'
  if (Platform.OS === 'android') {
    const lang = await AsyncStorage.getItem('yalla-language')
    i18n.locale = lang || 'ar'
  } else {
    i18n.locale = Localization.locale
  }
}

export default i18n
