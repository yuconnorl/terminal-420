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
    <article className='prose-icon-link:m-0 prose-quoteless prose prose-neutral mb-16 max-w-4xl dark:prose-invert prose-h2:font-semibold'>
      <MDXContent components={{ ...components }} />
    </article>
  )
}
export default Mdx
