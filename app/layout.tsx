import './global.css'

import clsx from 'clsx'
import localFont from 'next/font/local'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

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
  preload: false,
})

const cubic_11 = localFont({
  src: '../public/fonts/cubic_11.woff2',
  variable: '--font-cubic-11',
  preload: false,
})

const silkScreen = localFont({
  src: '../public/fonts/silk-screen-regular.ttf',
  variable: '--font-silk-screen',
  preload: false,
})

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  return (
    <html
      id='root'
      lang='zh-TW'
      suppressHydrationWarning
      className={clsx(
        'scrollbar font-sans-serif w-full bg-pale-white transition-colors duration-200 dark:bg-neutral-900',
        notoTc.variable,
        jetBrain.variable,
        cubic_11.variable,
        silkScreen.variable,
      )}
    >
      <body className='w-full antialiased'>{children}</body>
    </html>
  )
}
