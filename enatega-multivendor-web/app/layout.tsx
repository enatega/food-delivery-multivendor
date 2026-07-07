import { DirectionProvider } from "@/lib/context/direction/DirectionContext";
import { ThemeProvider } from "@/lib/providers/ThemeProvider";
import { DirectionHandler } from "@/lib/ui/layouts/global/rtl/DirectionHandler";
// import InstallPWA from "@/lib/ui/pwa/InstallPWA";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { headers } from "next/headers";
import Script from "next/script";

export const metadata = {
  title: "Enatega Multivendor",
  manifest: "/manifest.json",
};

const _SERVER_URL_SSR   = (process.env.NEXT_PUBLIC_SERVER_URL  || 'http://localhost:8001/').replace(/\/$/, '')
const _TENANT_DOMAIN_SSR = process.env.NEXT_PUBLIC_TENANT_DOMAIN || ''

/**
 * Resolve the tenant's business name from the Host header so we can replace
 * "Enatega" in every translation string before the page renders.
 * This is the SINGLE place where all platform branding text is swapped.
 * Non-tenant requests receive the original messages unchanged.
 */
async function resolveTenantAppName(host: string): Promise<string> {
  if (!host) return "Enatega";

  // Strip port from host for comparison
  const hostNoPort = host.split(":")[0];

  let slug: string | null = null;
  // Local dev: xpizza.localhost
  const localMatch = hostNoPort.match(/^([^.]+)\.localhost$/);
  if (localMatch) {
    slug = localMatch[1];
  } else if (_TENANT_DOMAIN_SSR && hostNoPort !== _TENANT_DOMAIN_SSR && hostNoPort.endsWith('.' + _TENANT_DOMAIN_SSR)) {
    // Production: xpizza.enatega-saas-demo.netlify.app
    slug = hostNoPort.slice(0, hostNoPort.length - _TENANT_DOMAIN_SSR.length - 1);
  }

  if (!slug) return "Enatega";
  try {
    const res = await fetch(
      `${_SERVER_URL_SSR}/api/tenants/by-slug/${slug}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      return (data.business_name as string) || "Enatega";
    }
  } catch {
    // API unreachable — fall back gracefully
  }
  return "Enatega";
}

/**
 * Recursively replace all occurrences of `search` inside string VALUES only.
 * Keys are intentionally left unchanged so t() lookups keep working.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepReplaceValues(obj: any, search: string, replacement: string): any {
  if (typeof obj === "string") {
    return obj.replace(new RegExp(search, "gi"), (match) => {
      // Preserve the case pattern of the matched word
      if (match === match.toUpperCase()) return replacement.toUpperCase();
      if (match[0] === match[0].toUpperCase()) {
        return replacement[0].toUpperCase() + replacement.slice(1).toLowerCase();
      }
      return replacement.toLowerCase();
    });
  }
  if (Array.isArray(obj)) return obj.map((v) => deepReplaceValues(v, search, replacement));
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      out[key] = deepReplaceValues(obj[key], search, replacement); // key stays the same
    }
    return out;
  }
  return obj;
}

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

  const messages = await getMessages({ locale });

  // Replace every "Enatega" occurrence in translation strings with the tenant's
  // business name. A simple JSON.stringify → regex replace → JSON.parse is safe
  // here because "Enatega" never appears as a JSON key — only inside string values.
  const headersList = headers();
  const host = headersList.get("host") || "";
  const appName = await resolveTenantAppName(host);
  const brandedMessages =
    appName !== "Enatega"
      ? (deepReplaceValues(messages, "Enatega", appName) as typeof messages)
      : messages;

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        {/* Inline theme script to prevent flash of wrong theme */}
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

        {/* Tenant branding — applies primary/secondary colors, title, and favicon */}
        <Script id="tenant-branding" strategy="afterInteractive">{`
          (function() {
            try {
              var serverUrl   = '${_SERVER_URL_SSR}';
              var tenantDomain = '${_TENANT_DOMAIN_SSR}';
              var host = window.location.hostname;

              var slug = null;
              var localMatch = host.match(/^([^.]+)\\.localhost$/);
              if (localMatch) {
                slug = localMatch[1];
              } else if (tenantDomain && host !== tenantDomain && host.endsWith('.' + tenantDomain)) {
                slug = host.slice(0, host.length - tenantDomain.length - 1);
              }
              if (!slug) return;

              fetch(serverUrl + '/api/tenants/by-slug/' + slug)
                .then(function(r){ return r.ok ? r.json() : null; })
                .then(function(d) {
                  if (!d) return;
                  var cfg = d.config || {};
                  var root = document.documentElement;
                  if (cfg.primaryColor) {
                    root.style.setProperty('--primary-color', cfg.primaryColor);
                    root.style.setProperty('--primary-dark',  cfg.primaryColor);
                    root.style.setProperty('--primary-light', cfg.primaryColor + '22');
                  }
                  if (cfg.secondaryColor) {
                    root.style.setProperty('--secondary-color', cfg.secondaryColor);
                  }
                  if (d.business_name) {
                    document.title = d.business_name;
                  }
                  if (cfg.logoUrl) {
                    var lnk = document.getElementById('tenant-favicon');
                    if (!lnk) { lnk = document.createElement('link'); lnk.id = 'tenant-favicon'; lnk.rel = 'icon'; document.head.appendChild(lnk); }
                    lnk.href = cfg.logoUrl;
                  }
                  window.__TENANT_BRANDING__ = d;
                  window.dispatchEvent(new Event('tenant-branding-ready'));
                })
                .catch(function(){});
            } catch(e) {}
          })();
        `}</Script>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#94e469" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Apple splash screen for specific device */}
        <link
          rel="apple-touch-startup-image"
          href="/splash-screen.png"
          media="(device-width: 390px) and (device-height: 844px)
          and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
      </head>
      <body className={`flex flex-col flex-wrap${dir === "rtl" ? " rtl" : ""}`}>
        <ThemeProvider>
          <NextIntlClientProvider messages={brandedMessages}>
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
