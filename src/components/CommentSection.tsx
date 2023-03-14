'use client'
import Giscus from '@giscus/react'

import { giscusConfig } from '@/configs/giscus'

const CommentSection = () => (
  <div className='border-t border-t-mallard-50 border-opacity-40 py-16'>
    <h1 className='mb-5 font-mono text-3xl font-bold'>Comment</h1>
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
      theme='dark'
      lang='en'
      loading='lazy'
    />
  </div>
)

export default CommentSection
