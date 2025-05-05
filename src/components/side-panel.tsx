'use client'

import GithubSlugger from 'github-slugger'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type MenuData = {
  id: string
  heading: string
  headingLevel: number
}

const SidePanel = ({ rawPost = '' }) => {
  const [isScrolling, setIsScrolling] = useState<boolean>(false)
  const [isAsideOpen, setIsAsideOpen] = useState<boolean>(true)
  const timeout = useRef<NodeJS.Timeout | null>(null)
  const slugger = new GithubSlugger()
  const observer = useRef<IntersectionObserver | null>(null)
  const sidebar = useRef<HTMLDivElement>(null)

  // retain only headings at level 2 and 3
  const filterHeadingList: string[] = rawPost.split('\n').filter((line) => line.match(/^##{1,2}\s/))

  // extract heading info and level, transform into object
  const menuData: MenuData[] = filterHeadingList.map((el) => {
    const heading = el.trim().replace(/^###*\s/, '')
    const headingLevel = el.slice(0, 3) === '###' ? 3 : 2

    return {
      id: `${slugger.slug(heading)}`,
      heading,
      headingLevel,
    }
  })

  const [currentId, setCurrentId] = useState(menuData[0]?.id)

  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    if (entries.length > 2) return
    if (entries[0]?.isIntersecting) {
      setCurrentId(entries[0]?.target.id)
    }
  }

  const handleScroll = () => {
    if (isScrolling) return
    setIsScrolling(true)

    if (timeout.current) return
    const timeoutId = setTimeout(() => {
      setIsScrolling(false)

      timeout.current = null
    }, 5000)
    timeout.current = timeoutId
  }

  function onChevronClick() {
    setIsAsideOpen((state) => !state)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    const observerOptions = {
      rootMargin: '0% 0px -75% 0px',
      threshold: 1.0,
    }

    observer.current = new IntersectionObserver(observerCallback, observerOptions)
    menuData.forEach((el) => {
      const currentEl = document.getElementById(`${el.id}`)

      if (!currentEl) return
      observer.current?.observe(currentEl)
    })

    return () => observer.current?.disconnect()
  }, [menuData])

  return (
    <aside ref={sidebar} className={cn('sticky hidden h-fit min-w-52 flex-col xl:top-16 xl:block')}>
      <div className='mb-3 flex pl-2'>
        <p className='font-mono text-sm'>Contents</p>
        <button
          className='relative ml-1 -translate-y-0.5 cursor-pointer transition-opacity hover:opacity-70'
          onClick={onChevronClick}
        >
          <span>{isAsideOpen ? '🐵' : '🙈'}</span>
        </button>
      </div>
      <ul
        className={cn(
          isScrolling ? 'opacity-100' : 'opacity-20',
          isAsideOpen ? 'visible' : 'invisible',
          'flex flex-col gap-[0.65rem] pl-4 transition-opacity duration-300 hover:opacity-100',
        )}
      >
        {menuData.map(({ id, heading, headingLevel }: MenuData) => (
          <li
            className={cn(
              headingLevel === 3 && 'pl-3.5',
              currentId === id
                ? 'text-neutral-900 before:absolute before:-left-4 before:h-full before:w-[1.6px] before:-translate-y-0.5 before:bg-[#8c796a] before:content-[""] dark:text-neutral-50 dark:before:bg-[#AA9D8D]'
                : 'text-neutral-400 dark:text-neutral-500',
              'relative cursor-pointer leading-4 transition-colors duration-300',
            )}
            key={id}
          >
            <button
              className='text-left text-sm'
              onClick={(e) => {
                e.preventDefault()
                const ele = document.getElementById(`${id}`)
                const yOffset = -10
                const y = ele ? ele.getBoundingClientRect().top + window.scrollY + yOffset : 0

                window.scrollTo({ top: y, behavior: 'smooth' })
              }}
            >
              {heading}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default SidePanel
