'use client'
import { RightOutlined } from '@ant-design/icons'
import './index.css'
import Image from 'next/image'
import icon from '@/assets/trumpet.png'
export default function Detail() {
  return (
    <>
      <div className="detail-container">
        <div className="detail-head">
          <div className="word">chairman</div>
        </div>
        <div className="detail-body">
          <div className="translate">
            n. 主席，会长；董事长
            <div className="soundmark">
              <span>英:[ˈeniweər]</span>
              <Image src={icon} alt="trumpet"></Image>
              <span>美:[ˈeniwer]</span>
              <Image src={icon} alt="trumpet"></Image>
            </div>
          </div>
          <div className="samples">
            <p>例句：He was an admirable chairman.他是位值得尊敬的主席。</p>
          </div>
          <div className="distortion">
            <p>派生词：</p>[ 复数 chairmen 过去式 chairmaned或-manned 过去分词
            chairmaned或-manned 现在分词 chairmaning或-manning 第三人称单数
            chairmans ]
          </div>
          <div className="phrase">
            <p>词组短语：</p>
            board chairmann. 董事长
          </div>
        </div>
        <RightOutlined className="RightOutlined" />
      </div>
    </>
  )
}
