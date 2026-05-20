import dayjs from 'dayjs'

import { routing } from '@/i18n/routing'

import { getBlogPosts } from './[locale]/blog/utils'

type Sitemap = Array<{
  url: string
  lastModified?: string | Date
}>

async function generateSitemap(): Promise<Sitemap> {
  const now = dayjs().format('YYYY-MM-DD')
  const defaultLocale = routing.defaultLocale
  const getLocalePath = (locale: string) => (locale === defaultLocale ? '' : `/${locale}`)

  const postData = routing.locales.flatMap((locale) =>
    getBlogPosts(locale).map((post) => ({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}${getLocalePath(locale)}/blog/${post.slug}/`,
      lastModified: dayjs(post.metadata.modifiedAt).format('YYYY-MM-DD').toString(),
    })),
  )

  const routeData = routing.locales.map((locale) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}${getLocalePath(locale)}/`,
    lastModified: now,
  }))

  return [...postData, ...routeData]
}

export default generateSitemap
