import { allPosts } from 'contentlayer/generated'
import dayjs from 'dayjs'

type Sitemap = Array<{
  url: string;
  lastModified?: string | Date;
}>;

// eslint-disable-next-line @typescript-eslint/require-await
async function generateSitemap(): Promise<Sitemap> {
  const postData = allPosts.map((post) => (
    {
      url: `https://terminal-420/blog/${post.slug}`,
      lastModified: post.date
    }
  ))
 
  const routeData = ['', '/blog', '/categories', '/about'].map((route) => {
    const now = dayjs().format('YYYY-M-DD')     
  
    return (
    {
      url: `https://terminal-420/blog${route}`,
      lastModified: now
    }
  )})

  return [...postData, ...routeData]
}

export default generateSitemap