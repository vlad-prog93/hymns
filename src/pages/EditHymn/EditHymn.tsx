import { useNavigate, useParams } from 'react-router-dom'
import { v4 } from 'uuid'
// styles
import style from './EditHymn.module.css'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { IHymn } from '../../models/hymns'
import { toUpdateHymn } from '../../redux/reducers/ActionCreator'
import { handleTranslate, changeViewTextHymn, moveAccordsInText, deleteAccords } from '../../tools/workWithTextHymns'
import FormHymn from '../../components/FormHymn/FormHymn'

const EditHymn = () => {
  const params = useParams()
  const navigate = useNavigate()

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
      {editHymn && <FormHymn hymn={editHymn} setHymn={setEditHymn} saveHymn={saveHymn} />}

    </section>
  )
}

export default EditHymn