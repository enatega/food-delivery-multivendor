import { useContext } from 'react'
import useOrders from './useOrders'
import { printAsync, selectPrinterAsync } from '../../utilities'
import { Configuration, Restaurant } from '../context'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function usePrintOrder() {
  const { currencySymbol } = useContext(Configuration.Context)
  const { printer, setPrinter } = useContext(Restaurant.Context)
  const { loading, error, data } = useOrders()

  const printOrder = async id => {
    if (!loading && !error) {
      const order = data.restaurantOrders.find(order => order._id === id)
      const result = await printAsync(
        { ...order, currencySymbol },
        Platform.OS === 'ios' ? (printer ? printer.url : null) : null
      )
      console.log('result', result)
    }
  }
  const selectPrinter = async () => {
    const result = await selectPrinterAsync()
    if (result) {
      setPrinter(result)
      await AsyncStorage.setItem('printer', JSON.stringify(result))
    }
    console.log('result', result)
  }
  return { printOrder, printer, selectPrinter }
}
