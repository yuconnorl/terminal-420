import './global.css'

import clsx from 'clsx'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Head from 'next/head'

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
      {/* <Head>
        <script
          async
          src='https://cdn.jsdelivr.net/npm/poly-decomp@0.2.1/build/decomp.min.js'
        ></script>
      </Head> */}
      {/* <body className='h-full w-full antialiased'> */}
      <body className='h-full w-full'>
        <div className='max-w-6xl'>
          <Header />
          <main className=''>{children}</main>
        </div>
      </body>
    </html>
  )
}

export default RootLayout
