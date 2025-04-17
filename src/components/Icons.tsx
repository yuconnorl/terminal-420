import { cn } from '@/lib/utils'

export const RightUpArrow = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    className='h-3 w-3 fill-current text-slate-200'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244'
    />
  </svg>
)

export const SquareRightUpArrow = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='1.5'
    stroke='currentColor'
    className='ml-[2px] mt-[6px] h-4 w-4 text-slate-200'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
    />
  </svg>
)

export const RoundRightUpArrow = () => (
  <svg
    className='ml-[3px] mr-[3.5px] mt-[3.5px] h-5 w-5 text-slate-200'
    strokeWidth='1'
    stroke='currentColor'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
  >
    <path
      d='m9.171 14.828 5.657-5.656m0 0h-4.95m4.95 0v4.95M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

export const TrashBin = () => (
  <svg
    className='h-8 w-8'
    viewBox='0 0 32 32'
    stroke='currentColor'
    strokeOpacity={0.7}
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='Frame 3'>
      <path
        id='bin-bottom'
        d='M18.99 12.7505L18.644 21.7505M13.856 21.7505L13.51 12.7505M23.478 9.54053L22.41 23.4235C22.3664 23.9888 22.111 24.5167 21.695 24.9018C21.279 25.2869 20.7329 25.5007 20.166 25.5005H12.334C11.7671 25.5007 11.221 25.2869 10.805 24.9018C10.3889 24.5167 10.1336 23.9888 10.09 23.4235L9.02197 9.54053'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        id='lid'
        d='M24.5 9.70652C24.16 9.64752 23.82 9.59252 23.478 9.54052C22.3239 9.36604 21.1638 9.23362 20 9.14352M20 9.14352V8.22752C20 7.04752 19.09 6.06352 17.91 6.02652C16.8036 5.99116 15.6964 5.99116 14.59 6.02652C13.41 6.06352 12.5 7.04852 12.5 8.22752V9.14352M20 9.14352C17.5037 8.9506 14.9963 8.9506 12.5 9.14352M8 9.70552C8.34 9.64652 8.68 9.59152 9.022 9.54052C10.1761 9.36604 11.3362 9.23362 12.5 9.14352'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </g>
  </svg>
)

export const OuterSpace = () => (
  <svg
    className='h-8 w-8'
    viewBox='0 0 32 32'
    fill='none'
    stroke='currentColor'
    strokeOpacity={0.7}
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='earth'>
      <path
        id='Vector'
        d='M16.7502 7.02998V7.59798C16.7502 7.93198 16.8982 8.24798 17.1552 8.46198L18.2232 9.35198C18.6652 9.72098 18.7582 10.362 18.4392 10.842L17.9292 11.608C17.6514 12.0242 17.2429 12.336 16.7682 12.494L16.6252 12.542C16.4638 12.5959 16.317 12.6863 16.1963 12.8062C16.0755 12.9261 15.9841 13.0722 15.9289 13.2331C15.8738 13.3941 15.8565 13.5656 15.8784 13.7343C15.9003 13.903 15.9608 14.0644 16.0552 14.206C16.4242 14.761 16.2242 15.513 15.6282 15.811L13.0002 17.125L13.4232 18.184C13.5085 18.3991 13.5129 18.6378 13.4356 18.8559C13.3582 19.074 13.2044 19.2566 13.0027 19.3699C12.801 19.4833 12.565 19.5196 12.3385 19.4721C12.112 19.4247 11.9105 19.2967 11.7712 19.112L11.0922 18.206C10.9771 18.0526 10.8247 17.9312 10.6495 17.8533C10.4744 17.7754 10.2822 17.7435 10.0912 17.7608C9.90026 17.778 9.71688 17.8437 9.55848 17.9518C9.40008 18.0598 9.27192 18.2065 9.18615 18.378L8.50015 19.75L7.88815 19.903M16.7502 7.02998C15.1692 6.89731 13.5813 7.18591 12.1473 7.86462C10.7133 8.54334 9.48421 9.58906 8.58455 10.8958C7.68489 12.2026 7.14664 13.7239 7.02434 15.3057C6.90204 16.8875 7.20005 18.4735 7.88815 19.903M16.7502 7.02998C18.3178 7.16072 19.8239 7.7011 21.1181 8.59534C22.4124 9.48958 23.4496 10.7074 24.1265 12.1275C24.8033 13.5476 25.0962 15.1203 24.9757 16.6888C24.8553 18.2573 24.3259 19.7669 23.4402 21.067L23.2632 20.538C23.1137 20.09 22.8271 19.7004 22.4439 19.4243C22.0607 19.1483 21.6004 18.9998 21.1282 19H20.5002L20.1762 18.676C20.0134 18.513 19.8142 18.391 19.5951 18.3201C19.3759 18.2492 19.143 18.2314 18.9156 18.2682C18.6882 18.3051 18.4728 18.3954 18.2872 18.5319C18.1016 18.6683 17.9511 18.8469 17.8482 19.053L17.8122 19.126C17.7139 19.3226 17.5759 19.4967 17.4069 19.6372C17.2378 19.7776 17.0414 19.8814 16.8302 19.942L15.8402 20.224C15.2902 20.381 14.9462 20.926 15.0402 21.491L15.1132 21.929C15.1932 22.403 15.6032 22.75 16.0832 22.75C16.9292 22.75 17.6812 23.292 17.9482 24.095L18.1632 24.738M7.88815 19.903C8.78456 21.7668 10.2955 23.265 12.1668 24.1455C14.0382 25.0261 16.1557 25.2353 18.1632 24.738M18.1632 24.738C20.3131 24.2046 22.1913 22.8981 23.4392 21.068M19.7502 13C19.7502 13.896 19.3572 14.7 18.7342 15.25'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </g>
  </svg>
)

export const PartyRocket = () => (
  <svg
    className='h-8 w-8'
    viewBox='0 0 32 32'
    fill='none'
    stroke='currentColor'
    strokeOpacity={0.7}
    xmlns='http://www.w3.org/2000/svg'
  >
    <g>
      <path
        id='rocket'
        d='M19.34 18.12C19.5482 19.0011 19.5544 19.9178 19.358 20.8016C19.1616 21.6854 18.7677 22.5133 18.2059 23.2232C17.6441 23.9332 16.9289 24.5068 16.114 24.9011C15.299 25.2954 14.4053 25.5001 13.5 25.5V20.7M19.34 18.12C21.2499 16.7288 22.8036 14.9055 23.8742 12.7991C24.9447 10.6927 25.5019 8.36287 25.5 6C23.1373 5.9983 20.8077 6.55549 18.7015 7.62607C16.5952 8.69665 14.7721 10.2503 13.381 12.16M19.34 18.12C17.6019 19.3913 15.6103 20.2714 13.5 20.7M13.5 20.7C13.397 20.721 13.293 20.741 13.189 20.76C12.2818 20.0406 11.4604 19.2192 10.741 18.312C10.7599 18.2078 10.7789 18.1038 10.8 18M13.381 12.16C12.4999 11.9516 11.583 11.9453 10.6991 12.1416C9.81516 12.338 8.98714 12.7318 8.27707 13.2936C7.567 13.8554 6.9933 14.5707 6.59895 15.3857C6.2046 16.2008 5.99984 17.0946 6 18H10.8M13.381 12.16C12.1099 13.8978 11.2288 15.89 10.8 18M20.25 12.75C20.25 13.1478 20.092 13.5294 19.8107 13.8107C19.5294 14.092 19.1478 14.25 18.75 14.25C18.3522 14.25 17.9706 14.092 17.6893 13.8107C17.408 13.5294 17.25 13.1478 17.25 12.75C17.25 12.3522 17.408 11.9706 17.6893 11.6893C17.9706 11.408 18.3522 11.25 18.75 11.25C19.1478 11.25 19.5294 11.408 19.8107 11.6893C20.092 11.9706 20.25 12.3522 20.25 12.75Z'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        id='fire'
        d='M8.56098 20.39C7.90316 20.8792 7.39171 21.539 7.08201 22.298C6.7723 23.057 6.67616 23.8863 6.80398 24.696C7.61381 24.8237 8.44314 24.7274 9.20216 24.4175C9.96117 24.1077 10.6209 23.596 11.11 22.938'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </g>
  </svg>
)

export const Folder = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.3}
    stroke='currentColor'
    className='h-3 w-3'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776'
    />
  </svg>
)

