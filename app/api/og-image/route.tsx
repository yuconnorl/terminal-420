import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

// Route segment config
export const runtime = 'edge'

/** Generate OG image */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hasTitle = searchParams.has('title')
    const title = hasTitle ? searchParams.get('title') : 'Not found'

    const notoTcRegular = await fetch(new URL('public/fonts/noto-sans-tc-regular.ttf', import.meta.url))
    const cubic_11 = await fetch(new URL('public/fonts/cubic_11.ttf', import.meta.url))

    if (!notoTcRegular.ok) {
      throw new Error('Failed to fetch the font file for og image')
    }

    if (!cubic_11.ok) {
      throw new Error('Failed to fetch the font file for og image')
    }

    const notoTcRegularData = await notoTcRegular.arrayBuffer()
    const cubic_11Data = await cubic_11.arrayBuffer()

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
          }}
        >
          <div tw='flex flex-col absolute bottom-20 left-20'>
            <div tw='mb-12 text-[3.1rem] leading-[1.3] max-w-4xl' style={{ fontFamily: 'Cubic 11' }}>
              {title}
            </div>
            <div tw='leading-tight text-base opacity-50' style={{ fontFamily: 'Noto Sans TC' }}>
              Terminal 420
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Noto Sans TC',
            data: notoTcRegularData,
            style: 'normal',
          },
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
