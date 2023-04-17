import clsx from 'clsx'

import { Danger, Info, Warn } from './Icons'
type Status = 'info' | 'warn' | 'danger' | 'weed'

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
  weed: 'overflow-hidden relative bg-weed/10 bg-auto bg-repeat text-mallard-50 border-weed/50 py-8 before:content-[""] before:absolute before:bg-[length:12%] sm:before:bg-auto before:top-0 before:left-0 before:w-[200%] before:h-[200%] before:bg-weed-boi before:animate-weed before:translate-x-[0%]',
}

const Admonition = ({ title, children, types }: Props) => {
  const isTypeWeed = types === 'weed'
  const theme = themes[types]
  const Icon = isTypeWeed ? null : iconMap[types]

  return (
    <div className={clsx('my-8 rounded-xl border py-4 px-5 text-sm', theme)}>
      {title && (
        <div className='mb-3 flex gap-1'>
          {Icon && <Icon />}
          <span className='text-base font-bold capitalize tracking-wide'>
            {title}
          </span>
        </div>
      )}
      <div
        className={clsx(
          'not-prose',
          isTypeWeed && 'text-center text-lg font-bold',
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default Admonition
