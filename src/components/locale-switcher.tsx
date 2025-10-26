'use client'

import { useLocale } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Link, usePathname } from '@/i18n/navigation'

const LocaleButton = ({ pathname, localeCode }: { pathname: string; localeCode: string }) => {
  return (
    <Button asChild variant='emoji' size='icon' className='text-xl'>
      <Link href={pathname} locale={localeCode} className='group transition-opacity hover:opacity-70'>
        {localeCode === 'en' ? '🌎' : '🌏'}
      </Link>
    </Button>
  )
}

const LocaleSwitcher = () => {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <>
      {locale === 'en' ? (
        <LocaleButton pathname={pathname} localeCode='zh-tw' />
      ) : (
        <LocaleButton pathname={pathname} localeCode='en' />
      )}
    </>
  )
}

export default LocaleSwitcher
