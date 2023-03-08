/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { allPosts, type Post } from 'contentlayer/generated'
import dayjs from 'dayjs'
import Balancer from 'react-wrap-balancer'

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
  const post: Post = allPosts.find((post) => post.slug === params.slug)

  console.log(post)

  if (!post) {
    console.log('no post')
  }

  return (
    <div className='relative flex'>
      <section className='mx-auto shrink-0 grow-[10] basis-0'>
        <h1 className='text-3xl font-bold'>
          <Balancer>{post?.title}</Balancer>
        </h1>
        <div className='mb-6 mt-4 text-[#999999]'>
          <p>{dayjs(post?.date).format('MMM DD, YYYY')}</p>
        </div>
        <Mdx code={post?.body.code} />
      </section>
      <SidePanel rawPost={post?.body.raw} />
    </div>
  )
}
