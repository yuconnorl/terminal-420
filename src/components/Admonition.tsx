import { cn } from '@/lib/utils'

import { Danger, Info, Warn } from './Icons'
type Status = 'info' | 'warn' | 'danger' | 'weed' | 'mushroom'

interface Props {
  title?: string
  children?: React.ReactNode
  types: Status
}

const iconMap = {
  info: Info,
  warn: Warn,
  danger: Danger,
}

const themes = {
  info: 'bg-info/10 text-info border-info/50',
  warn: 'bg-warn/10 text-warn border-warn/50',
  danger: 'bg-danger/10 text-danger border-danger/50',
  weed: 'overflow-hidden relative bg-weed/10 bg-auto bg-repeat text-weed-200 border-weed/50 py-8 before:content-[""] before:absolute before:bg-[length:12%] sm:before:bg-auto before:top-0 before:left-0 before:w-[200%] before:h-[200%] before:bg-weed-boi before:animate-weed before:translate-x-[0%]',
  mushroom:
    'overflow-hidden relative bg-mushroom/10 bg-auto bg-repeat text-mushroom-200 border-mushroom/50 py-8 before:content-[""] before:absolute before:bg-[length:12%] sm:before:bg-auto before:top-0 before:left-0 before:w-[200%] before:h-[200%] before:bg-mushroom-img before:animate-mushroom',
}

const Admonition = ({ title, children, types }: Props) => {
  const isSpecialType = types === 'weed' || types === 'mushroom'
  const theme = themes[types]
  const Icon = isSpecialType ? null : iconMap[types]

  return (
    <div
      className={cn(
        'my-8 rounded-xl border px-5 pb-2 pt-6 text-m leading-relaxed',
        theme,
      )}
    >
      {title && (
        <div className='mb-3 flex items-center gap-1'>
          {Icon && <Icon />}
          <span className='text-base font-bold capitalize tracking-wide'>
            {title}
          </span>
        </div>
      )}
      <div className={cn(isSpecialType && 'not-prose text-center text-base')}>
        {children}
      </div>
    </div>
  )
}

export default Admonition