// export const Chevron = () => (
//   <svg
//     xmlns='http://www.w3.org/2000/svg'
//     fill='none'
//     viewBox='0 0 24 24'
//     strokeWidth={2}
//     stroke='currentColor'
//     className='h-4 w-4'
//   >
//     <path
//       strokeLinecap='round'
//       strokeLinejoin='round'
//       d='M4.5 15.75l7.5-7.5 7.5 7.5'
//     />
//   </svg>
// )

export const Chevron = ({ className }: { className: string }) => (
  <svg
    className={`h-5 w-5 ${className}`}
    viewBox='0 0 24 24'
    stroke='currentColor'
    xmlns='http://www.w3.org/2000/svg'
    strokeWidth={1.5}
  >
    <g id='Frame'>
      <path
        className='transition-transform'
        id='down'
        d='M8 14.5L11.75 18.25L15.5 14.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        className='transition-transform'
        id='up'
        d='M8.25 8.75L12 5L15.75 8.75'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </g>
  </svg>
)

export const Info = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.3}
    stroke='currentColor'
    className='h-5 w-5'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z'
    />
  </svg>
)

export const Warn = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.3}
    stroke='currentColor'
    className='h-5 w-5'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
    />
  </svg>
)

export const Danger = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.3}
    stroke='currentColor'
    className='h-5 w-5'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z'
    />
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z'
    />
  </svg>
)

export const Sun = ({ className }: { className: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className={cn('size-6', className)}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z'
    />
  </svg>
)

export const Moon = ({ className }: { className: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className={cn('size-6', className)}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z'
    />
  </svg>
)
