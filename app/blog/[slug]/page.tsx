import dayjs from 'dayjs'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import CommentSection from '@/components/comment-section'
import PostPeekerButton from '@/components/post-peeker-button'
import SidePanel from '@/components/side-panel'
import { cn } from '@/lib/utils'

import { getBlogPosts } from '../utils'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { default: Post } = await import(`@/contents/${slug}.mdx`)

  const posts = getBlogPosts()
  const filteredPosts = posts.filter((post) => post.metadata.id !== slug)

  const randomIndex = Math.floor(Math.random() * filteredPosts.length)
  const randomPost = filteredPosts[randomIndex]

  const currentPost = posts.find((post) => post.slug === slug)

  if (!currentPost) {
    notFound()
  }

  return (
    <div className='flex w-full max-w-2xl lg:gap-10'>
      <article className='w-full'>
        <h1 className='title font-cubic text-2xl font-semibold tracking-wide'>{currentPost.metadata.title}</h1>
        <div className='mt-1 mb-6 flex items-center justify-between text-sm'>
          <time className='font-silk tracking-tight text-neutral-600 tabular-nums dark:text-neutral-400'>
            {dayjs(currentPost.metadata.publishedAt).format('MMM DD, YYYY')}
          </time>
        </div>
        <section
          className={cn(
            'prose mb-10 max-w-2xl prose-neutral lg:min-w-2xl dark:prose-invert prose-headings:relative prose-headings:font-cubic prose-h2:text-xl prose-h3:text-lg prose-blockquote:border-s-[2px] prose-ul:pl-2',
          )}
        >
          <Post />
        </section>
        <div className='pt-1 pb-4 text-right text-sm text-neutral-600 italic dark:text-neutral-400'>
          <span>Last updated on</span>
          <time className='ml-1.5 font-silk font-bold tracking-tight'>
            {dayjs(currentPost?.metadata?.modifiedAt).format('MMM DD, YYYY')}
          </time>
        </div>
        {randomPost?.metadata?.id && <PostPeekerButton title={randomPost.metadata.title} slug={randomPost.slug} />}
        <CommentSection />
      </article>
      <SidePanel rawPost={currentPost?.content} />
    </div>
  )
}

export function generateStaticParams() {
  const posts = getBlogPosts()

  return posts.map((post) => ({ slug: post.slug }))
}

export const dynamicParams = false

type MetadataProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPosts().find((post) => post.slug === slug)

  if (!post) {
    return {
      title: '404 Not Found',
      description: 'Page not found',
    }
  }

  const { title, publishedAt, description } = post.metadata

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: publishedAt,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME,
      images: [`/api/og-image?title=${title}`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og-image?title=${title}`],
    },
  }
}
