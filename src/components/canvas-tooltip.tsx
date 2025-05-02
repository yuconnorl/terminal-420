import clsx from 'clsx'

import { OuterSpace, PartyRocket, TrashBin } from './icons'

interface Props {
  title: string
  icon: keyof typeof IconMap
  isSpaceMode?: boolean
  onClick: (event: React.MouseEvent<HTMLElement>) => void
}

const IconMap = {
  OuterSpace,
  PartyRocket,
  TrashBin,
}

const Tooltip = ({ title, onClick, icon, isSpaceMode }: Props) => {
  const Icon = IconMap[icon]

  return (
    <button className='group relative' type='button' onClick={onClick}>
      <div className={clsx(isSpaceMode ? 'opacity-100' : 'opacity-30', 'transition-opacity')}>
        <Icon />
      </div>
      <div className='tooltip invisible absolute top-1/2 -translate-x-full -translate-y-1/2 rounded-lg bg-[#383838] px-2 pt-1 pb-[2px] text-xs whitespace-nowrap text-neutral-100 group-hover:visible'>
        <p>{title}</p>
      </div>
    </button>
  )
}

export default Tooltip
