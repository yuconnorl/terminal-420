import { allPosts } from 'contentlayer/generated'
import dayjs from 'dayjs'
import type { Metadata } from 'next'
import Link from 'next/link'

import Footer from '@/components/Footer'
import { Folder } from '@/components/Icon'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Blog posts',
}

const BlogPage = () => {
  return (
    <section className='max-w-3xl pt-8'>
      <h1 className='mb-5 font-mono text-3xl font-bold'>Blog Posts</h1>
      <div className='flex flex-col gap-10'>
        {allPosts
          .sort((a, b) => {
            if (new Date(a.date) > new Date(b.date)) return -1
            return 1
          })
          .map((post) => {
            return (
              <div
                key={post.id}
                className='flex flex-col font-mono tracking-tight'
              >
                <Link
                  href={post.url}
                  className='flex w-full flex-col text-2xl tracking-tight transition-opacity hover:opacity-60 lg:text-3xl'
                >
                  <p>{post.title}</p>
                </Link>
                <div className='my-2 flex gap-4 text-sm tracking-tighter text-main-gray'>
                  <p>{dayjs(post.date).format('MMM DD, YYYY')}</p>
                  <div className='flex items-center tracking-tight'>
                    <Folder />
                    <p className='ml-1'>{post.category}</p>
                  </div>
                </div>
                <div className=' mt-1 max-w-xl font-sans-serif tracking-wide text-main-gray'>
                  <p>{post.description}</p>
                </div>
              </div>
            )
          })}
      </div>
      <Footer />
    </section>
  )
}

export default BlogPage
