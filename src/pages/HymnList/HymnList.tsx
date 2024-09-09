import { useEffect } from 'react'
import { Link } from 'react-router-dom'

// стили
import style from './hymnList.module.css'

//redux
import { useAppDispatch } from '../../redux/hooks'
import { hymnsSlice } from '../../redux/reducers/HymnSlice'

// models
import { IHymn } from '../../models/hymns'

// utils
import { ROUTES } from '../../utils/routes'


interface IHymnListProps {
  isLoading: boolean,
  list: IHymn[],
  title: string
}

const HymnList = ({ list, isLoading, title }: IHymnListProps) => {

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(hymnsSlice.actions.deleteCurrentHymn())
  }, [])

  return (
    <div className={style.hymnList}>
      <h2 className={style.hymnList__title}>{title}</h2>
      {isLoading
        ?
        'Идет загрузка...'
        :
        <ul className={style.hymnList__list}>
          {list.map(hymn => {
            return <li key={hymn.id} className={style.hymnList__Item}>
              <Link className={style.hymnList__link} onClick={() => dispatch(hymnsSlice.actions.setCurrentHymn(hymn))} to={ROUTES.home + ROUTES.hymns + hymn.id}>
                <span>{hymn.collection} : {hymn.shortText}</span><span>{hymn.number}</span>
              </Link>
            </li>
          })}
        </ul>
      }

    </div>
  )
}

export default HymnList