import dayjs from 'dayjs'

import { getBlogPosts } from './[locale]/blog/utils'

type Sitemap = Array<{
  url: string
  lastModified?: string | Date
}>

async function generateSitemap(): Promise<Sitemap> {
  const postDataZhTW = getBlogPosts('zh-TW').map((post) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}/`,
    lastModified: dayjs(post.metadata.modifiedAt).format('YYYY-MM-DD').toString(),
  }))

  const postDataEn = getBlogPosts('en').map((post) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}/`,
    lastModified: dayjs(post.metadata.modifiedAt).format('YYYY-MM-DD').toString(),
  }))

  const routeData = [''].map((route) => {
    const now = dayjs().format('YYYY-MM-DD')

    return {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${route}`,
      lastModified: now,
    }
  })

  return [...postDataZhTW, ...postDataEn, ...routeData]
}

export default generateSitemap
