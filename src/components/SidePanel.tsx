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
  const slugger = new GithubSlugger()
  const observer = useRef<IntersectionObserver | null>(null)

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

  useEffect(() => {
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
    <aside className='sticky top-16 ml-10 hidden h-fit shrink-0 grow-[3] basis-0 flex-col gap-2 lg:flex'>
      {menuData.map(({ id, heading, headingLevel }: MenuData) => (
        <div
          className={clsx(
            headingLevel === 3 ? 'pl-4' : '',
            currentId === id ? 'text-cyan-500' : 'text-gray-300',
          )}
          key={id}
        >
          <button
            className='text-left text-sm'
            type='button'
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(`${id}`)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
              })
            }}
          >
            {heading}
          </button>
        </div>
      ))}
    </aside>
  )
}

export default SidePanel
