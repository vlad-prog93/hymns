import { useNavigate, useParams } from 'react-router-dom'
import { v4 } from 'uuid'
// styles
import style from './EditHymn.module.css'
import React, { TextareaHTMLAttributes, useEffect, useId, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { hymnsSlice } from '../../redux/reducers/HymnSlice'
import { IHymn } from '../../models/hymns'
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'

const EditHymn = () => {
  const params = useParams()
  const navigate = useNavigate()
  const idCol = useId()
  const idNum = useId()

  const { hymns } = useAppSelector(state => state.hymnReducer)
  const [editHymn, setEditHymn] = useState<IHymn | null>()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const hymn: IHymn | undefined = hymns.find(hymn => hymn._id === params.id)
    if (hymn) {

      setEditHymn({ ...hymn, text_with_accords: changeViewTextHymn(hymn.text_with_accords) })
    } else {
      navigate('/')
    }
  }, [params])

  const handleTranslate = (key: string): string => {
    const translatedKey = key.replace(/verse/g, 'куплет').replace(/bridge/g, 'куплет-припев').replace(/chorus/g, 'припев')
    return translatedKey
  }

  const changeViewTextHymn = (obj: { [key: string]: string }) => {
    const result = { ...obj }
    Object.keys(result).forEach((key) => {

      const rows_text = result[key].split('\n')
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


        let text_accords_long: any = []
        for (let i of text_accords) {
          if (!i) {
            text_accords_long.push(' ')
          } else {
            text_accords_long.push(i)
          }
        }
        text_accords_long = text_accords_long.join('')
        let text_without_accords_long = text_without_accords

        const quantityAddSpaceInEndStr = text_accords_long.length - text_without_accords_long.length
        console.log(text_accords_long.length, text_without_accords_long.length)

        if (quantityAddSpaceInEndStr < 0) {
          text_accords_long.padEnd(quantityAddSpaceInEndStr, 'W')
        }
        if (quantityAddSpaceInEndStr > 0) {
          text_without_accords_long = text_without_accords_long.padEnd(quantityAddSpaceInEndStr, 'W')

        }
        // text_accords_long = Array.from(text_accords_long, el => !el ? ' ' : el)
        console.log(text_accords_long.length, text_without_accords_long.length)
        // console.log(text_without_accords_long)
        // console.log(text_accords_long)

        return text_accords_long + '\n' + text_without_accords_long
      })
      result[key] = res.join('\n')
    })

    return result
  }

  const moveAccordsInText = (obj: { [key: string]: string }): { [key: string]: string } => {
    const result = { ...obj }

    Object.keys(result).forEach((key, ind) => {
      const arrAccords: string[] = []
      const arrTexts: string[] = []

      result[key].split('\n').forEach((str, i) => {
        if (i % 2 === 0) {
          arrAccords.push(str)
        } else {
          arrTexts.push(str)
        }
      })


      const arr = arrAccords.map((str, iStr) => {
        let resultTextStr = ''
        let shift = 1
        str.split('').forEach((accord, indAccord, arrayStr) => {
          if (shift !== 1) {
            shift -= 1
            if (arrTexts[iStr].split('')[indAccord]) {
              resultTextStr += arrTexts[iStr].split('')[indAccord]
            }
            return
          }
          if (accord !== ' ') {
            let letter = accord
            while (/\S/.test(arrayStr[indAccord + shift]) && arrayStr[indAccord + shift]) {
              letter += arrayStr[indAccord + shift]
              shift += 1
            }
            resultTextStr = resultTextStr + arrTexts[iStr][indAccord] + '{' + letter + '}'
            return
          }
          resultTextStr += arrTexts[iStr].split('')[indAccord]
        })
        return resultTextStr
      })

      // console.log(arrAccords)
      // console.log(arrTexts)
      console.log(arr)
    })


    return result
  }

  const deleteAccords = (obj: { [key: string]: string }): { [key: string]: string } => {
    const result = { ...obj }
    Object.keys(result).forEach((key) => {
      result[key] = result[key].replace(/{[^\}]*\}/, '')
    })
    return result
  }

  const saveHymn = () => {
    if (editHymn) {
      const hymn: IHymn = { ...editHymn, text_with_accords: moveAccordsInText(editHymn.text_with_accords) }
      // hymn.text = deleteAccords(hymn.text_with_accords),
      // console.log(hymn)
    }
  }

  return (
    <section className={style.editHymn}>
      <h4 className={style.editHymn__title}>
        Редактируемый гимн
      </h4>
      <form className={style.editHymn__form} onSubmit={e => e.preventDefault()}>

        {editHymn &&
          <>
            <div className={style.editHymn__inputContainer}>
              <label htmlFor={idCol} className={style.editHymn__label}>Коллекция</label>
              <Input
                id={idCol}
                type='text'
                value={editHymn?.collection}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditHymn({ ...editHymn, collection: e.target.value })}
              />
            </div>
            <div className={style.editHymn__inputContainer}>
              <label htmlFor={idNum} className={style.editHymn__label}>Номер</label>
              <Input
                id={idNum}
                type='text'
                value={editHymn?.number}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditHymn({ ...editHymn, number: Number(e.target.value) })}
              />
            </div>

            {Object.keys(editHymn?.text_with_accords).map((key, index, arr) => {
              return (
                <div key={key} className={style.editHymn__inputContainer}>
                  <Input
                    type='text'
                    defaultValue={handleTranslate(key)}
                  />
                  <textarea
                    name={key}
                    className={style.editHymn__textarea}
                    rows={{ ...editHymn }.text_with_accords[key].split('\n').length}
                    value={editHymn.text_with_accords[key]}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditHymn({ ...editHymn, text_with_accords: { ...editHymn.text_with_accords, [e.target.name]: e.target.value } })}
                  />
                </div >
              )
            })}
          </>
        }
        <Button children='Сохранить' onClick={saveHymn} />

      </form>

    </section>
  )
}

export default EditHymn