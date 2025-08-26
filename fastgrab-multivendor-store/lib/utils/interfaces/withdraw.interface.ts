import { Dispatch, SetStateAction } from "react";

export interface IWithdrawModalProps {
  isBottomModalOpen?: boolean;
  setIsBottomModalOpen: Dispatch<SetStateAction<boolean>>;
  currentTotal: number;
  handleFormSubmission: (val: number) => Promise<void>;
  amountErrMsg?: string;
  setAmountErrMsg: Dispatch<SetStateAction<string>>;
  withdrawRequestLoading?: boolean;
}

export interface IWalletSuccessModalProps {
  message: string;
}
