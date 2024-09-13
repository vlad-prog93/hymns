import { useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// стили
import style from './hymn.module.css'

// redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { hymnsSlice } from '../../redux/reducers/HymnSlice'

// utils
import { v4 } from 'uuid'
import { contextSettingsFont } from '../../context/settingsSize'


const Hymn = () => {
  const { currentHymn, isTextWithAccord } = useAppSelector(state => state.hymnReducer)
  const dispatch = useAppDispatch()
  const context = useContext(contextSettingsFont)

  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    !currentHymn && navigate('/')
  }, [currentHymn, navigate])

  useEffect(() => {
    const event = function (e: any) {
      if (e.key === 'ArrowRight') {
        dispatch(hymnsSlice.actions.nextHymn())
        return
      }
      if (e.key === 'ArrowLeft') {
        dispatch(hymnsSlice.actions.prevHymn())
        return
      }
    }
    document.addEventListener('keyup', event)
    return () => document.removeEventListener('keyup', event)
  }, [navigate, dispatch])


  useEffect(() => {
    const isNeedToScroll = ref?.current && window.innerHeight - 50 <= ref?.current?.offsetHeight
    if (isNeedToScroll) {
      dispatch(hymnsSlice.actions.showAutoScroll())
    } else {
      dispatch(hymnsSlice.actions.hideAutoScroll())
    }
  }, [isTextWithAccord, currentHymn])

  return (
    <div ref={ref} className={style.hymn}>
      {!isTextWithAccord
        ?
        currentHymn && Object.keys(currentHymn.text).map((key) => {
          if (key.endsWith(' verse')) {
            return (
              <pre
                key={v4()}
                className={style.hymn__text}
                style={{ fontSize: context.fontSizeText, color: context.colorText }}>
                {key.replace(/ verse/g, '. ')}{currentHymn.text[key].replace(/\n/g, '\n   ')}
              </pre>)
          } else {
            return (
              <pre
                key={v4()}
                className={style.hymn__text}
                style={{ fontSize: context.fontSizeText, color: context.colorText }}>
                {'   '}{currentHymn.text[key].replace(/\n/g, '\n   ')}
              </pre>
            )
          }
        })
        :
        currentHymn && Object.keys(currentHymn.text_with_accords).map((key) => {
          const text = key.endsWith(' verse') ? key.replace(/ verse/g, '. ') + currentHymn.text_with_accords[key] : '   ' + currentHymn.text_with_accords[key]
          return (
            <pre
              key={v4()}
              className={style.hymn__str_text}
              style={{ fontSize: context.fontSizeText, color: context.colorText }}
              dangerouslySetInnerHTML={{
                __html: text.replace(/{[^\}]*\}/g, (v): any => {
                  return `<span class=${style.hymn__str_accord} style="font-size:${context.fontSizeAccord}; color: ${context.colorAccord}" >${v.slice(1, v.length - 1)}</span>`
                }).replace(/\n/g, '\n   ')
              }} />)
        })
      }
    </div>
  )
}

export default Hymn