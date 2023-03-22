/* eslint-disable @typescript-eslint/require-await */
import { allPosts, type Post } from 'contentlayer/generated'
import type { Metadata } from 'next'

import PostTitle from '@/components/ArticleCard'

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    category: post.category,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Category: ${params.category}`,
    description: 'Category',
  }
}

interface Props {
  params: Post
}

export default async function Blog({ params }: Props) {
  const filterPosts: Post[] | undefined = allPosts.filter(
    (post) => post.category === params.category,
  )

  return (
    <div className='flex w-full flex-col divide-y divide-mallard-50 divide-opacity-10'>
      {filterPosts.map((post) => (
        <PostTitle key={post.id} post={post} />
      ))}
    </div>
  )
}
