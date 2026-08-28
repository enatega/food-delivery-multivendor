import { DirectionProvider } from "@/lib/context/direction/DirectionContext";
import { ThemeProvider } from "@/lib/providers/ThemeProvider";
import { DirectionHandler } from "@/lib/ui/layouts/global/rtl/DirectionHandler";
// import InstallPWA from "@/lib/ui/pwa/InstallPWA";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import Script from "next/script";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/cormorant-garamond/500-italic.css";

const interfaceFont = Inter({
  subsets: ["latin"],
  variable: "--font-interface",
  display: "swap",
});

export const metadata = {
  title: "Enatega Multivendor",
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const rtlLocales = ["ar", "hr", "fa", "ur"];
  const baseLocale = locale.split("-")[0];
  const dir =
    rtlLocales.includes(locale) || rtlLocales.includes(baseLocale)
      ? "rtl"
      : "ltr";
  //Providing all messages to the client
  //side is the easiest way to get started

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        {/* 🔥 Inline theme script to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem("theme");
                if (theme === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              })();
            `,
          }}
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"
          strategy="beforeInteractive"
        />

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "tjqw9wn955");
          `}
        </Script>

        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#75D04B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Apple splash screen for specific device */}
        <link
          rel="apple-touch-startup-image"
          href="/splash-screen.png"
          media="(device-width: 390px) and (device-height: 844px)
          and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        {/* Add more media queries for other device sizes if needed */}
      </head>
      <body
        className={`${interfaceFont.variable} ${dir === "rtl" ? "rtl" : ""}`}
        suppressHydrationWarning
      >
        <template
          data-impeccable-contract="c6a71e2f"
          dangerouslySetInnerHTML={{
            __html:
              "<!-- THESIS: Quiet Orbit presents Enatega as one elegant everyday-delivery system without duplicating discovery content. OWN-WORLD: #75D04B route geometry crosses warm ivory, pale sage, and charcoal fields with precise oversized type, editorial italic accents, hairline rules, isolated product still lifes, and restrained 12–16px corners. STORY: select a city, understand the food-grocery-essentials orbit, follow the Choose-Moving-Arrived route, then branch toward business or rider partnership. FIRST VIEWPORT: a concise city gateway at left and a calm three-product orbit at right, joined by one animated route and one decisive action. FORM: Quiet Orbit, implemented from the user-approved hero and scroll-story frames; seed c6a71e2f. FINISH: the independent finish review, visual evidence, detector pass, design documentation, and raster provenance are part of the shipping contract -->",
          }}
        />

        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <DirectionProvider dir={dir}>
              <DirectionHandler />
              {children}
              {/* <InstallPWA/> */}
            </DirectionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
