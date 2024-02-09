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
    <Accordion className='left-0' type='single' collapsible>
      <AccordionItem value='item-1'>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default CustomAccordion
