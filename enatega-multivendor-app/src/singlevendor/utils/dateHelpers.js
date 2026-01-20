import { formatDateTime } from '../../utils/formatDateTime'

/**
 * Formats a timestamp for notification display
 * Returns format: "Jan 14, 17:11" (Month Day, HH:MM)
 * 
 * @param {string|number} timestamp - The timestamp to format
 * @returns {string} Formatted date string or empty string if invalid
 */
export const formatNotificationDate = (timestamp) => {
  if (!timestamp) return ''
  try {
    // Try using formatDateTime utility first
    const formatted = formatDateTime(timestamp, true) // noyear = true
    
    // Check if formatDateTime produced a valid result
    if (formatted && formatted !== 'Invalid Date') {
      // formatDateTime uses locale formatting which may vary
      // For consistent format matching "Jan 14, 17:11", use custom formatting
      const date = new Date(Number(timestamp))
      if (!Number.isNaN(date.getTime())) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const day = date.getDate()
        const month = months[date.getMonth()]
        const hours = date.getHours()
        const minutes = date.getMinutes()
        
        const formattedDay = day < 10 ? `0${day}` : day
        const formattedHours = hours < 10 ? `0${hours}` : hours
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
        
        return `${month} ${formattedDay}, ${formattedHours}:${formattedMinutes}`
      }
    }
    
    // Fallback to formatDateTime result if custom format fails
    return formatted || ''
  } catch (error) {
    // Final fallback to empty string
    return ''
  }
}
