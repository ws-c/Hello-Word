'use client'
import { Drawer, Switch } from 'antd'
import style from './index.module.css'
import { useSettingStore } from '@/store/settingStore'
interface ChildProps {
  onClose: () => void
}
const Setting: React.FC<ChildProps> = ({ onClose }) => {
  const { isMuted, changeMuted } = useSettingStore()
  const onChange = (checked: boolean) => {
    if (checked) {
      changeMuted()
    } else {
      changeMuted()
    }
  }
  return (
    <>
      <Drawer title="设置" onClose={onClose} open={true}>
        <p className={style.p}>静音</p>
        <Switch onChange={onChange} defaultChecked={isMuted} />
      </Drawer>
    </>
  )
}

export default Setting
