import { cn } from '@/lib/utils'

type ThemeTypes = 'weed' | 'mushroom'

interface Props {
  title?: string
  children?: React.ReactNode
  themeType: ThemeTypes
}

const themes = {
  weed: 'overflow-hidden relative bg-weed/10 bg-auto bg-repeat text-[#324a36] dark:text-[#c5d5c5] border-weed/50 py-8 before:content-[""] before:absolute before:bg-[length:12%] sm:before:bg-auto before:top-0 before:left-0 before:w-[200%] before:h-[200%] before:bg-[url(/images/weed-boi-bg.png)] before:animate-weed before:translate-x-[0%]',
  mushroom:
    'overflow-hidden relative bg-mushroom/10 bg-auto bg-repeat text-[#943787] dark:text-[#edbaea] border-mushroom/50 py-8 before:content-[""] before:absolute before:bg-[length:12%] sm:before:bg-auto before:top-0 before:left-0 before:w-[200%] before:h-[200%] before:bg-[url(/images/mushroom-bg.png)] before:animate-mushroom',
}

const SpecialAdmonition = ({ title, children, themeType }: Props) => {
  const theme = themes[themeType]

  return (
    <div className={cn('text-m my-8 rounded-xl border px-5 pt-6 pb-2 leading-relaxed', theme)}>
      {title && (
        <div className='mb-3 flex items-center gap-1'>
          <span className='text-base font-bold tracking-wide capitalize'>{title}</span>
        </div>
      )}
      <div className={cn('not-prose text-center text-base')}>{children}</div>
    </div>
  )
}

export default SpecialAdmonition
