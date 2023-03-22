import clsx from 'clsx'
import Link from 'next/link'

import { Folder } from '@/components/Icon'

interface Props {
  category?: string
  count?: number
  isActive?: boolean
}

const CategoryLink = ({ category, count, isActive }: Props) => (
  <Link
    href={`categories/${category ? category : ''}`}
    className={clsx(
      'flex items-center rounded-xl border border-mallard-50 border-opacity-50 px-2 font-mono text-sm tracking-tight transition-all',
      isActive
        ? 'bg-mallard-50 text-main-black'
        : 'text-main-gray hover:border-main-black hover:bg-mallard-50 hover:bg-opacity-50 hover:text-main-black',
    )}
  >
    <Folder />
    <p className='ml-1'>
      <span>{category}</span>
      {count && <span className='ml-1'>{`(${count})`}</span>}
    </p>
  </Link>
)

export default CategoryLink
