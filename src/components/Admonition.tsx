import clsx from 'clsx'

import { ADMONITION_STYLES } from '@/configs/general'

import { Danger, Info, Warn } from './Icons'
type Status = 'info' | 'warn' | 'danger'

interface Props {
  title: string
  children?: React.ReactNode
  types: Status
}

const IconMap = {
  info: Info,
  warn: Warn,
  danger: Danger,
}

const Admonition = ({ title, children, types }: Props) => {
  const color = ADMONITION_STYLES[types]
  const Icon = IconMap[types]

  return (
    <div className={clsx('my-8 rounded-xl border py-4 px-5 text-sm', color)}>
      <div className='mb-3 flex gap-1'>
        <Icon />
        <span className='text-base font-bold capitalize tracking-wide'>
          {title}
        </span>
      </div>
      <div className='not-prose'>{children}</div>
    </div>
  )
}

export default Admonition
