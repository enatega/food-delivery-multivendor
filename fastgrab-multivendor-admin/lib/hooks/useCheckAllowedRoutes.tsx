import { useUserContext } from './useUser';

const useCheckAllowedRoutes = <T extends { text: string }>(arr: T[]): T[] => {
  const { user } = useUserContext();

  if (!user || user.userType === 'ADMIN') return arr;

  return arr.filter((v) => user?.permissions?.includes(v.text));
};

export default useCheckAllowedRoutes;
