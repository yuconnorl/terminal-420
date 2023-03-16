import WeatherIcon from '@/components/WeatherIcon'
import { weatherTypes } from '@/configs/weather'

interface WeatherData {
  success: string
  result: {
    resource_id: string
    fields: {
      id: string
      type: string
    }[]
  }
  records: {
    datasetDescription: string
    location: {
      locationName: string
      weatherElement: {
        elementName: string
        time: {
          startTime: string
          endTime: string
          parameter: {
            parameterName?: string
            parameterUnit: string
            parameterValue?: string
          }
        }[]
      }[]
    }[]
  }
}

interface Result {
  MinT: string
  MaxT: string
  Wx: string
}

async function getWeatherData(): Promise<Result> {
  const AUTHORIZATION_KEY = process.env.AUTHORIZATION_KEY
    ? process.env.AUTHORIZATION_KEY
    : ''

  const url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=臺北市&elementName=Wx,MinT,MaxT`

  try {
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 3 } })
    const data = (await res.json()) as WeatherData

    const weatherElements = data.records.location[0]?.weatherElement
    const resultInitial = { MinT: '', MaxT: '', Wx: '' }
    const result =
      weatherElements?.reduce<Result>((acc, current) => {
        if (current.elementName === 'MinT' || current.elementName === 'MaxT') {
          acc[current.elementName] =
            current?.time[0]?.parameter.parameterName || ''
          return acc
        }
        if (current.elementName === 'Wx')
          acc[current.elementName] =
            current?.time[0]?.parameter.parameterValue || ''
        return acc
      }, resultInitial) || resultInitial

    return result
  } catch (error) {
    console.error(error)
    throw new Error('Failed to retrieve weather data')
  }
}

type WeatherIconType = keyof typeof WeatherIcon

export default async function Weather() {
  const { MinT, MaxT, Wx } = await getWeatherData()

  const weatherCode2Type = (weatherCode: string) => {
    const [weatherType] =
      Object.entries(weatherTypes).find(([weatherType, weatherCodes]) =>
        weatherCodes.includes(Number(weatherCode)),
      ) || []
    return weatherType
  }
  const weatherCode = Wx && weatherCode2Type(Wx)
  const CurrentWeatherIcon =
    weatherCode && WeatherIcon[weatherCode as WeatherIconType]

  return (
    <div className='flex items-center font-mono'>
      <div className='-translate-y-[2px]'>
        {CurrentWeatherIcon && <CurrentWeatherIcon />}
      </div>
      <div className='ml-2'>{MinT && MaxT && `Taipei ${MinT}°C-${MaxT}°C`}</div>
    </div>
  )
}
