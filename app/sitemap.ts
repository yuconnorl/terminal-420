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
      url: `https://terminal-420.space/blog/${post.slug}`,
      lastModified: dayjs(post.modifiedDate).format('YYYY-MM-DD').toString(),
    }
  ))
 
  const routeData = ['', '/blog', '/categories', '/about'].map((route) => {
    const now = dayjs().format('YYYY-MM-DD')     
  
    return (
    {
      url: `https://terminal-420.space${route}`,
      lastModified: now
    }
  )})

  return [...postData, ...routeData]
}

export default generateSitemap