import { useCallback, useEffect, useState } from 'react'
import style from './ButtonScroll.module.css'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { hymnsSlice } from '../../redux/reducers/HymnSlice'
import { SPEED_CONFIG } from '../../utils/const'


const ButtonScroll = () => {
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null)

  const [speed, setSpeed] = useState<1 | 2 | 3>(1)

  const { isScroll } = useAppSelector(state => state.hymnReducer)
  const dispatch = useAppDispatch()

  const scroll = useCallback(() => {
    window.scrollBy(0, 1)
    console.log('scroll on')
  }, [])

  const handleScroll = () => {
    const interval = SPEED_CONFIG[speed]
    setSpeed(prev => {
      if (prev === 1) return 2
      if (prev === 2) return 3
      return 1
    })
    intervalId && clearInterval(intervalId)
    setIntervalId(null)
    dispatch(hymnsSlice.actions.offScroll())
    const toScroll = setInterval(scroll, interval)
    setIntervalId(toScroll)
    dispatch(hymnsSlice.actions.onScroll())
  }

  const stopScroll = () => {
    if (isScroll) {
      intervalId && clearInterval(intervalId)
      setIntervalId(null)
      dispatch(hymnsSlice.actions.offScroll())
      setSpeed(1)
    }
  }


  return (
    <div className={style.buttonContainer}>
      <button className={style.buttonScroll} onClick={() => stopScroll()}>S</button>
      <p>{speed}</p>
      <button className={style.buttonScroll} onClick={() => handleScroll()}>&darr;</button>
    </div>
  )
}

export default ButtonScroll