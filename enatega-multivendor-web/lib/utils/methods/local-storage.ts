import { modeStorage } from "@/lib/mode/storage";

const saveToLocalStorage = (key: string, data: string) => {
    try {
      modeStorage.set(key, data);
      return key;
    } catch (err) {
      return '';
    }
  };
  
  const getFromLocalStorage = (key: string) => {
    try {
      return modeStorage.get(key);
    } catch (err) {
      return '';
    }
  };
  
  const deleteFromLocalStorage = (key: string) => {
    try {
      modeStorage.remove(key);
      return key;
    } catch (err) {
      return '';
    }
  };
  
  export const onUseLocalStorage = (
    type: 'save' | 'get' | 'delete',
    key: string,
    data: string = ''
  ): string | null => {
    switch (type) {
      case 'get':
        return getFromLocalStorage(key);
      case 'save':
        return saveToLocalStorage(key, data);
  
      case 'delete':
        return deleteFromLocalStorage(key);
  
      default:
        return '';
    }
  };
