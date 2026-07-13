import { useEffect, useMemo } from 'react';
import { useLazyQueryQL } from './useLazyQueryQL';
import { GET_SHOP_TYPES } from '../api/graphql';
import {
  IGetShopTypesData,
  ILazyQueryResult,
  IUserShopTypeHookProps,
  IUseShopTypesHookResponse,
} from '../utils/interfaces';

export const useShopTypes = (
  props: IUserShopTypeHookProps = {
    invoke_now: false,
    transform_to_dropdown_list: false,
  }
): IUseShopTypesHookResponse => {
  // Props
  const { invoke_now, transform_to_dropdown_list } = props;
  
  const { data, loading, fetch } = useLazyQueryQL(GET_SHOP_TYPES, {
    fetchPolicy: 'network-only',
    debounceMs: 5000,
  }) as ILazyQueryResult<IGetShopTypesData | undefined, undefined>;

  // Handler
  const fetchShopTypes = () => {
    fetch();
  };

  const dropdownList = useMemo(() => {
    if (transform_to_dropdown_list) {
      return data?.fetchShopTypes?.data?.map((st) => ({
        label: st.name,
        code: st._id,
      }));
    }
    return [];
  }, [data?.fetchShopTypes]);

  // Use Effect
  useEffect(() => {
    if (invoke_now) {
      fetchShopTypes();
    }
  }, []);

  return {
    data,
    fetchShopTypes,
    loading,
    dropdownList,
  };
};
