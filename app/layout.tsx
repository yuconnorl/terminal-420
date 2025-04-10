import clsx from 'clsx'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'

import './global.css'
import { ThemeProvider } from 'next-themes'
import Footer from '@/components/Footer'
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
      className={clsx(
        'scrollbar w-full bg-stone-200 font-sans-serif text-gray-800',
        notoTc.variable,
        jetBrain.variable,
      )}
    >
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${
          process.env.GA_TRACKING_ID || ''
        }`}
      />
      <Script id='google-analytics'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.GA_TRACKING_ID || ''}');
        `}
      </Script>
      <body className='w-full antialiased'>
        <div className='main flex w-full flex-col justify-between'>
          {/* <Header /> */}
          <main className='relative flex w-full flex-[1_0_0] justify-center px-6'>
            <ThemeProvider>{children}</ThemeProvider>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

export default RootLayout
