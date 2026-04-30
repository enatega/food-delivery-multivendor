"use client";

import HomeLayout from "@/lib/ui/layouts/protected/home";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <HomeLayout>{children}</HomeLayout>;
}
