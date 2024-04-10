import Image from 'next/image'
import './index.css'
import icon from '../../../assets/trumpet.png'
import useGetDate from './hooks/useGetDate'
import { useEffect } from 'react'
export default function Word() {
  const wordList = useGetDate()
  const word = wordList[0]
  console.log(word)
  
  useEffect(()=>{
    fetchData('1', 'happy')
  })
  const fetchData = async (type: string, audio: string) => {
    try {
      const res = await fetch(`/apis/getVoice?url=http://dict.youdao.com/dictvoice?type=${type}&audio=${audio}`);
      console.log(res)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <div className="page-container">
      <div className="word-container">
        <div className="head">
          <span>{word?.cet4_word}</span>
          <p>{word?.cet4_phonetic}</p>
          <div className="icon-container">
            <Image
              // onClick={() => getVoice('1', word?.cet4_word)}
              src={icon}
              alt="trumpet"
              className="icon"
            ></Image>
            <Image src={icon} alt="trumpet" className="icon"></Image>
          </div>
        </div>
        <div className="body">
          {/* <div className="sentence">
            <p>{word?.cet4_samples}</p>
            <p>我祝她生日快乐。</p>
          </div> */}
          <span>认识</span>
          <span>不认识</span>
        </div>
      </div>
    </div>
  )
}
