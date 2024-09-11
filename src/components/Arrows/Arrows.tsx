import { Link, useNavigate } from 'react-router-dom'

// стили
import style from './arrows.module.css'

// redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { hymnsSlice } from '../../redux/reducers/HymnSlice'
import { ROUTES } from '../../utils/routes'
import { useEffect } from 'react'

const Arrows = () => {
  const { currentHymn, hymns } = useAppSelector(state => state.hymnReducer)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    navigate(ROUTES.home + ROUTES.hymns + currentHymn?.id)
  }, [currentHymn])

  return (
    <div className={style.arrows}>
      {currentHymn?.number !== 1 && <button className={style.arrows__prev} onClick={() => dispatch(hymnsSlice.actions.prevHymn())}>{'<'}</button>}
      {hymns.length !== currentHymn?.number && <button className={style.arrows__next} onClick={() => dispatch(hymnsSlice.actions.nextHymn())}>{'>'}</button>}
    </div>
  )
}

export default Arrows