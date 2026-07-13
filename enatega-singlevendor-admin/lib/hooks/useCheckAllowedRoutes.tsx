import { useUserContext } from './useUser';

const useCheckAllowedRoutes = <T extends { text: string; isAllowed?: boolean }>(
  arr: T[]
): T[] => {
  const { user } = useUserContext();

  const _arr = arr.filter((v) => {
    if ('isAllowed' in v) {
      return v.isAllowed;
    }
    return true;
  });

  if (!user || user.userType === 'ADMIN') return _arr;

  return _arr.filter((v) => user?.permissions?.includes(v.text));
};

export default useCheckAllowedRoutes;
