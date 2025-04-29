import GithubSlugger from 'github-slugger'
import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import React from 'react'
import { highlight } from 'sugar-high'

import { Js, Markdown, Mdx, Ts } from '@/components/Icons'

type CustomLinkProps = React.ComponentPropsWithoutRef<'a'>

const CustomLink = (props: CustomLinkProps) => {
  const href = props.href

  if (href?.startsWith('/')) {
    return (
      <Link className='h-fit' prefetch={false} href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href?.startsWith('#')) {
    return <a className='h-fit' {...props} />
  }

  return (
    <span className='not-prose m-0 mr-[2px] inline-flex text-[#8c796a] transition-opacity hover:opacity-70 dark:text-[#AA9D8D]'>
      <a
        className='after:contents-[""] after:bg-link-arrow-dark dark:after:bg-link-arrow relative inline-block underline underline-offset-2 after:relative after:left-[2px] after:inline-block after:h-3 after:w-3 after:bg-contain after:bg-center after:bg-no-repeat'
        target='_blank'
        rel='noopener noreferrer'
        href={props.href}
      >
        {props.children}
      </a>
    </span>
  )
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: string }) => {
    const slugger = new GithubSlugger()
    const slug = slugger.slug(children)

    return React.createElement(
      `h${level}`,
      {
        id: slug,
      },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children,
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

const CodeBlock = ({ children, ...props }: { children: string }) => {
  const language = children.props.className?.split('-')[1]
  const codeHTML = highlight(children.props.children)

  const iconMap = {
    javascript: <Js className='size-5' />,
    typescript: <Ts className='size-5' />,
    markdown: <Markdown className='size-5' />,
    mdx: <Mdx className='size-5' />,
  }

  const Icon = iconMap[language as keyof typeof iconMap]

  return (
    <div className='relative'>
      <div className='absolute right-1.5 bottom-1.5 text-neutral-300/70'>{Icon}</div>
      <pre>
        <code className='' dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
      </pre>
    </div>
  )
}

function Code({ ...props }: { children: string }) {
  return <code className='px-1 py-0.5 before:content-none after:content-none' {...props} />
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: createHeading(2),
    h3: createHeading(3),
    h4: createHeading(4),
    h5: createHeading(5),
    h6: createHeading(6),
    pre: CodeBlock,
    code: Code,
    a: CustomLink,
    ...components,
  }
}
