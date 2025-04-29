import { useMDXComponent } from 'next-contentlayer/hooks'

import Admonition from './Admonition'
import Callout from './Callout'
import CustomAccordion from './CustomAccordion'
import CustomImage from './CustomImage'
import CustomLink from './CustomLink'

const components = {
  a: CustomLink,
  Callout,
  CustomImage,
  Admonition,
  CustomAccordion,
}

const Mdx = ({ code = '' }) => {
  const MDXContent = useMDXComponent(code)

  return (
    <article className='prose-code:text-mono prose prose-only-dark prose-h2:font-semibold prose-blockquote:border-l prose-blockquote:border-l-mallard-300 prose-code:rounded-xl prose-code:bg-mallard-700 prose-code:py-[2px] prose-code:before:hidden prose-code:after:hidden prose-ul:pl-4 prose-img:mb-0 md:prose-ul:pl-6 md:prose-li:pl-1 mb-10 max-w-3xl md:mb-16'>
      {/* <MDXContent components={{ ...components }} /> */}
    </article>
  )
}
export default Mdx
