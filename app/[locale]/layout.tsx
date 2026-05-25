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
  metadataBase: new URL('https://mindagonist.com'),
  title: {
    default: 'mind agonist',
    template: '%s - mind agonist',
  },
  description: 'mind agonist',
  openGraph: {
    title: 'mind agonist',
    description: 'Way to go. Take a load off and relax.',
    url: 'https://mindagonist.com',
    siteName: 'mind agonist',
    images: [
      {
        url: 'https://mindagonist.com/images/og.jpeg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'zh-Tw',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mind agonist',
    description: 'Way to go. Take a load off and relax.',
    images: 'https://mindagonist.com/images/og.jpeg',
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
