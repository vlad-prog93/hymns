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
    if (isScroll) {
      intervalId && clearInterval(intervalId)
      setIntervalId(null)
      dispatch(hymnsSlice.actions.offScroll())
    }
    else {
      const toScroll = setInterval(scroll, 50)
      setIntervalId(toScroll)
      dispatch(hymnsSlice.actions.onScroll())
    }
  }






  // useEffect(() => {
  //   console.log(isScroll)

  //   const toScroll = setInterval(scroll, 50)

  //   // console.log(toScroll)
  //   // !isScroll && clearInterval(toScroll)

  //   // return (() => {
  //   //   clearInterval(toScroll)
  //   //   dispatch(hymnsSlice.actions.offScroll())
  //   //   console.log('scroll off 2')

  //   // })
  // }, [isScroll])

  return (
    <button className={style.buttonScroll} onClick={() => handleScroll()}>&darr;</button>
  )
}

export default ButtonScroll