import { useCallback, useEffect, useState } from 'react'
import style from './ButtonScroll.module.css'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { hymnsSlice } from '../../redux/reducers/HymnSlice'


const ButtonScroll = () => {
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null)

  const { isScroll } = useAppSelector(state => state.hymnReducer)
  const dispatch = useAppDispatch()

  const scroll = useCallback(() => {
    window.scrollBy(0, 1)
    console.log('scroll on')
  }, [])

  const handleScroll = () => {
    if (!isScroll) {
      const toScroll = setInterval(scroll, 50)
      setIntervalId(toScroll)
      dispatch(hymnsSlice.actions.onScroll())
    }
  }

  const stopScroll = () => {
    if (isScroll) {
      intervalId && clearInterval(intervalId)
      setIntervalId(null)
      dispatch(hymnsSlice.actions.offScroll())
    }
  }


  return (
    <div className={style.buttonContainer}>
      <button className={style.buttonScroll} onClick={() => stopScroll()}>S</button>
      <button className={style.buttonScroll} onClick={() => handleScroll()}>&darr;</button>
    </div>
  )
}

export default ButtonScroll