import clsx from 'clsx'
import Link from 'next/link'

import { Folder } from '@/components/Icons'

interface Props {
  category?: string
  count?: number
  isActive?: boolean
  isTitle?: boolean
  categoryDisplayName: string
}

const CategoryLink = ({
  category,
  count,
  isActive,
  isTitle,
  categoryDisplayName,
}: Props) => (
  <Link
    href={`categories/${category ? category : ''}`}
    className={clsx(
      'flex items-center rounded-xl border border-mallard-50 border-opacity-30 px-2 py-[1px] font-mono tracking-tight transition-all',
      isActive
        ? 'bg-mallard-50 text-main-black'
        : 'text-main-gray hover:border-main-black hover:bg-mallard-50 hover:bg-opacity-50 hover:text-main-black',
      isTitle ? 'text-sm' : ' text-xs',
    )}
  >
    <Folder />
    <p className='ml-1'>
      <span>{categoryDisplayName}</span>
      {count && <span className='ml-1'>{`(${count})`}</span>}
    </p>
  </Link>
)

export default CategoryLink
