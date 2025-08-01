'use server';

import { cookies } from 'next/headers';
import { TLocale } from '../types/locale';
import { DEFAULT_LOCALE } from '../constants';


const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale() {
  return cookies().get(COOKIE_NAME)?.value || DEFAULT_LOCALE;
}

export async function setUserLocale(locale: TLocale) {
  cookies().set(COOKIE_NAME, locale);
}
