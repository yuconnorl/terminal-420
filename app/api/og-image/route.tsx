import fs from 'fs'
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import path from 'path'

// Route segment config
export const runtime = 'nodejs'

const cubic11Data = fs.readFileSync(path.join(process.cwd(), 'public/fonts/cubic_11.woff'))
const notoSansTcData = fs.readFileSync(path.join(process.cwd(), 'public/fonts/noto-sans-tc-regular.ttf'))

/** Generate OG image */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hasTitle = searchParams.has('title')
    const title = hasTitle ? searchParams.get('title') : 'Not found'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            backgroundColor: 'white',
            fontFamily: 'Cubic 11',
          }}
        >
          <div tw='flex flex-col absolute bottom-20 left-20'>
            <div tw='mb-6 max-w-4xl text-[3.1rem] leading-[1.3]'>{title}</div>
            <div style={{ fontFamily: 'Cubic 11' }} tw='text-lg leading-tight opacity-50'>
              mind agonist
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate=86400',
        },
        fonts: [
          {
            name: 'Cubic 11',
            data: cubic11Data,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Noto Sans TC',
            data: notoSansTcData,
            style: 'normal',
            weight: 400,
          },
        ],
      },
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(`Failed to generate og image: ${e.message}`)
    return new Response(`Failed to generate og image`, {
      status: 500,
    })
  }
}
