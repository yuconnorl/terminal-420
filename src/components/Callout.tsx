interface CalloutProps extends React.ComponentPropsWithoutRef<'div'> {
  emoji: string
}

const Callout = (props: CalloutProps) => {
  return (
    <div className='my-5 flex rounded-2xl border-2 border-neutral-400/80 px-5 py-3 md:my-8 md:px-6 md:py-4 dark:border-neutral-800/80 dark:bg-main-black'>
      <div className='mr-5 flex w-4 items-center text-2xl md:mr-6'>
        {props.emoji || '💡'}
      </div>
      <div className='not-prose m-0 flex w-full items-center'>
        {props.children}
      </div>
    </div>
  )
}

export default Callout
