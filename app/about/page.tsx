import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: "Hi! I'm Yu-Chun Liu, frontend developer based in Taiwan",
}

const AboutPage = () => {
  return (
    <section className='pt-8'>
      <div>
        Welcome to Terminal 420, I am still working so hard on this one 😓 🏗️
      </div>
    </section>
  )
}

export default AboutPage
