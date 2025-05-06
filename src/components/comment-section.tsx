'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'

import { giscusConfig } from '@/configs/giscus'

const CommentSection = () => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className='pt-6 pb-8 md:pt-8 md:pb-10 dark:border-neutral-600'>
      <Giscus
        id='comments'
        repo={giscusConfig.repo}
        repoId={giscusConfig.repoId}
        category={giscusConfig.category}
        categoryId={giscusConfig.categoryId}
        mapping='pathname'
        term='Welcome to @giscus/react component!'
        reactionsEnabled='1'
        emitMetadata='0'
        inputPosition='top'
        theme={resolvedTheme}
        lang='en'
      />
    </div>
  )
}

export default CommentSection
