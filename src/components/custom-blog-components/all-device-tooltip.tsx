'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { Tooltip, TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

// source: [Tooltip trigger onMobile](https://github.com/shadcn-ui/ui/issues/86#issuecomment-2241817826)

const AllDeviceTooltip = ({
  content,
  children,
  className,
}: React.PropsWithChildren<{ content: string | React.ReactNode; className?: string }>) => {
  const [open, setOpen] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={open}>
        <TooltipTrigger asChild>
          <button
            type='button'
            className={cn('cursor-pointer text-[#8c796a] hover:opacity-70 dark:text-[#c3bbae]', className)}
            onClick={() => setOpen(!open)}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            // onTouchStart={() => setOpen(!open)}
          >
            {children}
            <sup className='text-sm'>💡</sup>
          </button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            className={
              !content
                ? 'hidden'
                : 'max-w-[200px] bg-neutral-800 text-neutral-200 dark:bg-pale-white dark:text-neutral-800'
            }
            sideOffset={5}
          >
            <span className='inline-block text-sm'>{content}</span>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  )
}

export default AllDeviceTooltip
