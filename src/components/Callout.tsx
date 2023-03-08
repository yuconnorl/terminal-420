interface CalloutProps extends React.ComponentPropsWithoutRef<'div'> {
  emoji: string
}

const Callout = (props: CalloutProps) => {
  return (
    <div className='my-8 flex rounded-lg border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-800 dark:bg-neutral-900'>
      <div className='mr-4 flex w-4 items-center'>{props.emoji}</div>
      <div className='w-full'>{props.children}</div>
    </div>
  )
}

export default Callout
