/* eslint-disable @typescript-eslint/require-await */
import { allPosts, type Post } from 'contentlayer/generated'
import dayjs from 'dayjs'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Balancer from 'react-wrap-balancer'

import CommentSection from '@/components/CommentSection'
import PostPeekerButton from '@/components/PostPeekerButton'
import SidePanel from '@/components/SidePanel'

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const post: Post | undefined = allPosts.find(
//     (post) => post.slug === params.slug,
//   )

//   return {
//     title: post?.title,
//     description: post?.description,
//     openGraph: {
//       title: post?.title,
//       description: post?.description,
//       url: `https://terminal-420.space/blog/${post ? post?.slug : ''}`,
//       publishedTime: post?.date,
//       type: 'article',
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: post?.title,
//       description: post?.description,
//     },
//   }
// }
interface Props {
  params: Post
}

export default async function Blog({ params }: Props) {
  const post: Post | undefined = allPosts.find(
    (post) => post.slug === params.slug,
  )

  const { default: Post } = await import(`@/content/${params.slug}.mdx`)

  const currentPostId = post?.id
  const allPostWithoutCurrent = allPosts.filter(
    (post) => post.id !== currentPostId,
  )

  const randomIndex = Math.floor(Math.random() * allPostWithoutCurrent.length)
  const randomPost = allPostWithoutCurrent[randomIndex]

  if (!post) {
    notFound()
  }

  return (
    <div className='3xl:max-w-8xl font-sans-serif xl:grid-cols-section 3xl:gap-12 relative w-full max-w-6xl pt-8 xl:grid xl:gap-7 2xl:gap-10'>
      <section className='col-start-2 mx-auto w-full max-w-3xl'>
        <h1 className='font-mono text-2xl font-bold tracking-tight md:text-3xl'>
          <Balancer>{post?.title}</Balancer>
        </h1>
        <div className='text-main-gray mt-2 mb-10 flex items-center gap-4 font-mono text-sm tracking-tighter'>
          <p>{dayjs(post?.date).format('MMM DD, YYYY')}</p>
        </div>
        {/* <Mdx code={post?.body.code} /> */}
        <div className='text-mallard-100 pt-1 pb-4 text-right italic'>
          <span>Last updated on</span>
          <span className='ml-1.5 font-bold'>
            {dayjs(post?.modifiedDate).format('MMM DD, YYYY')}
          </span>
        </div>
        {randomPost?.id && (
          <PostPeekerButton
            title={randomPost.title}
            description={randomPost.description}
            slug={randomPost.slug}
          />
        )}
        <CommentSection />
      </section>
      <SidePanel rawPost={post?.body.raw} />
    </div>
  )
}

export const dynamicParams = false
