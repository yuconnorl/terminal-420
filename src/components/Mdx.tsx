import { useMDXComponent } from 'next-contentlayer/hooks'

import Callout from './Callout'
import CustomLink from './CustomLink'

const components = {
  a: CustomLink,
  Callout,
}

const Mdx = ({ code = '' }) => {
  const MDXContent = useMDXComponent(code)

  return (
    <article className='prose-code:text-mono prose prose-neutral mb-10 max-w-3xl dark:prose-invert prose-h2:font-semibold prose-blockquote:border-l prose-blockquote:border-l-mallard-300 prose-code:rounded-xl prose-code:bg-mallard-700 prose-code:py-[2px] prose-code:px-[6px] prose-code:before:hidden prose-code:after:hidden prose-ul:pl-4 md:mb-16 md:prose-ul:pl-6'>
      <MDXContent components={{ ...components }} />
    </article>
  )
}
export default Mdx
