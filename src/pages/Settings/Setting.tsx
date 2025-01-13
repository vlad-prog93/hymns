import { useContext, useEffect, useRef } from 'react'
import style from './Settings.module.css'
import { contextSettingsFont, stateSettingsFont } from '../../context/settingsSize'


const Settings = () => {
  const context = useContext(contextSettingsFont)

  const handleChangeFontSize = (e: any) => {
    e.target.name === 'fontText' && context.setSettingsFont({ ...context, fontSizeText: e.target.value })
    e.target.name === 'fontAccord' && context.setSettingsFont({ ...context, fontSizeAccord: e.target.value })
    e.target.name === 'colorText' && context.setSettingsFont({ ...context, colorText: e.target.value })
    e.target.name === 'colorAccord' && context.setSettingsFont({ ...context, colorAccord: e.target.value })
  }

  return (
    <div className={style.setting}>
      <h3 className={style.setting__title}>Настройки</h3>
      <div className={style.setting__fontContent}>
        <span
          className={style.setting__text}
          style={{ fontSize: context.fontSizeText + 'px' }}>
          Размер шрифта текста: {context.fontSizeText}
        </span>
        <input
          className={style.setting__range}
          name='fontText'
          value={context.fontSizeText}
          onChange={(e) => handleChangeFontSize(e)}
          type="range"
          min="10"
          max="24" />
      </div>

      <div className={style.setting__fontContent}>
        <span
          className={style.setting__text}
          style={{ color: context.colorText }}>
          Цвет текста
        </span>
        <input
          className={style.setting__color}
          value={context.colorText}
          name='colorText'
          onChange={(e) => handleChangeFontSize(e)}
          type="color" />
      </div>

      <div className={style.setting__fontContent}>
        <span
          className={style.setting__text}
          style={{ fontSize: context.fontSizeAccord + 'px' }}>
          Размер шрифта аккордов: {context.fontSizeAccord}
        </span>
        <input
          className={style.setting__range}
          name='fontAccord'
          value={context.fontSizeAccord}
          onChange={(e) => handleChangeFontSize(e)}
          type="range"
          min="10"
          max="24" />
      </div>

      <div className={style.setting__fontContent}>
        <span
          className={style.setting__text}
          style={{ color: context.colorAccord }}>
          Цвет текста

        </span>
        <input
          className={style.setting__color}
          value={context.colorAccord}
          name='colorAccord'
          onChange={(e) => handleChangeFontSize(e)}
          type="color" />
      </div>

      <button onClick={() => context.setSettingsFont({ ...stateSettingsFont })}> По умолчанию</button>

    </div >
  )
}


export default Settings