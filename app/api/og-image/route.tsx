import fs from 'fs'
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

// Route segment config
export const runtime = 'nodejs'

/** Generate OG image */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hasTitle = searchParams.has('title')
    const title = hasTitle ? searchParams.get('title') : 'Not found'

    const cubic_11 = fs.readFileSync('public/fonts/cubic_11.woff')
    const cubic_11Data = cubic_11

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
            <div tw='mb-6 text-[3.1rem] leading-[1.3] max-w-4xl'>{title}</div>
            <div tw='leading-tight text-lg opacity-50'>Terminal 420</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Cubic 11',
            data: cubic_11Data,
            style: 'normal',
          },
        ],
      },
    )
  } catch (e: any) {
    console.log(`Failed to generate og image: ${e.message}`)
    return new Response(`Failed to generate og image`, {
      status: 500,
    })
  }
}
