"use client";

import AuthGuard from "@/lib/hoc/auth.guard";

// Layout
import ProfileLayoutScreen from "@/lib/ui/layouts/protected/profile";

// Created once at module scope. Wrapping inside the layout's render produced a
// new component type on every render, which unmounted the whole profile tree
// (blank screen + refetching every query) on each re-render and tab switch.
const ProtectedLayout = AuthGuard(
  ({ children }: { children: React.ReactNode }) => {
    return <ProfileLayoutScreen>{children}</ProfileLayoutScreen>;
  },
);

export default function ProfileRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
