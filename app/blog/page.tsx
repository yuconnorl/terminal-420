import { BlogPosts } from './blog-post'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default function Page() {
  return (
    <section>
      <h1 className='mb-8 text-2xl font-semibold tracking-tighter'>Blog</h1>
      <BlogPosts />
    </section>
  )
}
