import { useNavigate } from "react-router-dom"

// стили
import style from './header.module.css'

// компоненты
import Burger from "../Burger/Burger"

// redux
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { hymnsSlice } from "../../redux/reducers/HymnSlice"

// models
import { Link } from "react-router-dom"
import { ROUTES } from "../../utils/routes"

//components
import Transposes from "../Transposes/Transposes"

function Header() {
  const { currentHymn, isTextWithAccord, favoriteHymns, isTranposeOpen } = useAppSelector(state => state.hymnReducer)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const toggleFavoriteHymn = (): void | null => {
    if (!currentHymn) {
      return null
    }

    const isAlreadyFavorite = favoriteHymns.find(hymn => hymn._id === currentHymn._id)
    if (isAlreadyFavorite && currentHymn._id) {
      dispatch(hymnsSlice.actions.deleteFavoriteHymn(currentHymn._id))
    } else if (currentHymn._id) {
      dispatch(hymnsSlice.actions.setFavoriteHymn(currentHymn._id))
    }
  }

  const returnToSearch = () => {
    dispatch(hymnsSlice.actions.deleteCurrentHymn())
    navigate('/')
  }

  const isCurrentHymnFavorite = (): boolean => {
    if (!currentHymn) {
      return false
    }
    return !!favoriteHymns.find(hymn => hymn._id === currentHymn._id)
  }

  return (
    <header className={style.header}>
      <nav className={style.header__nav}>
        <ul className={style.header__list}>
          <li className={style.header__item}><Burger /></li>
          <li className={style.header__item}><span>{currentHymn ? <Link className={style.header__link} to={ROUTES.home + ROUTES.hymns + '/' + currentHymn._id}>Гимн {currentHymn.number}</Link> : 'Гимны'}</span></li>
        </ul>
        {currentHymn &&
          <ul className={style.header__list}>
            {isTextWithAccord &&
              <li className={`${style.header__item} ${style.header__itemCheckbox}`}>
                <input
                  className={style.header__itemInput}
                  defaultChecked={isTranposeOpen}
                  type="checkbox"
                  onChange={() => dispatch(hymnsSlice.actions.toggleTranposeMenu(!isTranposeOpen))} />
                <span className={`${style.header__itemSpan} ${style.header__itemSpanTranspose}`} />
                {currentHymn && isTranposeOpen && isTextWithAccord && <Transposes />}

              </li>}
            <li className={style.header__item}>
              <button
                className={`${style.header__button} ${isCurrentHymnFavorite() ? style.header__buttonFavorite_active : style.header__buttonFavorite}`}
                onClick={toggleFavoriteHymn} />
            </li>
            <li className={style.header__item}>
              <button
                className={`${style.header__button} ${style.header__buttonSearch}`}
                onClick={returnToSearch} />
            </li>
            <li className={`${style.header__item} ${style.header__itemCheckbox}`}>
              <input
                className={style.header__itemInput}
                defaultChecked={isTextWithAccord}
                type="checkbox"
                onChange={() => dispatch(hymnsSlice.actions.toggleHymnText(!isTextWithAccord))} />
              <span className={`${style.header__itemSpan} ${style.header__itemSpanAccord}`} />
            </li>


          </ul>
        }
      </nav>
    </header >
  )
}

export default Header