import { IS_DEV } from '@/configs/general'

import pkg from '../../package.json'

const versionLogger = (bgColor: string) => {
  const version = IS_DEV
    ? 'development'
    : process.env.REACT_APP_VERSION || pkg.version

  console.log(
    `%c${'Terminal-420'}%c${version}`,
    `background: ${bgColor}; color: #f5f8f1; padding: 2px 4px; border-radius: 3px 0 0 3px;`,
    'background: #1d1b1b; color: #f5f8f1; padding: 2px 4px; border-radius: 0 3px 3px 0;',
  )
}

export default versionLogger
