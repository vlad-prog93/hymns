// стили
import style from './menu.module.css'

// компоненты 
import MenuItem from "../MenuItem/MenuItem";

// redux
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { menuSlice } from "../../redux/reducers/MenuSlice";

// utils
import { ROUTES } from "../../utils/routes";


const Menu = () => {
  const { isMenuActive } = useAppSelector(state => state.menuReducer)
  const dispatch = useAppDispatch()

  function hideMenu(e: any) {
    dispatch(menuSlice.actions.toogleMenuActive(!isMenuActive))
  }

  return (
    <div id='container' className={isMenuActive ? style.menu + ' ' + style.menu_active : style.menu} onClick={hideMenu} >
      <div className={style.menu__contain}>
        <ul className={style.menu__list}>
          <MenuItem link={ROUTES.home} text='Поиск' />
          <MenuItem link={ROUTES.home + ROUTES.favoriteHymns} text='Избранные гимны' />
          <MenuItem link={ROUTES.home + ROUTES.sortedHymns} text='Содержание' />
          <MenuItem link={ROUTES.home + ROUTES.history} text='История' />
          <MenuItem link={ROUTES.home + ROUTES.settings} text='Настройки' />
        </ul>
      </div>
    </div>
  )
}

export default Menu
