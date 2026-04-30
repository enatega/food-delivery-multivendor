import { useContext } from 'react';
import { ToastContext } from '@/lib/context/global/toast.context';

const useToast = () => {
  return useContext(ToastContext);
};

export default useToast;
