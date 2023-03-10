'use client'
import Giscus from '@giscus/react'

import { giscusConfig } from '@/configs/giscus'

const CommentSection = () => (
  <div className=''>
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
