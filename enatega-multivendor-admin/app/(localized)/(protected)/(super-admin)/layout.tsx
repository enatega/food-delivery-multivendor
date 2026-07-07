'use client';
import SUPER_ADMIN_GUARD from '@/lib/hoc/SUPER_ADMIN_GUARD';
// Layout
import SuperAdminLayout from '@/lib/ui/layouts/protected/super-admin';

// Defined at module scope so the component reference is stable across
// re-renders. Creating it inside the render function produces a new type
// on every render, causing React to unmount+remount the entire subtree.
function SuperAdminContent({ children }: { children: React.ReactNode }) {
  return <SuperAdminLayout>{children}</SuperAdminLayout>;
}
const ProtectedLayout = SUPER_ADMIN_GUARD(SuperAdminContent);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
