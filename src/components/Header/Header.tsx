import { useNavigate } from "react-router-dom"

// стили
import style from './header.module.css'

// компоненты
import Burger from "../Burger/Burger"

// redux
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { hymnsSlice } from "../../redux/reducers/HymnSlice"

// models
import { Transpose } from "../../models/hymns"
import { Link } from "react-router-dom"
import { ROUTES } from "../../utils/routes"

function Header() {
  const { currentHymn, isTextWithAccord, favoriteHymns, isTranposeOpen } = useAppSelector(state => state.hymnReducer)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const toggleFavoriteHymn = (): void | null => {
    if (!currentHymn) {
      return null
    }

    const isAlreadyFavorite = favoriteHymns.find(hymn => hymn.id === currentHymn.id)
    if (isAlreadyFavorite) {
      dispatch(hymnsSlice.actions.deleteFavoriteHymn(currentHymn.id))
    } else {
      dispatch(hymnsSlice.actions.setFavoriteHymn(currentHymn.id))
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
    return !!favoriteHymns.find(hymn => hymn.id === currentHymn.id)
  }

  const transposeAccords = (option: Transpose) => {
    const accords = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',]
    const objText = { ...currentHymn?.text_with_accords }
    if (objText) {
      for (let el in objText) {
        objText[el] = objText[el].replace(/[CDEFGAB]#?/g, (match: string) => {
          if (option === Transpose.UP) {
            const i = accords.indexOf(match) + 1
            return accords[i > accords.length - 1 ? 0 : i]
          }
          const i = accords.indexOf(match) - 1
          return accords[i < 0 ? i + accords.length : i]
        })
      }
    }

    dispatch(hymnsSlice.actions.transposeAccords(objText))
  }

  return (
    <header className={style.header}>
      <nav className={style.header__nav}>
        <ul className={style.header__list}>
          <li className={style.header__item}><Burger /></li>
          <li className={style.header__item}><span>{currentHymn ? <Link className={style.header__link} to={ROUTES.home + ROUTES.hymns + currentHymn.id}>Гимн {currentHymn.number}</Link> : 'Гимны'}</span></li>
        </ul>
        {currentHymn &&
          <ul className={style.header__list}>
            {isTextWithAccord &&
              <li className={`${style.header__item} ${style.header__itemCheckbox}`}>
                <input
                  className={style.header__itemInputTranspose}
                  defaultChecked={isTranposeOpen}
                  type="checkbox"
                  onChange={() => dispatch(hymnsSlice.actions.toggleTranposeMenu(!isTranposeOpen))} />
                <span className={style.header__itemSpanTranspose} />
                {isTranposeOpen &&
                  <div className={style.header__transpose}>
                    <button className={style.header__transpose_btn} onClick={() => transposeAccords(Transpose.UP)}>+</button>
                    <button className={style.header__transpose_btn} onClick={() => transposeAccords(Transpose.DOWN)}>-</button>
                  </div>}
              </li>}
            <li className={style.header__item}>
              <button className={isCurrentHymnFavorite() ? style.header__buttonFavorite_active : style.header__buttonFavorite} onClick={toggleFavoriteHymn} />
            </li>
            <li className={style.header__item}>
              <button className={style.header__buttonSearch} onClick={returnToSearch} />
            </li>
            <li className={`${style.header__item} ${style.header__itemCheckbox}`}>
              <input
                className={style.header__itemInput}
                defaultChecked={isTextWithAccord}
                type="checkbox"
                onChange={() => dispatch(hymnsSlice.actions.toggleHymnText(!isTextWithAccord))} />
              <span className={style.header__itemSpan} />
            </li>


          </ul>
        }
      </nav>
    </header >
  )
}

export default Header