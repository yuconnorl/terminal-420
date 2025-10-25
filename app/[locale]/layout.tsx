import clsx from 'clsx'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
// import { setRequestLocale } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'

import Footer from '@/components/footer'
import Header from '@/components/header'
import { PostHogProvider } from '@/components/posthog-provider'
import { routing } from '@/i18n/routing'

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
    description: 'Way to go. Take a load off and relax.',
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
    description: 'Way to go. Take a load off and relax.',
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

const RootLayout = async ({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) => {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <>
      <PostHogProvider>
        <ThemeProvider>
          <NextIntlClientProvider>
            <div className='flex min-h-screen flex-col'>
              <Header />
              <main className='relative flex w-full flex-[1_0_0] justify-center px-6 text-neutral-800 dark:text-neutral-200'>
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </PostHogProvider>
    </>
  )
}

export default RootLayout
