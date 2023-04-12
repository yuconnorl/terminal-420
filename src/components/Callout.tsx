interface CalloutProps extends React.ComponentPropsWithoutRef<'div'> {
  emoji: string
}

const Callout = (props: CalloutProps) => {
  return (
    <div className='my-5 flex rounded-lg border-2 border-[#3a3536] py-3 px-5 dark:bg-main-black md:my-8 md:py-4 md:px-6'>
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
