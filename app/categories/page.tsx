import { allPosts } from 'contentlayer/generated'
import type { Metadata } from 'next'

import ArticleCard from '@/components/ArticleCard'

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Categories',
}

const Category = () => {
  const sortPosts = allPosts.sort((a, b) => {
    if (new Date(a.date) > new Date(b.date)) return -1
    return 1
  })

  return (
    <div className='flex w-full flex-col divide-y divide-mallard-50 divide-opacity-10'>
      {sortPosts.map((post) => (
        <ArticleCard key={post.id} post={post} />
      ))}
    </div>
  )
}

export default Category
