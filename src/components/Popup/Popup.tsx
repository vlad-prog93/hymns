import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'

// стили
import style from './Popup.module.css'
import { hymnsSlice } from '../../redux/reducers/HymnSlice'

const Popup = () => {
  const { error } = useAppSelector(state => state.hymnReducer)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setTimeout(() => {
      dispatch(hymnsSlice.actions.setError(null))
    }, 2000)
  }, [])

  return (
    <div className={style.popup}>
      <span className={style.popup__text}>{error}</span>
    </div>
  )
}

export default Popup