import GithubSlugger from 'github-slugger'
import Image from 'next/image'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import React from 'react'
import { highlight } from 'sugar-high'

import Admonition from './Admonition'
import Callout from './Callout'
import CustomAccordion from './CustomAccordion'
import CustomImage from './CustomImage'
import SpecialAdmonition from './special-admonition'

function Table({ data }) {
  const headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function CustomLink(props) {
  const href = props.href

  if (href.startsWith('/')) {
    return (
      <Link className='h-fit' prefetch={false} href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a className='h-fit' {...props} />
  }

  return (
    <a className='h-fit' target='_blank' rel='noopener noreferrer' {...props} />
  )
}

function RoundedImage(props) {
  return <Image alt={props.alt} className='rounded-lg' {...props} />
}

function Code({ children, ...props }: { children: string }) {
  const codeHTML = highlight(children)

  return (
    <code
      className='rounded-xl border border-neutral-400/80 px-2 py-0.5 before:content-none after:content-none'
      dangerouslySetInnerHTML={{ __html: codeHTML }}
      {...props}
    />
  )
}

function CodeBlock({ children, ...props }: { children: string }) {
  const language = children.props.className?.split('-')[1]
  const codeHTML = highlight(children.props.children)

  return (
    <pre className=''>
      <code
        className=''
        dangerouslySetInnerHTML={{ __html: codeHTML }}
        {...props}
      />
    </pre>
  )
}

// function slugify(str: string) {
//   return str
//     .toString()
//     .toLowerCase()
//     .trim() // Remove whitespace from both ends of a string
//     .replace(/\s+/g, '-') // Replace spaces with -
//     .replace(/&/g, '-and-') // Replace & with 'and'
//     .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
//     .replace(/\-\-+/g, '-') // Replace multiple - with single -
// }

function createHeading(level: number) {
  const Heading = ({ children }: { children: string }) => {
    const slugger = new GithubSlugger()
    const slug = slugger.slug(children)
    const childrenTrim = children.replace(/\(%%.*%%\)/, '')

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
      childrenTrim,
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

const components = {
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  pre: CodeBlock,
  Admonition,
  Callout,
  CustomImage,
  CustomAccordion,
  Table,
  SpecialAdmonition,
}

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  )
}
