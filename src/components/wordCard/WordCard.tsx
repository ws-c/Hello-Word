import React, { useState } from 'react'

interface WordDetailProps {
  word: any
}

const WordCard: React.FC<WordDetailProps> = ({ word }) => {
  const [activeTab, setActiveTab] = useState<number>(1)

  const handleTabChange = (tab: number) => {
    setActiveTab(tab)
  }

  return (
    <div>
      <div className="tab-menu">
        <button
          className={`tab-btn ${activeTab === 1 && 'active'}`}
          onClick={() => handleTabChange(1)}
        >
          例句
        </button>
        <button
          className={`tab-btn ${activeTab === 2 && 'active'}`}
          onClick={() => handleTabChange(2)}
        >
          词组短语
        </button>
        <button
          className={`tab-btn ${activeTab === 3 && 'active'}`}
          onClick={() => handleTabChange(3)}
        >
          派生词
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 1 && (
          <div className="samples">
            {word?.cet4_samples.map((item: any, index: number) => {
              const splitItems = item.replace(/[.?]/g, '\n').split('\n')
              return (
                <div key={item} className="samples-item">
                  <p style={{ marginRight: '8px' }}>{index + 1}. </p>
                  <div>
                    {splitItems.map((splitItem: any, splitIndex: number) => (
                      <p key={splitIndex}>
                        {splitItem}
                        {splitIndex === 0 ? '.' : null}
                      </p>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {activeTab === 2 && (
          <div className="phrase">
            <div className="phrase-list">
              {word?.cet4_phrase.map((item: any) => (
                <div key={item}>
                  <span>{item}</span>
                  <i>|</i>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 3 && (
          <div className="distortion"> {word?.cet4_distortion}</div>
        )}
      </div>
    </div>
  )
}

export default WordCard
