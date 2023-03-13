import { allPosts } from 'contentlayer/generated'
import dayjs from 'dayjs'
import type { Metadata } from 'next'
import Link from 'next/link'

import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Blog posts',
  description: 'blog postas',
}

const BlogPage = () => {
  return (
    <section className='max-w-5xl pt-8'>
      <h1 className='mb-5 font-mono text-3xl font-bold'>Blog</h1>
      {allPosts
        .sort((a, b) => {
          if (new Date(a.date) > new Date(b.date)) return -1
          return 1
        })
        .map((post) => {
          return (
            <Link
              key={post.id}
              className='mb-4 flex flex-col space-y-1 font-mono tracking-tight'
              href={post.url}
            >
              <div className='flex w-full flex-col text-3xl tracking-tight'>
                <p>{post.title}</p>
              </div>
              <div className='text-sm text-main-gray'>
                <p>{dayjs(post.date).format('MMM DD, YYYY')}</p>
              </div>
            </Link>
          )
        })}
      <Footer />
    </section>
  )
}

export default BlogPage
