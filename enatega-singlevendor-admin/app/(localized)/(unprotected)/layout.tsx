// Layout
import UnprotectedMainLayout from '@/lib/ui/layouts/unprotected/main/';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UnprotectedMainLayout>{children}</UnprotectedMainLayout>;
}
