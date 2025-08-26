const saveToLocalStorage = (key: string, data: string) => {
    try {
      localStorage.setItem(key, data);
      return key;
    } catch (err) {
      return '';
    }
  };
  
  const getFromLocalStorage = (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      return '';
    }
  };
  
  const deleteFromLocalStorage = (key: string) => {
    try {
      localStorage.removeItem(key);
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