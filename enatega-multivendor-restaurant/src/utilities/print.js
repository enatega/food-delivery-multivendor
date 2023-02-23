import * as Print from 'expo-print'
import { formatReceipt } from './formatReceipt'
export const printAsync = async (order, printerUrl) => {
  try {
    return await Print.printAsync({
      width: 576, // 80mm=302px,
      orientation: Print.Orientation.portrait,
      html: formatReceipt(order),
      printerUrl
    })
  } catch (error) {
    console.log('error', error)
  }
  return null
}
export const printToFileAsync = async order => {
  try {
    return await Print.printToFileAsync({
      width: 576, // 80mm=302px,
      html: formatReceipt(order)
    })
  } catch (error) {
    console.log('error', error)
  }
  return null
}
export const selectPrinterAsync = async () => {
  try {
    const { name, url } = await Print.selectPrinterAsync()
    return { name, url }
  } catch (error) {
    console.log('error', error)
  }
  return null
}
