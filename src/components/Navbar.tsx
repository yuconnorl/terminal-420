'use client'
import Link from 'next/link'
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
    name: 'About',
    path: '/about',
  },
]

const Navbar = () => {
  return (
    <div className='flex max-w-5xl justify-between'>
      <div className='flex justify-around gap-4'>
        {routes.map(({ name, path }) => (
          <div key={name} className='font-mono text-mallard-50'>
            <Link href={path}>{name}</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Navbar
