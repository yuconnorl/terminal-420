import type { Metadata } from 'next'

import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About',
  description: 'About pages',
}

const AboutPage = () => {
  return (
    <section className='pt-8'>
      <div>
        Welcome to Terminal 420, I am still working so hard on this one 😓 🏗️
      </div>
      <Footer />
    </section>
  )
}

export default AboutPage
