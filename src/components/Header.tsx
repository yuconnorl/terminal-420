import Link from 'next/link'

const Header = () => {
  return (
    <header className='flex w-full'>
      <div>
        <Link href='/blog'>Blog</Link>
      </div>
      <div>
        <Link href='/about'>About</Link>
      </div>
    </header>
  )
}

export default Header
