// import { baseUrl } from 'app/sitemap'
import dayjs from 'dayjs'
import { notFound } from 'next/navigation'

import { cn } from '@/lib/utils'

import CommentSection from '@/components/CommentSection'
import { CustomMDX } from '@/components/mdx-c'
import PostPeekerButton from '@/components/PostPeekerButton'
import SidePanel from '@/components/SidePanel'

import { getBlogPosts } from '../utils'

export async function generateStaticParams() {
  const posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const baseUrl = 'https://terminal-420.com'
  const post = getBlogPosts().find((post) => post.slug === params.slug)
  if (!post) {
    return
  }

  const {
    title,
    publishedAt: publishedTime,
    description: description,
    image,
  } = post.metadata
  const ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function Blog({ params }: { params: { slug: string } }) {
  const post = getBlogPosts().find((post) => post.slug === params.slug)
  const baseUrl = 'https://terminal-420.com'

  if (!post) {
    notFound()
  }

  const currentPostId = post?.metadata.id
  const allPostWithoutCurrent = getBlogPosts().filter(
    (post) => post.metadata.id !== currentPostId,
  )

  const randomIndex = Math.floor(Math.random() * allPostWithoutCurrent.length)
  const randomPost = allPostWithoutCurrent[randomIndex]

  return (
    <div className='xl:grid xl:grid-cols-[1fr_minmax(700px,3fr)_1fr] xl:gap-7'>
      <article className='col-start-2 mx-auto w-full max-w-3xl'>
        <script
          type='application/ld+json'
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.metadata.title,
              datePublished: post.metadata.publishedAt,
              dateModified: post.metadata.modifiedAt,
              description: post.metadata.description,
              image: post.metadata.image
                ? `${baseUrl}${post.metadata.image}`
                : `/og?title=${encodeURIComponent(post.metadata.title)}`,
              url: `${baseUrl}/blog/${post.slug}`,
              author: {
                '@type': 'Person',
                name: 'My Portfolio',
              },
            }),
          }}
        />
        <h1 className='title text-2xl font-semibold'>{post.metadata.title}</h1>
        <div className='mt-1 mb-6 flex items-center justify-between text-sm'>
          <time className='font-mono tracking-tight text-neutral-600 tabular-nums dark:text-neutral-400'>
            {dayjs(post.metadata.publishedAt).format('MMM DD, YYYY')}
          </time>
        </div>
        <section
          className={cn(
            'prose prose-neutral dark:prose-invert prose-h2:text-xl prose-h3:text-lg87678c mb-10 max-w-xl',
          )}
        >
          <CustomMDX source={post.content} />
        </section>
        <div className='pt-1 pb-4 text-right text-sm text-neutral-600 italic dark:text-neutral-400'>
          <span>Last updated on</span>
          <time className='ml-1.5 font-bold'>
            {dayjs(post?.metadata?.modifiedAt).format('MMM DD, YYYY')}
          </time>
        </div>
        {randomPost?.metadata?.id && (
          <PostPeekerButton
            title={randomPost.metadata.title}
            description={randomPost.metadata.description}
            slug={randomPost.slug}
          />
        )}
        <CommentSection />
      </article>
      <SidePanel rawPost={post?.content} />
    </div>
  )
}
