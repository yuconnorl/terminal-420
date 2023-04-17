/* eslint-disable @typescript-eslint/require-await */
import { allPosts, type Post } from 'contentlayer/generated'
import dayjs from 'dayjs'
import type { Metadata } from 'next'
import Balancer from 'react-wrap-balancer'

import CategoryLink from '@/components/CategoryLink'
import CommentSection from '@/components/CommentSection'
import Mdx from '@/components/Mdx'
import SidePanel from '@/components/SidePanel'

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post: Post | undefined = allPosts.find(
    (post) => post.slug === params.slug,
  )

  return {
    title: post?.title,
    description: post?.description,
    openGraph: {
      title: post?.title,
      description: post?.description,
      url: `https://terminal-420.space/${post ? post?.slug : ''}`,
      publishedTime: post?.date,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post?.title,
      description: post?.description,
      images: '/images/og.jpeg',
    },
  }
}
interface Props {
  params: Post
}

export default async function Blog({ params }: Props) {
  const post: Post | undefined = allPosts.find(
    (post) => post.slug === params.slug,
  )

  if (!post) {
    // TODO: handle no post
    console.log('no post')
  }

  return (
    <div className='3xl:max-w-8xl relative w-full max-w-6xl pt-8 font-sans-serif xl:grid xl:grid-cols-section xl:gap-7 2xl:gap-10 3xl:gap-12'>
      <section className='col-start-2 mx-auto max-w-3xl'>
        <h1 className='font-mono text-2xl font-bold tracking-tight md:text-3xl'>
          <Balancer>{post?.title}</Balancer>
        </h1>
        <div className='mb-10 mt-4 flex items-center gap-4 font-mono text-sm tracking-tighter text-main-gray'>
          <p>{dayjs(post?.date).format('MMM DD, YYYY')}</p>
          <CategoryLink category={post?.category} />
        </div>
        <Mdx code={post?.body.code} />
        <CommentSection />
      </section>
      <SidePanel rawPost={post?.body.raw} />
    </div>
  )
}
