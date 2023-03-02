import Link from 'next/link'

const Header = () => {
  return (
    <header className='sticky top-16 mr-10'>
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
