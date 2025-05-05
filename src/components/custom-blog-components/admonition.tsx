import { Danger, Info, Warn } from '@/components/icons'
import { cn } from '@/lib/utils'

type Status = 'info' | 'warn' | 'danger'

type Props = {
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
  info: 'bg-info/10 text-info border-info/50 prose-strong:font-bold prose-strong:text-info prose-a:hover:opacity-60 prose-a:hover:transition-opacity prose-a:font-bold prose-a:text-info prose-a:underline prose-a:underline-offset-2',
  warn: 'bg-warn/10 text-warn border-warn/50 prose-strong:font-bold prose-strong:text-warn prose-a:hover:opacity-60 prose-a:hover:transition-opacity prose-a:font-bold prose-a:text-warn prose-a:underline prose-a:underline-offset-2',
  danger:
    'bg-danger/10 text-danger border-danger/50 prose-strong:font-bold prose-strong:text-danger prose-a:hover:opacity-60 prose-a:hover:transition-opacity prose-a:font-bold prose-a:text-danger prose-a:underline prose-a:underline-offset-2',
}

const Admonition = ({ title, children, types }: Props) => {
  const theme = themes[types]
  const Icon = iconMap[types]

  return (
    <div className={cn('text-m my-8 rounded-xl border px-5 pt-6 pb-2 leading-relaxed', theme)}>
      {title && (
        <div className='mb-3 flex gap-1'>
          {Icon && (
            <span className='translate-y-0.5'>
              <Icon />
            </span>
          )}
          <span className='font-cubic text-base font-bold tracking-wide capitalize'>{title}</span>
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}

export default Admonition
