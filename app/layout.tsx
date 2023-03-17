import './global.css'

import clsx from 'clsx'
import type { Metadata } from 'next'
import localFont from 'next/font/local'

import Header from '@/components/Header'

// loading local fonts
const notoTc = localFont({
  src: [
    {
      path: '../public/fonts/noto-sans-tc-regular.woff2',
      weight: '400',
    },
    {
      path: '../public/fonts/noto-sans-tc-bold.woff2',
      weight: '700',
    },
  ],
  variable: '--font-noto',
})

const jetBrain = localFont({
  src: '../public/fonts/jetbrain-mono-variable.ttf',
  variable: '--font-jet-brain',
})

// built-in SEO helper
export const metadata: Metadata = {
  title: {
    default: 'Terminal 420',
    template: '%s | Terminal 420',
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
    shortcut: '/favicon.png',
  },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang='zh-TW'
      className={clsx(
        'scrollbar h-full w-full bg-main-black font-sans-serif text-mallard-50',
        notoTc.variable,
        jetBrain.variable,
      )}
    >
      <body className='h-full w-full p-6 antialiased'>
        <div className='flex h-full w-full flex-col'>
          <Header />
          <main className='relative flex w-full flex-[1_0_0] justify-center'>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

export default RootLayout
