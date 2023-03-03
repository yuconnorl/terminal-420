import Link from 'next/link'
import { useMDXComponent } from 'next-contentlayer/hooks'

interface MdxProps {
  code: string
}

const CustomLink = (props) => {
  const href = props.href

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target='_blank' rel='noopener noreferrer' {...props} />
}

const Callout = (props) => {
  return (
    <div className='my-8 flex rounded-lg border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-800 dark:bg-neutral-900'>
      <div className='mr-4 flex w-4 items-center'>{props.emoji}</div>
      <div className='callout w-full'>{props.children}</div>
    </div>
  )
}

const components = {
  a: CustomLink,
  Callout,
}

const Mdx = ({ code }: MdxProps) => {
  const MDXContent = useMDXComponent(code)

  return (
    <article className='prose-quoteless prose prose-neutral max-w-4xl dark:prose-invert prose-h2:font-semibold'>
      <MDXContent components={{ ...components }} />
    </article>
  )
}
export default Mdx
