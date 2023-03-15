const CloudSunny = () => (
  <svg
    className='h-5 w-5'
    strokeWidth='1.4'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M6 13c-1.667 0-5 1-5 5s3.333 5 5 5h12c1.667 0 5-1 5-5s-3.333-5-5-5M12 12a3 3 0 100-6 3 3 0 000 6zM19 9h1M12 2V1M18.5 3.5l-1 1M5.5 3.5l1 1M4 9h1'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
  </svg>
)

const Cloud = () => (
  <svg
    className='h-5 w-5'
    strokeWidth='1.4'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M12 4c-6 0-6 4-6 6-1.667 0-5 1-5 5s3.333 5 5 5h12c1.667 0 5-1 5-5s-3.333-5-5-5c0-2 0-6-6-6z'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinejoin='round'
    ></path>
  </svg>
)

const Fog = () => (
  <svg
    className='h-5 w-5'
    strokeWidth='1.4'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M9 14h6M9 22h6M7 18h10M3.5 17.382C2.188 16.707 1 15.388 1 13c0-4 3.333-5 5-5 0-2 0-6 6-6s6 4 6 6c1.667 0 5 1 5 5 0 2.388-1.188 3.707-2.5 4.382'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
  </svg>
)

const HeavyRain = () => (
  <svg
    className='h-5 w-5'
    strokeWidth='1.4'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M8 13v7M16 13v7M12 15v7M20 17.607c1.494-.585 3-1.918 3-4.607 0-4-3.333-5-5-5 0-2 0-6-6-6S6 6 6 8c-1.667 0-5 1-5 5 0 2.689 1.506 4.022 3 4.607'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
  </svg>
)

const Snow = () => (
  <svg
    className='h-5 w-5'
    strokeWidth='1.4'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M12 12v5m0 5v-5m0 0l-4.5-2.5M12 17l4.5 2.5M12 17l4.5-2.5M12 17l-4.5 2.5M20 17.607c1.494-.585 3-1.918 3-4.607 0-4-3.333-5-5-5 0-2 0-6-6-6S6 6 6 8c-1.667 0-5 1-5 5 0 2.689 1.506 4.022 3 4.607'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
  </svg>
)

const SunLight = () => (
  <svg
    className='h-5 w-5'
    strokeWidth='1.4'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M12 18a6 6 0 100-12 6 6 0 000 12zM22 12h1M12 2V1M12 23v-1M20 20l-1-1M20 4l-1 1M4 20l1-1M4 4l1 1M1 12h1'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
  </svg>
)

const Thunderstorm = () => (
  <svg
    className='h-5 w-5'
    strokeWidth='1.4'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M11.5 12L9 17h6l-2.5 5'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
    <path
      d='M20 17.607c1.494-.585 3-1.918 3-4.607 0-4-3.333-5-5-5 0-2 0-6-6-6S6 6 6 8c-1.667 0-5 1-5 5 0 2.689 1.506 4.022 3 4.607'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
  </svg>
)

const Rain = () => (
  <svg
    className='h-5 w-5'
    strokeWidth='1.4'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M12 14v2M12 20v2M8 18v2M16 18v2M20 17.607c1.494-.585 3-1.918 3-4.607 0-4-3.333-5-5-5 0-2 0-6-6-6S6 6 6 8c-1.667 0-5 1-5 5 0 2.689 1.506 4.022 3 4.607'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
  </svg>
)

const WeatherIconMap = {
  CloudSunny,
  Cloud,
  Fog,
  HeavyRain,
  Snow,
  SunLight,
  Thunderstorm,
  Rain,
}

export default WeatherIconMap
