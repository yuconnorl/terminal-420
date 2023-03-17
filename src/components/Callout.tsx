interface CalloutProps extends React.ComponentPropsWithoutRef<'div'> {
  emoji: string
}

const Callout = (props: CalloutProps) => {
  return (
    <div className='my-5 flex rounded-lg border border-[#3a3536] py-2 px-6 dark:bg-main-black md:my-8 md:py-4 md:px-8'>
      <div className='mr-6 flex w-4 items-center text-2xl md:mr-8'>
        {props.emoji}
      </div>
      <div className='not-prose m-0 w-full'>{props.children}</div>
    </div>
  )
}

export default Callout
