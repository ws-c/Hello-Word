'use server'
import Link from 'next/link'
import './DictList.css'
export default async function DictList() {
  // const res = await fetch('http://localhost:3000/apis/dictionary')
  const res = await fetch('https://hello-word-lime.vercel.app/apis/dictionary')
  const { data } = await res.json()

  return (
    <ul className="DictList-container">
      {data.map((item: any) => (
        <Link href={`/search/${item.cet4_word}`} key={item.id}>
          <li className="DictList-item-container">
            <div>
              <span className="word-id">{item.id}.</span>
              <span className="word">{item.cet4_word}</span>
            </div>
            <div className="right">&gt;</div>
          </li>
        </Link>
      ))}
    </ul>
  )
}
