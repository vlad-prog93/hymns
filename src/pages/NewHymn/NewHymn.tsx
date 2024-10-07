import { Link } from 'react-router-dom'
import { ROUTES } from '../../utils/routes'
import style from './NewHymn.module.css'


const NewHymn = () => {
  return (
    <section className={style.newHymn}>
      <Link className={style.newHymn__link} to={ROUTES.home + ROUTES.admin} children='Назад' />
      <h4 className={style.newHymn__title}>Создание нового гимна</h4>
      <ul className={style.newHymn__list}>
        <li className={style.newHymn__item}>
          <button className={style.newHymn__button} children='Добавить куплет' />

        </li>
        <li className={style.newHymn__item}>
          <button className={style.newHymn__button} children='Добавить припев' />
        </li>
        <li className={style.newHymn__item}>
          <button className={style.newHymn__button} children='Добавить мост' />
        </li>
      </ul>

    </section>
  )
}

export default NewHymn