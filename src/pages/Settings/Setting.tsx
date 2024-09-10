import { useContext, useEffect } from 'react'
import style from './Settings.module.css'
import { contextSettingsFont } from '../../context/settingsSize'


const Settings = () => {
  const context = useContext(contextSettingsFont)

  const handleChangeFontSize = (e: any) => {
    e.target.name === 'text' && context.setSettingsFont({ ...context, fontSizeText: e.target.value.toString() + 'px' })
    e.target.name === 'accord' && context.setSettingsFont({ ...context, fontSizeAccord: e.target.value.toString() + 'px' })
  }

  return (
    <div className={style.setting}>
      <div className={style.setting__fontSize}>
        <span style={{ fontSize: context.fontSizeText }}>Размер шрифта текста: {context.fontSizeText}</span>
        <input name='text' defaultValue={context.fontSizeText} onChange={(e) => handleChangeFontSize(e)} type="range" min={10} max={24} />
      </div>

      <div className={style.setting__fontSize}>
        <span style={{ fontSize: context.fontSizeAccord }}>Размер шрифта аккордов: {context.fontSizeAccord}</span>
        <input name='accord' defaultValue={context.fontSizeAccord} onChange={(e) => handleChangeFontSize(e)} type="range" min={10} max={24} />
      </div>

    </div>
  )
}


export default Settings