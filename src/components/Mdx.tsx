import { useMDXComponent } from 'next-contentlayer/hooks'

interface MdxProps {
  code: string
}

const MyButton: React.FC = () => <button>Click me</button>

const Mdx = ({ code }: MdxProps) => {
  const MDXContent = useMDXComponent(code)

  return (
    <article className='prose-quoteless prose prose-neutral max-w-4xl dark:prose-invert prose-h2:font-semibold'>
      <MDXContent components={{ MyButton }} />
    </article>
  )
}
export default Mdx
