'use client'

import { memo, useCallback, useReducer, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import MEQ30Result from './meq-30-result'

type QuestionProps = {
  question: string
  index: number
  selectedValue: string
  handleOptionChange: (index: number, value: string) => void
  category: string
  isSubmitted: boolean
}

const Question = memo(
  ({ question, index, selectedValue, handleOptionChange, category, isSubmitted }: QuestionProps) => {
    const options = ['0', '1', '2', '3', '4', '5']

    const categoryMap = {
      mystical: '密契體驗 (Mystical)',
      'positive-mood': '正面情緒 (Positive mood)',
      'transcendence-of-time-and-space': '超越時間及空間 (Transcendence of time and space)',
      ineffability: '超言說性 (Ineffability)',
    }

    return (
      <div className='flex flex-col gap-2 rounded p-2'>
        <div className='mb-2'>
          {index}. {question}
        </div>
        <RadioGroup
          value={selectedValue}
          onValueChange={(value) => handleOptionChange(index, value)}
          className='flex gap-4'
        >
          {options.map((option) => (
            <div key={option} className='flex items-center space-x-1'>
              <RadioGroupItem value={option} id={`q${index}-option${option}`} />
              <Label htmlFor={`q${index}-option${option}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        {isSubmitted && <Badge className='mt-1'>{categoryMap[category as keyof typeof categoryMap]}</Badge>}
      </div>
    )
  },
)

Question.displayName = 'Question'

const reducer = (state: { [key: number]: string }, action: { type: 'UPDATE'; index: number; value: string }) => {
  if (action.type === 'UPDATE') {
    return { ...state, [action.index]: action.value }
  }
  return state
}

const MEQ30 = () => {
  const subscales = {
    mystical: [4, 5, 6, 9, 14, 15, 16, 18, 20, 21, 23, 24, 25, 26, 28],
    'positive-mood': [2, 8, 12, 17, 27, 30],
    'transcendence-of-time-and-space': [1, 7, 11, 13, 19, 22],
    ineffability: [3, 10, 29],
  }

  const questionsData = [
    {
      question: '喪失原本對於時間的認知',
      index: 1,
      category: 'transcendence-of-time-and-space',
    },
    {
      question: '體驗到驚奇、吃驚的感受',
      index: 2,
      category: 'positive-mood',
    },
    {
      question: '旅程中的體驗無法用現有的詞彙充分描述',
      index: 3,
      category: 'ineffability',
    },
    {
      question: '獲得直覺層面上的深刻認知及體悟',
      index: 4,
      category: 'mystical',
    },
    {
      question: '感受到正在歷經永恆或無限',
      index: 5,
      category: 'mystical',
    },
    {
      question: '和周遭可察覺到的物體或人合而為一',
      index: 6,
      category: 'mystical',
    },
    {
      question: '喪失原本對於空間的認知',
      index: 7,
      category: 'transcendence-of-time-and-space',
    },
    {
      question: '感受到溫柔、關愛',
      index: 8,
      category: 'positive-mood',
    },
    {
      question: '確信曾遭遇到終極實相（ultimate reality）。在旅程中，你可以知曉及看見什麼是真的現實（really real）',
      index: 9,
      category: 'mystical',
    },
    {
      question: '感覺到無法用言語充分表達你所經歷的',
      index: 10,
      category: 'ineffability',
    },
    {
      question: '喪失對於「你在哪」的基本認知',
      index: 11,
      category: 'transcendence-of-time-and-space',
    },
    {
      question: '感受到心靈上的平和，不受外界的紛擾所影響',
      index: 12,
      category: 'positive-mood',
    },
    {
      question: '認知到你處於時間之外，超越過去及未來',
      index: 13,
      category: 'transcendence-of-time-and-space',
    },
    {
      question: '由「自我」這個限制中解放，且與更勝於「你的自我」的某個東西產生連結，或與之合為一體',
      index: 14,
      category: 'mystical',
    },
    {
      question: '認知到你處於更高的精神認知',
      index: 15,
      category: 'mystical',
    },
    {
      question: '體驗到純粹的存在，以及純粹的意識（超越感知印象中的世界）',
      index: 16,
      category: 'mystical',
    },
    {
      question: '體驗到歡愉、狂喜',
      index: 17,
      category: 'positive-mood',
    },
    {
      question: '突然認知到「全部即為一體」的體驗',
      index: 18,
      category: 'mystical',
    },
    {
      question: '處於一個沒有空間界線的領域',
      index: 19,
      category: 'transcendence-of-time-and-space',
    },
    {
      question: '體驗到與「內在世界」相連的一體性',
      index: 20,
      category: 'mystical',
    },
    {
      question: '感受到尊敬',
      index: 21,
      category: 'mystical',
    },
    {
      question: '體驗到永恆',
      index: 22,
      category: 'transcendence-of-time-and-space',
    },
    {
      question:
        '現在你很確信，你在旅程中曾遇見終極實相（ultimate reality）。像是你在過程中曾聽到或看到什麼是真的現實（really real）',
      index: 23,
      category: 'mystical',
    },
    {
      question: '感受到你曾體驗過深刻的神聖與神性',
      index: 24,
      category: 'mystical',
    },
    {
      question: '意識到萬物皆有靈',
      index: 25,
      category: 'mystical',
    },
    {
      question: '體驗到自己和一個更大的整體合而為一',
      index: 26,
      category: 'mystical',
    },
    {
      question: '感受到敬畏',
      index: 27,
      category: 'positive-mood',
    },
    {
      question: '體驗與終極實相（ultimate reality）合而為一',
      index: 28,
      category: 'mystical',
    },
    {
      question: '覺得很難將你的經歷描述給沒有相同經驗的人',
      index: 29,
      category: 'ineffability',
    },
    {
      question: '感受到喜悅',
      index: 30,
      category: 'positive-mood',
    },
  ]

  const [submitted, setSubmitted] = useState(false)

  const [selectedValues, dispatch] = useReducer(
    reducer,
    questionsData.reduce(
      (acc, _, index) => {
        acc[index] = '0'
        return acc
      },
      {} as { [key: number]: string },
    ),
  )

  const handleOptionChange = useCallback((index: number, value: string) => {
    dispatch({ type: 'UPDATE', index, value })
  }, [])

  return (
    <div>
      <div className='mx-auto my-6 flex max-w-3xl flex-col gap-4'>
        {questionsData.map((question) => (
          <Question
            key={question.index}
            question={question.question}
            index={question.index}
            category={question.category}
            selectedValue={selectedValues[question.index] || '0'}
            handleOptionChange={handleOptionChange}
            isSubmitted={submitted}
          />
        ))}
      </div>
      <Button className='mb-4' onClick={() => setSubmitted(true)}>
        填完了！
      </Button>
      {submitted && <MEQ30Result rawData={selectedValues} />}
    </div>
  )
}

export default MEQ30
