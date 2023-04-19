import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About',
  description: "Hi! I'm Yu-Chun Liu, frontend developer based in Taiwan",
}

const AboutPage = () => {
  return (
    <section className='prose prose-only-dark relative w-full max-w-3xl pt-8 3xl:max-w-4xl'>
      <article>
        <div className='font-bold'>
          <h1 className='m-0 text-4xl lg:text-5xl'>
            Hi there, welcome to Terminal 420.
          </h1>
          <h2 className='my-3 text-3xl lg:text-4xl'>
            Pull up a chair and have fun!
          </h2>
        </div>
        <Image
          src='/images/weed-boi-3d.png'
          width={1524}
          height={857}
          alt='weed boi'
          priority
        />
        <p>嗨，歡迎來到 Terminal 420！</p>
        <p>
          我是生物背景的前端工程師 YC
          Liu，所以你會在這邊看到技術文章（可能也沒什麼技術成份）外，還有一些和動植物有關、酷酷生物們的新研究進展或回顧之類的閒聊。
        </p>
        <div>
          <p className='text-xl font-bold'>為什麼這裡叫做 Terminal 420</p>
          <p>抵達航廈 (Terminal)，然後起飛！</p>
          <p className='text-xl font-bold'>為什麼文章裡面這麼多奇怪的 quotes</p>
          <p>
            過去玩過的遊戲語音，聽過幾次就深植腦袋瓜當中趕也趕不走，還因此學了很多奇怪的英文單字（或許是學英文的好方法？）所以那些
            quotes
            幾乎都是某些遊戲內出現過的語音，然後在寫文章遇到那些關鍵字的時候，腦中自然反射出現的旁白。
          </p>
          <p className='text-xl font-bold'>上面那個綠綠的小傢伙是誰</p>
          <p>
            他是 Weed boi！也是 Terminal 420
            的門面擔當，常駐在右下角並提醒你該清醒了。
          </p>
        </div>
      </article>
    </section>
  )
}

export default AboutPage
