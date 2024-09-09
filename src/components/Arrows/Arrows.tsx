// стили
import style from './arrows.module.css'

// redux
import { useAppDispatch } from '../../redux/hooks'
import { hymnsSlice } from '../../redux/reducers/HymnSlice'

const Arrows = () => {
  const dispatch = useAppDispatch()

  return (
    <div className={style.arrows}>
      <button className={style.arrows__prev} onClick={() => dispatch(hymnsSlice.actions.prevHymn())}>{'<'}</button>
      <button className={style.arrows__next} onClick={() => dispatch(hymnsSlice.actions.nextHymn())}>{'>'}</button>
    </div>
  )
}

export default Arrows