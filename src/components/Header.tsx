import Link from 'next/link'

const Header = () => {
  return (
    <header className='w-full border-b border-main-white'>
      <div className='mb-2 flex justify-between'>
        <div className='font-mono text-main-white'>
          <Link href='/'>Home</Link>
        </div>
        <div className='font-mono text-main-white'>
          <Link href='/blog'>Blog</Link>
        </div>
        <div className='font-mono text-main-white'>
          <Link href='/about'>About</Link>
        </div>
      </div>
    </header>
  )
}

export default Header
