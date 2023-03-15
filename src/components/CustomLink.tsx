import Link from 'next/link'

import { RoundRightUpArrow } from './Icon'

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
    <span className='not-prose m-0 inline-flex text-mallard-400 hover:opacity-70'>
      <a target='_blank' rel='noopener noreferrer' {...props} />
      <RoundRightUpArrow />
    </span>
  )
}

export default CustomLink
