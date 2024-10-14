import style from './Admin.module.css'
import { useAppSelector } from '../../redux/hooks'
import { useDispatch } from 'react-redux'
import { toDeleteHymn } from '../../redux/reducers/ActionCreator'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../utils/routes'
import Button from '../../components/UI/Button/Button'
import { useId } from 'react'

const Admin = () => {
  const id_input_file = useId()
  const navigate = useNavigate()

  const { hymns } = useAppSelector(state => state.hymnReducer)
  const dispatch = useDispatch()



  const handleDelete = (id: string) => {
    toDeleteHymn(dispatch, id)
  }

  const handleEdit = (id: string) => {
    navigate(`hymns/${id}`)
  }

  const handleDownload = () => {
    console.log('скачка началась')
  }

  return (
    <div className={style.admin}>

      <h3 className={style.admin__title}>Выберите действие</h3>
      <div className={style.admin__buttonContainer}>
        <Link className={style.admin__link} to={ROUTES.hymns + ROUTES.newHymn} children='Создать гимн' />
        <button className={style.admin__link} onClick={handleDownload} children='Скачать БД' />
        <form className={style.admin__form}>
          <label htmlFor={id_input_file}>Загрузить JSON

            <input id='id_input_file' className={style.input__file} type='file' />

          </label>
          <button className={style.admin__link} onClick={handleDownload} children='Отправить' />
        </form>
      </div>

      <ul className={style.admin__list}>
        {hymns.map(hymn => {
          return (
            <li className={style.admin__item} key={hymn._id}>
              <span className={style.admin__number}>{hymn.number} - </span>
              <span className={style.admin__text}>{hymn.shortText}</span>
              <button className={style.admin__button} onClick={() => hymn._id && handleEdit(hymn._id)}>Редактировать</button>
              <button className={style.admin__button} onClick={() => hymn._id && handleDelete(hymn._id)}>Удалить</button>
            </li>)
        })}
      </ul>
    </div>
  )
}

export default Admin