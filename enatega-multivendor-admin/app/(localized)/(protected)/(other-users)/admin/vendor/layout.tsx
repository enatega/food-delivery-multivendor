'use client';

// HOC
import VENDOR_GUARD from '@/lib/hoc/VENDOR_GUARD';
// CONTEXT
import { VendorLayoutProvider } from '@/lib/context/vendor/layout-vendor.context';
import VendorLayout from '@/lib/ui/layouts/protected/vendor';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ProtectedLayout = VENDOR_GUARD(
    ({ children }: { children: React.ReactNode }) => {
      return <VendorLayout>{children}</VendorLayout>;
    }
  );

  return (
    <VendorLayoutProvider>
      {/* VendorLayoutProvider for context */}
      <ProtectedLayout>{children}</ProtectedLayout> {/* UI Layout for Vendor */}
    </VendorLayoutProvider>
  );
}
