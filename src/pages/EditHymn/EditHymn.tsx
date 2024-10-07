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
import { toUpdateHymn } from '../../redux/reducers/ActionCreator'
import { handleTranslate, changeViewTextHymn, moveAccordsInText, deleteAccords } from '../../tools/workWithTextHymns'

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

  const saveHymn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editHymn) {
      const hymn: IHymn = { ...editHymn, text_with_accords: moveAccordsInText(editHymn.text_with_accords) }
      hymn.text = deleteAccords(hymn.text_with_accords)
      toUpdateHymn(dispatch, hymn)
      navigate('/admin')
    }
  }

  return (
    <section className={style.editHymn}>
      <h4 className={style.editHymn__title}>
        Редактируемый гимн
      </h4>
      <form className={style.editHymn__form} onSubmit={(e) => saveHymn(e)}>

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
        <Button children='Сохранить' />

      </form>

    </section>
  )
}

export default EditHymn