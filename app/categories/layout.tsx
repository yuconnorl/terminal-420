'use client'
import { allPosts } from 'contentlayer/generated'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import CategoryLink from '@/components/CategoryLink'
import { categoryTextFormatter } from '@/helper/text'

interface initialValue {
  [categories: string]: number
}

const Categories = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const [title, setTitle] = useState('')
  const currentRoute =
    (pathname && pathname.match(/\/([\w-]+)$/)?.[0].slice(1)) || ''
  const categories = useMemo(() => {
    const initObj: initialValue = {}
    return allPosts
      .map((post) => post.category)
      .reduce((acc, current) => {
        acc[current] = (acc[current] || 0) + 1
        return acc
      }, initObj)
  }, [])

  useEffect(() => {
    if (currentRoute === 'categories') {
      setTitle('Categories')
      return
    }
    const filterTitle = Object.keys(categories).find(
      (category) => category === currentRoute,
    )
      ? currentRoute
      : 'Category not found 😢'

    setTitle(categoryTextFormatter(filterTitle))
  }, [currentRoute, categories])

  return (
    <div className='w-full max-w-3xl pt-8'>
      <div className='mb-7'>
        <h1 className='font-mono text-3xl tracking-tight md:text-4xl'>
          {title}
        </h1>
        <div className='flex flex-wrap gap-2 pt-4 md:gap-4'>
          {Object.entries(categories).map(([category, count]) => (
            <CategoryLink
              categoryDisplayName={categoryTextFormatter(category)}
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
    </div>
  )
}

export default Categories
