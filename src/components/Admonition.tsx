import { cn } from '@/lib/utils'

import { Danger, Info, Warn } from './Icons'
type Status = 'info' | 'warn' | 'danger'

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
}

const Admonition = ({ title, children, types }: Props) => {
  const theme = themes[types]
  const Icon = iconMap[types]

  return (
    <div className={cn('text-m my-8 rounded-xl border px-5 pt-6 pb-2 leading-relaxed', theme)}>
      {title && (
        <div className='mb-3 flex gap-1'>
          {Icon && <Icon />}
          <span className='text-base font-bold tracking-wide capitalize'>{title}</span>
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}

export default Admonition
