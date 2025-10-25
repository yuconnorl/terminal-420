import dayjs from 'dayjs'

import { Link } from '@/i18n/navigation'

import { getBlogPosts } from './utils'

export function BlogPosts({ locale }: { locale: string }) {
  const allBlogs = getBlogPosts(locale)

  return (
    <section className='flex flex-col gap-6 md:gap-7'>
      {allBlogs
        .sort((a, b) => {
          if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <Link
            prefetch={false}
            key={post.slug}
            className='relative before:absolute before:-left-3.5 before:font-silk before:text-neutral-600 before:opacity-0 before:content-[">"] hover:opacity-50 hover:before:opacity-100 sm:before:-left-4.5 before:dark:text-neutral-600 dark:before:text-neutral-400'
            href={`/blog/${post.slug}`}
          >
            <div className='flex w-full flex-col space-x-0 md:flex-row md:space-x-2'>
              <p className='font-cubic text-base tracking-tight text-neutral-700 md:text-lg dark:text-neutral-300'>
                {post.metadata.title}
              </p>
              <p className='font-silk text-sm tracking-tighter text-neutral-500 tabular-nums md:ml-auto dark:text-neutral-400'>
                {dayjs(post.metadata.publishedAt).format('MMM DD, YYYY')}
              </p>
            </div>
          </Link>
        ))}
    </section>
  )
}
