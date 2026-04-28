import { Dispatch, SetStateAction } from 'react'
import { TRiderProfileBottomBarBit } from '../types/rider'

export interface IRiderProfileMainProps {
  isFormOpened: TRiderProfileBottomBarBit
  setIsFormOpened: Dispatch<SetStateAction<TRiderProfileBottomBarBit>>
}
