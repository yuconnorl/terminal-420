import Navbar from '@/components/Navbar'

import Weather from './Weather'

const Header = () => {
  return (
    <header className='w-full border-b border-mallard-50'>
      <Navbar>
        {/* @ts-expect-error Server Component */}
        <Weather />
      </Navbar>
    </header>
  )
}

export default Header
