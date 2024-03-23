import type { Post } from 'contentlayer/generated'
import dayjs from 'dayjs'
import Link from 'next/link'

import CategoryLink from './CategoryLink'
import ImageFloatingLayer from './ImageFloatingLayer'

interface Props {
  post: Post
}

const ArticleCard = ({ post }: Props) => {
  return (
    <article
      key={post.id}
      className='group relative flex flex-col pb-9 pt-7 font-mono tracking-tight'
    >
      <Link
        href={post.url}
        className='z-10 flex flex-col text-1.5xl tracking-tight transition-opacity hover:opacity-60 lg:text-2.5xl'
      >
        <div>
          <p>{post.title}</p>
          <div className='mb-4 mt-3 flex items-center gap-3 text-sm tracking-tighter text-main-gray md:mb-6 md:mt-4 md:gap-4'>
            <p>{dayjs(post.date).format('MMM DD, YYYY')}</p>
            <CategoryLink
              category={post?.category}
              categoryDisplayName={post?.categoryDisplayName}
            />
          </div>
          <div className='font-sans-serif text-m leading-7 tracking-wide text-main-gray'>
            <p>{post.description}</p>
          </div>
        </div>
      </Link>

      <ImageFloatingLayer />
    </article>
  )
}

export default ArticleCard
