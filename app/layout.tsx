import './global.css'

import clsx from 'clsx'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'

import Footer from '@/components/footer'
import Header from '@/components/header'
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

const cubic_11 = localFont({
  src: '../public/fonts/cubic_11.woff2',
  variable: '--font-cubic-11',
})

const silkScreen = localFont({
  src: '../public/fonts/silk-screen-regular.ttf',
  variable: '--font-silk-screen',
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
        'scrollbar font-sans-serif w-full bg-[#f7f6f5] transition-colors duration-200 dark:bg-neutral-800',
        notoTc.variable,
        jetBrain.variable,
        cubic_11.variable,
        silkScreen.variable,
      )}
    >
      <body className='w-full antialiased'>
        <PostHogProvider>
          <ThemeProvider>
            <div className='flex min-h-screen flex-col'>
              <Header />
              <main className='relative flex w-full flex-[1_0_0] justify-center px-6 text-neutral-800 dark:text-neutral-200'>
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}

export default RootLayout
