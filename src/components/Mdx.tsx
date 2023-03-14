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
    <article className='prose-code:text-mono prose prose-neutral mb-16 max-w-4xl dark:prose-invert prose-h2:font-semibold prose-code:rounded-xl prose-code:bg-mallard-700 prose-code:py-[2px] prose-code:px-1 prose-code:before:content-[""] prose-code:after:content-[""]'>
      <MDXContent components={{ ...components }} />
    </article>
  )
}
export default Mdx
