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

const Navbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='mb-2 flex justify-between'>
      <div className='flex justify-around gap-4'>
        {routes.map(({ name, path }) => (
          <div key={name} className='font-mono text-mallard-50'>
            <Link href={path}>{name}</Link>
          </div>
        ))}
      </div>
      {children}
    </div>
  )
}

export default Navbar
