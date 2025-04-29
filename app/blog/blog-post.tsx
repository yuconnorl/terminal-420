import { getBlogPosts } from 'app/blog/utils'
import dayjs from 'dayjs'
import Link from 'next/link'

export function BlogPosts() {
  const allBlogs = getBlogPosts()

  return (
    <div>
      {allBlogs
        .sort((a, b) => {
          if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <Link prefetch={false} key={post.slug} className='mb-4 flex flex-col space-y-1' href={`/mdx/${post.slug}`}>
            <div className='flex w-full flex-col space-x-0 md:flex-col md:space-x-2'>
              <p className='tracking-tight text-neutral-700'>{post.metadata.title}</p>
              <p className='w-[115px] font-mono text-sm tracking-tight text-neutral-600 tabular-nums dark:text-neutral-400'>
                {dayjs(post.metadata.publishedAt).format('MMM DD, YYYY')}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
