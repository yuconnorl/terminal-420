/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { allPosts, type Post } from 'contentlayer/generated'
import dayjs from 'dayjs'
import Balancer from 'react-wrap-balancer'

import CommentSection from '@/components/CommentSection'
import Footer from '@/components/Footer'
import Mdx from '@/components/Mdx'
import SidePanel from '@/components/SidePanel'

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
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
    <div className='relative grid max-w-6xl grid-cols-section pt-8 font-sans-serif md:gap-8'>
      <section className='col-start-2 mx-auto max-w-4xl shrink-0 grow-[10] basis-0'>
        <h1 className='font-mono text-2xl font-bold md:text-3xl'>
          <Balancer>{post?.title}</Balancer>
        </h1>
        <div className='mb-6 mt-4 font-mono tracking-tight text-main-gray'>
          <p>{dayjs(post?.date).format('MMM DD, YYYY')}</p>
        </div>
        <Mdx code={post?.body.code} />
        <CommentSection />
        <Footer />
      </section>
      <SidePanel rawPost={post?.body.raw} />
    </div>
  )
}
