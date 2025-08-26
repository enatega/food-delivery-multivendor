"use client";

// Layout
import GlobalLayout from "@/lib/ui/layouts/protected/global";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <GlobalLayout>{children}</GlobalLayout>;
}
