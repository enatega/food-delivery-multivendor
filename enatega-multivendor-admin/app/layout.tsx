import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';

export const metadata = {
  title: 'Admin Panel',
  icons: { icon: '/favsicons.png' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
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
      <head>
        {/* Tenant branding — runs on subdomains like myco.localhost:3000 */}
        <Script id="tenant-branding" strategy="afterInteractive">{`
          (function() {
            try {
              var host = window.location.hostname;
              var isSubdomain = host !== 'localhost' && host.split('.').length > 1 && host.endsWith('localhost');
              if (!isSubdomain) return;
              var slug = host.replace(/\\.localhost$/, '');
              var apiBase = window.location.protocol + '//localhost:' + (window.location.port || '8001').replace('3000','8001') + '/api';
              // Always hit port 8001 for the API
              apiBase = 'http://localhost:8001/api';
              fetch(apiBase + '/tenants/by-slug/' + slug)
                .then(function(r){ return r.ok ? r.json() : null; })
                .then(function(d) {
                  if (!d || !d.business_name) return;
                  window.__TENANT_BRANDING__ = d;
                  localStorage.setItem('__tenant_branding__', JSON.stringify(d));
                  document.title = d.business_name + ' — Admin';
                  // Apply tenant theme colors to CSS variables used throughout the admin panel
                  if (d.config && d.config.primaryColor) {
                    var pc = d.config.primaryColor;
                    var sc = d.config.secondaryColor || pc;
                    document.documentElement.style.setProperty('--primary-color', pc);
                    document.documentElement.style.setProperty('--secondary-color', sc);
                    try {
                      var rr = parseInt(pc.slice(1,3),16), gg = parseInt(pc.slice(3,5),16), bb = parseInt(pc.slice(5,7),16);
                      var dk = '#'+[rr,gg,bb].map(function(c){return Math.max(0,Math.floor(c*0.85)).toString(16).padStart(2,'0');}).join('');
                      document.documentElement.style.setProperty('--primary-dark', dk);
                    } catch(_e) {}
                  }
                  // Update favicon — never remove React-managed link elements (causes removeChild null error).
                  // Instead, upsert a tenant-owned element by ID so React's reconciler is never affected.
                  if (d.logo_url) {
                    function setFavicon(href, type) {
                      var lnk = document.getElementById('tenant-favicon');
                      if (!lnk) {
                        lnk = document.createElement('link');
                        lnk.id = 'tenant-favicon';
                        lnk.rel = 'icon';
                        document.head.appendChild(lnk);
                      }
                      if (type) lnk.type = type;
                      lnk.href = href;
                    }
                    if (d.logo_url.indexOf('svg') !== -1) {
                      try {
                        var fimg = new Image();
                        fimg.onload = function() {
                          try {
                            var c = document.createElement('canvas'); c.width = 32; c.height = 32;
                            c.getContext('2d').drawImage(fimg, 0, 0, 32, 32);
                            setFavicon(c.toDataURL('image/png'), 'image/png');
                          } catch(ce) { setFavicon(d.logo_url, 'image/svg+xml'); }
                        };
                        fimg.onerror = function() { setFavicon(d.logo_url, 'image/svg+xml'); };
                        fimg.src = d.logo_url;
                      } catch(fe) { setFavicon(d.logo_url, 'image/svg+xml'); }
                    } else {
                      setFavicon(d.logo_url, 'image/png');
                    }
                  }
                  window.dispatchEvent(new Event('tenant-branding-ready'));
                })
                .catch(function(){});
            } catch(e) {}
          })();
        `}</Script>
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "tjqxrz689j");
          `}
        </Script>
      </head>
      <body className={'flex flex-col flex-wrap'}>
        <ThemeProvider attribute={'class'}>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
