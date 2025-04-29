import Link from 'next/link'

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
    <span className='not-prose text-mallard-400 m-0 mr-[2px] inline-flex transition-opacity hover:opacity-70'>
      <a
        className='after:contents-[""] after:bg-link-arrow relative inline-block after:relative after:left-[2px] after:inline-block after:h-3 after:w-3 after:bg-contain after:bg-center after:bg-no-repeat'
        target='_blank'
        rel='noopener noreferrer'
        href={props.href}
      >
        {props.children}
      </a>
    </span>
  )
}

export default CustomLink
