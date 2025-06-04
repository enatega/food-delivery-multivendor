"use server";

import { cookies } from "next/headers";

import { DEFAULT_LOCALE } from "../constants";
import { LocaleTypes } from "../types/locale";

const COOKIE_NAME = "NEXT_LOCALE";

export async function getUserLocale() {
  return cookies().get(COOKIE_NAME)?.value || DEFAULT_LOCALE;
}

export async function setUserLocale(locale: LocaleTypes.TLocale) {
  cookies().set(COOKIE_NAME, locale);
}
