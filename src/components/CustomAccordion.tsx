'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type Props = {
  title: string
  children: React.ReactNode
}

const CustomAccordion = ({ title, children }: Props) => {
  return (
    <Accordion
      type='single'
      collapsible
      className='not-prose rounded-2xl border border-gray-400/50 px-5'
    >
      <AccordionItem className='border-0' value='item-1'>
        <AccordionTrigger className='m-0'>{title}</AccordionTrigger>
        <AccordionContent className='text-base leading-6'>
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default CustomAccordion
