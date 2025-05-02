import clsx from 'clsx'
import Link from 'next/link'

import { Folder } from '@/components/icons'

interface Props {
  category?: string
  count?: number
  isActive?: boolean
  isTitle?: boolean
  categoryDisplayName: string
}

const CategoryLink = ({ category, count, isActive, isTitle, categoryDisplayName }: Props) => (
  <Link
    href={`/categories/${category ? category : ''}`}
    className={clsx(
      'border-opacity-30 flex items-center rounded-xl border border-neutral-50 px-2 py-[2px] font-mono tracking-tight transition-all',
      isActive
        ? 'bg-neutral-50 text-neutral-800'
        : 'hover:bg-opacity-50 text-neutral-600 hover:border-neutral-800 hover:bg-neutral-50 hover:text-neutral-800',
      isTitle ? 'text-sm' : 'text-xs',
    )}
  >
    <Folder />
    <span className='ml-1 tracking-tight'>
      <span>{categoryDisplayName}</span>
      {count && <span className='ml-1'>{`(${count})`}</span>}
    </span>
  </Link>
)

export default CategoryLink
