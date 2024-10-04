import style from './Admin.module.css'
import Button from '../../components/UI/Button/Button'
import { useAppSelector } from '../../redux/hooks'
import { useDispatch } from 'react-redux'
import { toDeleteHymn } from '../../redux/reducers/ActionCreator'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
  const navigate = useNavigate()

  const { hymns } = useAppSelector(state => state.hymnReducer)
  const dispatch = useDispatch()



  const handleDelete = (id: string) => {
    toDeleteHymn(dispatch, id)
  }

  const handleEdit = (id: string) => {
    navigate(`hymns/${id}`)
  }

  return (
    <div className={style.admin}>

      <h3 className={style.admin__title}>Выберите действие</h3>
      <Button children='Создать гимн' />
      <Button children='Удалить гимн' />
      <Button children='Отредактировать гимн' />
      <ul className={style.admin__list}>
        {hymns.map(hymn => {
          return (<li className={style.admin__item} key={hymn._id}>
            <span className={style.admin__number}>{hymn.number} - </span>
            <span className={style.admin__text}>{hymn.shortText}</span>
            <button onClick={() => handleEdit(hymn._id)}>Редактировать</button>
            <button onClick={() => handleDelete(hymn._id)}>Удалить</button>
          </li>)
        })}
      </ul>
    </div>
  )
}

export default Admin