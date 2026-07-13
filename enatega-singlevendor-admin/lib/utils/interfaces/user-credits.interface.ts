export interface IUserResponseDropdown {
  _id: string;
  name?: string;
  email?: string;
}

export interface ICreditHistory {
  _id: string;
  userId: IUserResponseDropdown;
  amount: number;
  orderId: string;
  recordType: 'credit' | 'debit';
  createdAt: string;
  updatedAt: string;
}

export interface IGetAllCreditsRecordsData {
  getAllCreditsRecords: ICreditHistory[];
}

export interface IGetAllCreditsRecordsVars {
  searchTerm?: string;
}

export interface IGetAllUsersDropDownData {
  getAllUsersDropDownSearch: IUserResponseDropdown[];
}

export interface IGetAllUsersDropDownVars {
  searchTerm: string;
}

export interface IGiveUserCreditsVars {
  userId: string;
  amount: number;
  orderId?: string;
  recordType: string;
}

export interface IGiveUserCreditsData {
  giveUserCredits: ICreditHistory;
}

export interface IEditUserCreditsHistoryVars {
  id: string;
  amount: number;
}

export interface IEditUserCreditsHistoryData {
  editUserCreditsHistory: ICreditHistory;
}

export interface ICreditsFormProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  editData?: ICreditHistory | null;
}

export interface ICreditsFormValues {
  userId?: string;
  amount: number;
  orderId?: string;
}

export interface ICreditsMainProps {
  setEditData: (data: ICreditHistory | null) => void;
  setOpen: (open: boolean) => void;
  refetch: (refetchFn: () => void) => void;
}

export interface IUserCreditsScreenHeaderProps {
  handleButtonClick: () => void;
}

export interface IUserCreditsTableHeaderProps {
  globalFilterValue: string;
  onGlobalFilterChange: (e: { target: { value: string } }) => void;
  onClearSearch: () => void;
}
