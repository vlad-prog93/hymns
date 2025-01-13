// стили
import style from './burger.module.css'

// redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { menuSlice } from '../../redux/reducers/MenuSlice'

const Burger = () => {

  const { isMenuActive } = useAppSelector(state => state.menuReducer)
  const dispatch = useAppDispatch()

  return (
    <div className={!isMenuActive ? style.burger : style.burger_active} onClick={() => dispatch(menuSlice.actions.toogleMenuActive(!isMenuActive))}>
      <span className={`${style.burger__item} ${style.burger__item_one}`} />
      <span className={`${style.burger__item} ${style.burger__item_two}`} />
      <span className={`${style.burger__item} ${style.burger__item_three}`} />
    </div>
  )
}

export default Burger