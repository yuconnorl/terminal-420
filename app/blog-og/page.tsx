import { allPosts } from 'contentlayer/generated'
import type { Metadata } from 'next'

import ArticleCard from '@/components/ArticleCard'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Blog posts',
}

const BlogPage = () => {
  const sortPosts = allPosts.sort((a, b) => {
    if (new Date(a.date) > new Date(b.date)) return -1
    return 1
  })

  return (
    <section className='w-full max-w-3xl pt-8'>
      <h1 className='mb-8 font-mono text-3xl font-bold md:text-4xl'>
        Blog Posts
      </h1>
      <div className='flex flex-col divide-y divide-mallard-50 divide-opacity-10'>
        {sortPosts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

export default BlogPage
