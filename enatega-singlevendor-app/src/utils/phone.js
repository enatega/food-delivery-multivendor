import {
  PhoneNumberUtil,
  PhoneNumberFormat,
  PhoneNumberType,
  AsYouTypeFormatter
} from 'google-libphonenumber'

const phoneUtil = PhoneNumberUtil.getInstance()

// Keep only the digits a user actually typed for the national number.
export const getNationalDigits = (input = '') => (input || '').replace(/\D/g, '')

// Format national digits as-you-type for a region, e.g. 'PK' -> "0301 2345678".
// Returns the raw digits unchanged if the region is unknown/formatting fails.
export function formatPhoneNumber(input, region) {
  const digits = getNationalDigits(input)
  if (!digits || !region) return digits
  try {
    const formatter = new AsYouTypeFormatter(region)
    let formatted = ''
    for (const d of digits) formatted = formatter.inputDigit(d)
    return formatted
  } catch {
    return digits
  }
}

// True only when the digits are a valid number for that specific region
// (a Pakistani-format number is rejected when 'US' is selected, and vice-versa).
export function isValidPhoneNumber(input, region) {
  const digits = getNationalDigits(input)
  if (!digits || !region) return false
  try {
    return phoneUtil.isValidNumberForRegion(phoneUtil.parse(digits, region), region)
  } catch {
    return false
  }
}

// Convert national digits + region to E.164 (e.g. 'PK' + '03012345678' -> '+923012345678').
// Handles trunk/leading zeros correctly, unlike a naive '+' + callingCode + digits concat.
export function toE164(input, region) {
  const digits = getNationalDigits(input)
  if (!digits || !region) return digits
  try {
    return phoneUtil.format(phoneUtil.parse(digits, region), PhoneNumberFormat.E164)
  } catch {
    return digits
  }
}

// An example national number for the region, used in friendly error messages.
export function getPhoneExample(region) {
  if (!region) return ''
  try {
    const example =
      phoneUtil.getExampleNumberForType(region, PhoneNumberType.MOBILE) ||
      phoneUtil.getExampleNumber(region)
    return phoneUtil.format(example, PhoneNumberFormat.NATIONAL)
  } catch {
    return ''
  }
}

// Maximum count of national digits for the selected region's example mobile
// number. Used to stop extra digit entry before validation fails later.
export function getPhoneMaxLength(region) {
  const example = getPhoneExample(region)
  const digits = getNationalDigits(example)
  return digits.length > 0 ? digits.length : 20
}

// ponytail: self-check
export function _demo() {
  const ok = isValidPhoneNumber('03012345678', 'PK') === true
  const rejectsWrongRegion = isValidPhoneNumber('03012345678', 'US') === false
  const formats = formatPhoneNumber('03012345678', 'PK').includes(' ')
  if (!ok || !rejectsWrongRegion || !formats) throw new Error('phone helper self-check failed')
  return true
}
