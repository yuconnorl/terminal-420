import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'zh-TW'],
  defaultLocale: 'zh-TW',
  localeDetection: false,
  localePrefix: 'as-needed',
  localeCookie: false,
})
