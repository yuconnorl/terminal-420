'use client'
import { allPosts } from 'contentlayer/generated'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

import CategoryLink from '@/components/CategoryLink'

interface initialValue {
  [categories: string]: number
}

const Categories = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const currentRoute = pathname && pathname.match(/\/([\w-]+)$/)?.[0].slice(1)
  const title = currentRoute === 'categories' ? 'Categories' : currentRoute
  const categories = useMemo(() => {
    const initObj: initialValue = {}
    return allPosts
      .map((post) => post.category)
      .reduce((acc, current) => {
        acc[current] = (acc[current] || 0) + 1
        return acc
      }, initObj)
  }, [])

  return (
    <div className='w-full max-w-3xl pb-24 pt-8'>
      <div className='mb-7'>
        <h1 className='font-mono text-3xl font-bold tracking-tight md:text-4xl'>
          {title}
        </h1>
        <div className='flex flex-wrap gap-3 pt-4 md:gap-4'>
          {Object.entries(categories).map(([category, count]) => (
            <CategoryLink
              isActive={category === currentRoute}
              isTitle
              key={category}
              category={category}
              count={count}
            />
          ))}
        </div>
      </div>
      {children}
      <Image
        src='/images/boi.png'
        className='fixed left-1/2 top-1/2'
        width={1080 / 2}
        height={1051 / 2}
        alt='weed boi'
        priority
      />
    </div>
  )
}

export default Categories
