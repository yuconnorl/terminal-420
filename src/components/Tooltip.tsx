import clsx from 'clsx'

import { OuterSpace, PartyRocket, TrashBin } from './Icons'

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
      <div
        className={clsx(
          isSpaceMode ? 'opacity-100' : 'opacity-30',
          'transition-opacity',
        )}
      >
        <Icon />
      </div>
      <div className='tooltip invisible absolute top-1/2 -translate-x-full -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#383838] px-2 pb-[2px] pt-1 text-xs text-mallard-100 group-hover:visible'>
        <p>{title}</p>
      </div>
    </button>
  )
}

export default Tooltip
