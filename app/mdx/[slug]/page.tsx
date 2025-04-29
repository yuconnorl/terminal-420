// import { baseUrl } from 'app/sitemap'
import dayjs from 'dayjs'
import { notFound } from 'next/navigation'

import { cn } from '@/lib/utils'

import CommentSection from '@/components/CommentSection'
import PostPeekerButton from '@/components/PostPeekerButton'
import SidePanel from '@/components/SidePanel'

import { getBlogPosts } from '../../blog/utils'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { default: Post } = await import(`@/contents/${slug}.mdx`)

  const posts = getBlogPosts()
  const currentPost = posts.find((post) => post.slug === slug)

  if (!currentPost) {
    notFound()
  }

  return (
    // <div className='md:grid md:grid-cols-[1fr_minmax(650px,2.5fr)_1fr] md:gap-5'>
    <div className='lg:grid lg:grid-cols-[1fr_minmax(650px,2.5fr)_1fr] lg:gap-5'>
      <article className='col-start-2 mx-auto w-full max-w-xl'>
        {/* <script
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
        /> */}
        <h1 className='title text-2xl font-semibold'>{currentPost.metadata.title}</h1>
        <div className='mt-1 mb-6 flex items-center justify-between text-sm'>
          <time className='font-mono tracking-tight text-neutral-600 tabular-nums dark:text-neutral-400'>
            {dayjs(currentPost.metadata.publishedAt).format('MMM DD, YYYY')}
          </time>
        </div>
        <section
          className={cn(
            'prose prose-neutral dark:prose-invert prose-h2:text-xl prose-h3:text-lg87678c prose-headings:relative prose-blockquote:border-s-[2px] mb-10 max-w-xl',
          )}
        >
          <Post />
        </section>
        <div className='pt-1 pb-4 text-right text-sm text-neutral-600 italic dark:text-neutral-400'>
          <span>Last updated on</span>
          <time className='ml-1.5 font-bold'>{dayjs(currentPost?.metadata?.modifiedAt).format('MMM DD, YYYY')}</time>
        </div>
        {/* {randomPost?.metadata?.id && (
          <PostPeekerButton
            title={randomPost.metadata.title}
            description={randomPost.metadata.description}
            slug={randomPost.slug}
          />
        )} */}
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
