import { useParams } from 'react-router-dom'
import { v4 } from 'uuid'
// styles
import style from './EditHymn.module.css'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { hymnsSlice } from '../../redux/reducers/HymnSlice'
import { IHymn } from '../../models/hymns'

const EditHymn = () => {
  const params = useParams()

  const { hymns } = useAppSelector(state => state.hymnReducer)
  const [editHymn, setEditHymn] = useState<IHymn | null>()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const hymn = hymns.find(hymn => hymn._id === params.id)
    if (hymn) {
      setEditHymn(hymn)
    }
  }, [params])

  const handleTranslate = (key: string): string => {
    const translatedKey = key.replace(/verse/g, 'куплет').replace(/bridge/g, 'куплет-припев').replace(/chorus/g, 'припев')
    return translatedKey
  }

  const changeViewTextHymn = (text: string) => {
    const rows_text = text.split('\n')
    const res = rows_text.map((str) => {
      let shift = 0
      let text_accords = []
      const obj: any = {}
      let text_without_accords = str
      while (text_without_accords.match(/{[^\}]*\}/)) {
        text_without_accords = text_without_accords.replace(/{[^\}]*\}/, (match: string) => {
          const a = match.replace(/{/, '').replace(/}/, '')
          if (a) {
            obj[text_without_accords.indexOf(match) - 1 - shift] = a
            shift = shift + a.length - 1
          }
          return ''
        })
      }
      for (let key in obj) {
        text_accords[Number(key)] = obj[key]
      }

      text_accords = Array.from(text_accords, el => !el ? ' ' : el)

      return text_accords.join('') + '\n' + text_without_accords
    })
    return res.join('\n')
  }

  return (
    <section className={style.editHymn}>
      <h4 className={style.editHymn__title}>
        Редактируемый гимн
      </h4>
      <div className={style.editHymn__inputContainer}>
        <label className={style.editHymn__label}>Коллекция</label>
        <input className={style.editHymn__input} type="text" value={editHymn?.collection} />

      </div>
      <div className={style.editHymn__inputContainer}>
        <label className={style.editHymn__label}>Номер</label>
        <input className={style.editHymn__input} type="text" value={editHymn?.number} />

      </div>
      {editHymn
        &&
        Object.keys(editHymn?.text_with_accords).map((key, index, arr) => {
          return (
            <div key={v4()} className={style.editHymn__inputContainer}>
              <input type='text' value={handleTranslate(key)} />
              <textarea
                className={style.editHymn__textarea}
                rows={arr.length * 4}
              >
                {changeViewTextHymn(editHymn.text_with_accords[key])}
              </textarea>
            </div >
          )
        })}

    </section>
  )
}

export default EditHymn