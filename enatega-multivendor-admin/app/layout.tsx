import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

// ✅ Add metadata export for favicon
export const metadata = {
  title: "Enatega Admin Dashboard",
  icons: {
    icon: "/favicon.png",
    // You can add more like:
    // shortcut: "/favicon.png",
    // apple: "/apple-touch-icon.png"
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
