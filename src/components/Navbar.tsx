'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const routes = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Blog',
    path: '/blog',
  },
  {
    name: 'Categories',
    path: '/categories',
  },
  {
    name: 'About',
    path: '/about',
  },
]

const Navbar = () => {
  const pathname = usePathname()
  const rootPath = pathname && pathname.match(/^\/(\w+)/g)?.[0]

  return (
    <div className='flex max-w-5xl justify-between'>
      <div className='flex justify-around gap-4'>
        {routes.map(({ name, path }) => (
          <div
            key={name}
            className={clsx(
              'font-mono',
              rootPath === path ? 'text-mallard-400' : 'text-mallard-50',
            )}
          >
            <Link href={path}>{name}</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Navbar
