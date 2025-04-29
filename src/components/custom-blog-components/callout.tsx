interface CalloutProps extends React.ComponentPropsWithoutRef<'div'> {
  emoji: string
}

const Callout = (props: CalloutProps) => {
  return (
    <div className='my-5 flex rounded-2xl bg-neutral-50 px-5 py-4 text-neutral-600 md:my-8 md:px-6 md:py-5 dark:border dark:border-neutral-800/50 dark:bg-neutral-900 dark:text-neutral-200'>
      <div className='mr-5 flex w-4 items-center text-2xl md:mr-6'>{props.emoji || '💡'}</div>
      <div className='not-prose m-0 flex w-full items-center'>{props.children}</div>
    </div>
  )
}

export default Callout
