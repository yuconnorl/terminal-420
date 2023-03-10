import Balancer from 'react-wrap-balancer'

import BackgroundCanvas from '@/components/BackgroundCanvas'

const LandingPage = () => {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <h1 className='max-w-[650px] font-sans-serif text-3xl font-bold'>
        <Balancer>
          Hi, this is Connor, a frontend developer from Taiwan 🥸 focusing on
          developing good stuff
        </Balancer>
      </h1>
      <BackgroundCanvas />
    </div>
  )
}

export default LandingPage
