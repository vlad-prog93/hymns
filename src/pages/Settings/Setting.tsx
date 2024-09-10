import { useContext, useEffect } from 'react'
import style from './Settings.module.css'
import { contextSettingsFont, stateSettingsFont } from '../../context/settingsSize'


const Settings = () => {
  const context = useContext(contextSettingsFont)

  const handleChangeFontSize = (e: any) => {
    e.target.name === 'fontText' && context.setSettingsFont({ ...context, fontSizeText: e.target.value.toString() + 'px' })
    e.target.name === 'fontAccord' && context.setSettingsFont({ ...context, fontSizeAccord: e.target.value.toString() + 'px' })
    e.target.name === 'colorText' && context.setSettingsFont({ ...context, colorText: e.target.value })
    e.target.name === 'colorAccord' && context.setSettingsFont({ ...context, colorAccord: e.target.value })
  }

  useEffect(() => {

  }, [])

  return (
    <div className={style.setting}>
      <div className={style.setting__fontSize}>
        <span style={{ fontSize: context.fontSizeText }}>Размер шрифта текста: {context.fontSizeText}</span>
        <input name='fontText' defaultValue={context.fontSizeText} onChange={(e) => handleChangeFontSize(e)} type="range" min={10} max={24} />
      </div>

      <div className={style.setting__fontSize}>
        <span style={{ color: context.colorText }}>Цвет текста</span>
        <input defaultValue={context.colorText} name='colorText' onChangeCapture={(e) => handleChangeFontSize(e)} type="color" />
      </div>

      <div className={style.setting__fontSize}>
        <span style={{ fontSize: context.fontSizeAccord }}>Размер шрифта аккордов: {context.fontSizeAccord}</span>
        <input name='fontAccord' defaultValue={context.fontSizeAccord} onChange={(e) => handleChangeFontSize(e)} type="range" min={10} max={24} />
      </div>

      <div className={style.setting__fontSize}>
        <span style={{ color: context.colorAccord }}>Цвет текста</span>
        <input defaultValue={context.colorText} name='colorAccord' onChangeCapture={(e) => handleChangeFontSize(e)} type="color" />
      </div>

      <button onClick={() => context.setSettingsFont(stateSettingsFont)}>По умолчанию</button>

    </div>
  )
}


export default Settings