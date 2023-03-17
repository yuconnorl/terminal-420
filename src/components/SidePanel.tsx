'use client'
import clsx from 'clsx'
import GithubSlugger from 'github-slugger'
import { useEffect, useRef, useState } from 'react'
interface MenuData {
  id: string
  heading: string
  headingLevel: number
}

const SidePanel = ({ rawPost = '' }) => {
  const [isScrolling, setIsScrolling] = useState(false)
  const timeout = useRef<NodeJS.Timeout | null>(null)
  const slugger = new GithubSlugger()
  const observer = useRef<IntersectionObserver | null>(null)
  const sidebar = useRef<HTMLDivElement>(null)

  // retain only headings at level 2 and 3
  const filterHeadingList: string[] = rawPost
    .split('\n')
    .filter((line) => line.match(/^##{1,2}\s/))

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

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    const observerOptions = {
      rootMargin: '0% 0px -75% 0px',
      threshold: 1.0,
    }

    observer.current = new IntersectionObserver(
      observerCallback,
      observerOptions,
    )
    menuData.forEach((el) => {
      const currentEl = document.getElementById(`${el.id}`)

      if (!currentEl) return
      observer.current?.observe(currentEl)
    })

    return () => observer.current?.disconnect()
  }, [menuData])

  return (
    <aside
      ref={sidebar}
      className={clsx('sticky top-16 hidden h-fit flex-col xl:flex')}
    >
      <p className='mb-3 font-mono font-bold'>On this page</p>
      <ul
        className={clsx(
          isScrolling ? 'opacity-100' : 'opacity-20',
          'flex flex-col gap-2 border-l border-l-[#2c2c2c59] pl-4 transition-opacity duration-300 hover:opacity-100',
        )}
      >
        {menuData.map(({ id, heading, headingLevel }: MenuData) => (
          <li
            className={clsx(
              headingLevel === 3 ? 'pl-4' : '',
              currentId === id
                ? 'font-bold text-mallard-400 before:absolute before:-left-4 before:h-full before:w-[1px] before:bg-mallard-400 before:content-[""]'
                : 'text-main-gray',
              'relative cursor-pointer',
            )}
            key={id}
          >
            <a
              className='text-left text-sm'
              onClick={(e) => {
                // e.preventDefault()
                document.getElementById(`${id}`)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                  inline: 'nearest',
                })
              }}
            >
              {heading}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default SidePanel
