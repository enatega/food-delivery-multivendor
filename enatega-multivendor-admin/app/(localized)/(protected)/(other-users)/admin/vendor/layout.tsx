'use client';

// HOC
import VENDOR_GUARD from '@/lib/hoc/VENDOR_GUARD';
// CONTEXT
import { VendorLayoutProvider } from '@/lib/context/vendor/layout-vendor.context';
import VendorLayout from '@/lib/ui/layouts/protected/vendor';

function VendorContent({ children }: { children: React.ReactNode }) {
  return <VendorLayout>{children}</VendorLayout>;
}
const ProtectedLayout = VENDOR_GUARD(VendorContent);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <VendorLayoutProvider>
      <ProtectedLayout>{children}</ProtectedLayout>
    </VendorLayoutProvider>
  );
}
