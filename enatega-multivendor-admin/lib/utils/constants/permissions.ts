import { useConfiguration } from "@/lib/hooks/useConfiguration";

// Base permissions that are always available
const BASE_PERMISSIONS = [
  { label: 'Admin', code: 'Admin' },
  { label: 'Stores', code: 'Stores' },
  { label: 'Riders', code: 'Riders' },
  { label: 'Users', code: 'Users' },
  { label: 'Staff', code: 'Staff' },
  { label: 'Configuration', code: 'Configuration' },
  { label: 'Orders', code: 'Orders' },
  { label: 'Coupons', code: 'Coupons' },
  { label: 'Cuisine', code: 'Cuisine' },
  { label: 'Banners', code: 'Banners' },
  { label: 'Tipping', code: 'Tipping' },
  { label: 'Commission Rate', code: 'Commission Rate' },
  { label: 'Withdraw Request', code: 'Withdraw Request' },
  { label: 'Notification', code: 'Notification' },
  { label: 'Zone', code: 'Zone' },
  { label: 'Dispatch', code: 'Dispatch' },
];

// Hook to get permissions based on configuration
export const usePermissions = () => {
  const { IS_MULTIVENDOR } = useConfiguration();
  
  return [
    BASE_PERMISSIONS[0], // Admin
    ...(IS_MULTIVENDOR ? [{ label: 'Vendors', code: 'Vendors' }] : []),
    ...BASE_PERMISSIONS.slice(1), // Rest of permissions
  ];
};

// Function to get permissions with IS_MULTIVENDOR parameter
export const getPermissions = (isMultivendor: boolean) => {
  return [
    BASE_PERMISSIONS[0], // Admin
    ...(isMultivendor ? [{ label: 'Vendors', code: 'Vendors' }] : []),
    ...BASE_PERMISSIONS.slice(1), // Rest of permissions
  ];
};