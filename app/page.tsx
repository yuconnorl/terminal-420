import Balancer from 'react-wrap-balancer'

import BackgroundCanvas from '@/components/BackgroundCanvas'

const LandingPage = () => {
  return (
    <div className=''>
      <BackgroundCanvas />
      <h1 className='fixed left-1/2 top-1/2 w-full max-w-[650px] -translate-x-1/2 -translate-y-1/2 px-16 font-sans-serif text-3xl font-bold'>
        Hi, this is
        <span id='yourName'>Yu-Chun Liu</span>,
        <br />a frontend developer from Taiwan 🥸 focusing on developing good
        stuff
      </h1>
    </div>
  )
}

export default LandingPage
