'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartConfig = {
  label: {
    color: '#fff',
  },
  score: {
    label: 'score',
    color: '#fff',
  },
} satisfies ChartConfig

export default function MEQ30Result({ rawData }: { rawData: any }) {
  const categoryMap = {
    mystical: '密契體驗 (%)',
    'positive-mood': '正面情緒 (%)',
    'transcendence-of-time-and-space': '超越時間及空間 (%)',
    ineffability: '超言說性 (%)',
  }

  const subscaleMap = {
    mystical: [4, 5, 6, 9, 14, 15, 16, 18, 20, 21, 23, 24, 25, 26, 28],
    'positive-mood': [2, 8, 12, 17, 27, 30],
    'transcendence-of-time-and-space': [1, 7, 11, 13, 19, 22],
    ineffability: [3, 10, 29],
  }

  const chartData = [
    { subscale: 'mystical', score: 0 },
    { subscale: 'positive-mood', score: 0 },
    { subscale: 'transcendence-of-time-and-space', score: 0 },
    { subscale: 'ineffability', score: 0 },
  ]

  Object.entries(subscaleMap).forEach(([subscale, questions]) => {
    const totalScore = questions.reduce((sum, qNum) => {
      return sum + Number(rawData[qNum.toString()] || 0)
    }, 0)
    const item = chartData.find((d) => d.subscale === subscale)
    if (item) {
      item.score = totalScore
    }
  })

  const chartDataNormalised = chartData.map((d) => ({
    ...d,
    scorePercentage: Math.round((d.score / (subscaleMap[d.subscale as keyof typeof subscaleMap].length * 5)) * 100),
  }))

  const isCompleteMythicalExperience = chartDataNormalised.every((d) => d.scorePercentage >= 60)

  return (
    <Card className='border-neutral-200 bg-neutral-50 dark:border-neutral-200 dark:bg-neutral-50'>
      <CardHeader>
        <CardTitle>MEQ-30 Result</CardTitle>
        <CardDescription className='font-cubic'>密契體驗問卷結果</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-2 md:flex-row'>
        <ChartContainer className='flex-[1_1_0]' config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartDataNormalised}
            layout='vertical'
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey='subscale'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey='scorePercentage' type='number' hide domain={[0, 105]} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideIndicator
                  labelFormatter={(value) => {
                    return categoryMap[value as keyof typeof categoryMap]
                  }}
                />
              }
            />
            <Bar dataKey='scorePercentage' layout='vertical' fill='var(--color-lime-300)' radius={4}>
              <LabelList
                dataKey='subscale'
                position='insideLeft'
                offset={8}
                className='fill-neutral-800'
                fontSize={12}
              />
            </Bar>
            <ReferenceLine
              x={60}
              stroke='var(--color-red-500)'
              strokeDasharray='3 3'
              ifOverflow='extendDomain'
              label={{ value: 'Threshold', position: 'insideTop', fill: 'var(--color-red-600)' }}
              isFront
              strokeWidth={2}
            />
          </BarChart>
        </ChartContainer>
        <ChartContainer className='flex-[1_1_0]' config={chartConfig}>
          <RadarChart data={chartDataNormalised}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey='subscale' />
            <PolarRadiusAxis domain={[0, 110]} />
            <PolarGrid />
            <Radar
              dataKey='scorePercentage'
              fill='var(--color-lime-300)'
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        {isCompleteMythicalExperience && (
          <div className='flex flex-col items-start font-cubic'>
            <span>完整的密契體驗</span>
            <span>complete mystical experiences</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
