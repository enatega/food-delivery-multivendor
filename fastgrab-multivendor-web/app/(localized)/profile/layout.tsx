"use client";

import AuthGuard from "@/lib/hoc/auth.guard";

// Layout
import ProfileLayoutScreen from "@/lib/ui/layouts/protected/profile";

export default function ProfileRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ProtectedLayout = AuthGuard(
    ({ children }: { children: React.ReactNode }) => {
      return <ProfileLayoutScreen>{children}</ProfileLayoutScreen>;
    }
  );

  return <ProtectedLayout>{children}</ProtectedLayout>;
}
