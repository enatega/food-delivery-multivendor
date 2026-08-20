'use client';

import { IntlErrorCode, NextIntlClientProvider } from 'next-intl';
import type { ComponentProps, ReactNode } from 'react';

const reportedMissingMessages = new Set<string>();

type IntlProviderProps = Pick<
  ComponentProps<typeof NextIntlClientProvider>,
  'locale' | 'messages'
> & { children: ReactNode };

export default function IntlProvider({
  children,
  locale,
  messages,
}: IntlProviderProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={(error) => {
        if (error.code === IntlErrorCode.MISSING_MESSAGE) {
          if (!reportedMissingMessages.has(error.message)) {
            reportedMissingMessages.add(error.message);
            console.warn(error.message);
          }
          return;
        }
        console.error(error);
      }}
      getMessageFallback={({ namespace, key }) =>
        [namespace, key].filter(Boolean).join('.')
      }
    >
      {children}
    </NextIntlClientProvider>
  );
}
