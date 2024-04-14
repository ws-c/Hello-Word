import React from 'react'
import { Button, Popover } from 'antd'
import './index.css'
const content = (
  <div>
    <p>Z：英式发音</p>
    <p>X：美式发音</p>
    <p>左方向键：认识</p>
    <p>右方向键：不认识</p>
  </div>
)

const Prompt: React.FC = () => (
  <div className="prompt">
    <Popover content={content} placement="bottom">
      <Button type="dashed" className='prompt-btn'>快捷键</Button>
    </Popover>
  </div>
)

export default Prompt
