import Link from 'next/link'

import { LinkA, RightUpArrow } from './Icon'

type CustomLinkProps = React.ComponentPropsWithoutRef<'a'>

const CustomLink = (props: CustomLinkProps) => {
  const href = props.href

  if (href?.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href?.startsWith('#')) {
    return <a {...props} />
  }

  return (
    <span className='not-prose inline-flex'>
      <a target='_blank' rel='noopener noreferrer' {...props} />
      <LinkA />
    </span>
  )
}

export default CustomLink
