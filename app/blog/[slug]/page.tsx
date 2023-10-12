/* eslint-disable @typescript-eslint/require-await */
import { allPosts, type Post } from 'contentlayer/generated'
import dayjs from 'dayjs'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Balancer from 'react-wrap-balancer'

import CategoryLink from '@/components/CategoryLink'
import CommentSection from '@/components/CommentSection'
import Mdx from '@/components/Mdx'
import PostPeekerButton from '@/components/PostPeekerButton'
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
      url: `https://terminal-420.space/blog/${post ? post?.slug : ''}`,
      publishedTime: post?.date,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post?.title,
      description: post?.description,
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
    <div className='3xl:max-w-8xl relative w-full max-w-6xl pt-8 font-sans-serif xl:grid xl:grid-cols-section xl:gap-7 2xl:gap-10 3xl:gap-12'>
      <section className='col-start-2 mx-auto w-full max-w-3xl'>
        <h1 className='font-mono text-2xl font-bold tracking-tight md:text-3xl'>
          <Balancer>{post?.title}</Balancer>
        </h1>
        <div className='mb-10 mt-4 flex items-center gap-4 font-mono text-sm tracking-tighter text-main-gray'>
          <p>{dayjs(post?.date).format('MMM DD, YYYY')}</p>
          <CategoryLink
            categoryDisplayName={post?.categoryDisplayName}
            category={post?.category}
          />
        </div>
        <Mdx code={post?.body.code} />
        <div className='pb-4 pt-1 text-right italic text-mallard-100'>
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
