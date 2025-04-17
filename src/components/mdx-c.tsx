import Image from 'next/image'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import React from 'react'
import { highlight } from 'sugar-high'

import Admonition from './admonition'
import Callout from './Callout'
import CustomAccordion from './CustomAccordion'
import CustomImage from './CustomImage'

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

function RoundedImage(props) {
  return <Image alt={props.alt} className='rounded-lg' {...props} />
}

function Code({ children, ...props }: { children: string }) {
  const codeHTML = highlight(children)
  console.log('codeHTML', codeHTML)

  return (
    <code
      className='rounded-xl border border-[#3a3536]/30 px-2 py-0.5 before:content-none after:content-none'
      dangerouslySetInnerHTML={{ __html: codeHTML }}
      {...props}
    />
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

function slugify(str: string) {
  const match = str.match(/\(%%(.*?)%%\)/)
  return match ? match[1] : ''
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: string }) => {
    const slug = slugify(children)
    const childrenTrim = children.replace(/\(%%.*%%\)/, '')

    return React.createElement(
      `h${level}`,
      { id: slug },
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
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  Admonition,
  Callout,
  CustomImage,
  CustomAccordion,
  Table,
}

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  )
}
