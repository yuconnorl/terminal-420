import './global.css'

import clsx from 'clsx'
import type { Metadata } from 'next'
import localFont from 'next/font/local'

import Footer from '@/components/Footer'
import Header from '@/components/Header'

const noto = localFont({
  src: [
    {
      path: '../public/fonts/noto-sans-light.woff2',
      weight: '300',
    },
    {
      path: '../public/fonts/noto-sans-semibold.woff2',
      weight: '600',
    },
  ],
  variable: '--font-noto',
})

const roboto = localFont({
  src: [
    {
      path: '../public/fonts/roboto-regular.ttf',
      weight: '400',
    },
    {
      path: '../public/fonts/roboto-bold.ttf',
      weight: '700',
    },
  ],
  variable: '--font-roboto',
})

// built-in SEO helper
export const metadata: Metadata = {
  title: {
    default: 'test title',
    template: '%s | Testing title',
  },
  description: 'description',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    shortcut: '/favicon.ico',
  },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang='en'
      className={clsx(
        'h-full w-full bg-white font-sans-serif text-black dark:bg-[#111010] dark:text-white',
        noto.variable,
        roboto.variable,
      )}
    >
      <body className='relative mx-4 flex min-h-full w-full max-w-6xl flex-col px-8 pt-16 pb-32 antialiased md:flex-row lg:mx-auto'>
        <Header />
        <main className='flex h-full w-full flex-col'>
          {children}
          <Footer />
        </main>
      </body>
    </html>
  )
}

export default RootLayout
