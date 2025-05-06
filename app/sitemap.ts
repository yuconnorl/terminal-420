import dayjs from 'dayjs'

import { getBlogPosts } from './blog/utils'

type Sitemap = Array<{
  url: string
  lastModified?: string | Date
}>

async function generateSitemap(): Promise<Sitemap> {
  const postData = getBlogPosts().map((post) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}/`,
    lastModified: dayjs(post.metadata.modifiedAt).format('YYYY-MM-DD').toString(),
  }))

  const routeData = ['', '/blog'].map((route) => {
    const now = dayjs().format('YYYY-MM-DD')

    return {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${route}`,
      lastModified: now,
    }
  })

  return [...postData, ...routeData]
}

export default generateSitemap
