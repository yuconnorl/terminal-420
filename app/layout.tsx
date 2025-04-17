import clsx from 'clsx'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from 'next-themes'

import './global.css'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { PostHogProvider } from '@/components/posthog-provider'

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
  metadataBase: new URL('https://terminal-420.space'),
  title: {
    default: 'Terminal 420',
    template: '%s - Terminal 420',
  },
  description:
    'Welcome to Terminal 420, a blog that focuses on web-related tech, cannabis and psychedelic research. Pull up a chair and have fun!',
  openGraph: {
    title: 'Terminal 420',
    description: 'Terminal 420, a place of cannabis and web tech',
    url: 'https://terminal-420.space',
    siteName: 'Terminal 420',
    images: [
      {
        url: 'https://terminal-420.space/images/og.jpeg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'zh-Tw',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terminal 420',
    description: 'Terminal 420, a place of cannabis and web tech',
    images: 'https://terminal-420.space/images/og.jpeg',
  },
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
      id='root'
      lang='zh-TW'
      suppressHydrationWarning
      className={clsx(
        'scrollbar w-full bg-neutral-100 font-sans-serif dark:bg-neutral-800',
        notoTc.variable,
        jetBrain.variable,
      )}
    >
      <body className='w-full antialiased'>
        <PostHogProvider>
          <ThemeProvider>
            <Header />
            <main className='relative flex w-full flex-[1_0_0] justify-center px-6 text-neutral-800 dark:text-neutral-200'>
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}

export default RootLayout
