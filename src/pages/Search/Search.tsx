import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// стили
import style from './search.module.css'

// redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { hymnsSlice } from '../../redux/reducers/HymnSlice'

// models
import { IHymn } from '../../models/hymns'

// utils
import { ROUTES } from '../../utils/routes'


const Search = () => {
  const { hymns } = useAppSelector(state => state.hymnReducer)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [inputNumber, setInputNumber] = useState<number | null>(null)
  const [inputText, setInputText] = useState<string>('')

  const onChangeInputText: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputText(e.currentTarget.value)
  }
  const onChangeInputNumber: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.value) {
      setInputNumber(null)
    } else {
      setInputNumber(Number(e.currentTarget.value))
    }
  }

  const toSearch = (e: any): void => {
    e.preventDefault()

    let hymn: IHymn | null = null
    let foundedHymns: IHymn[] = []

    if (inputNumber) {
      hymn = hymns.find(hymn => hymn.number === inputNumber) || null
    }
    if (hymn) {
      dispatch(hymnsSlice.actions.setCurrentHymn(hymn))

      const historyHymn = { ...hymn, time: Date.now() }
      dispatch(hymnsSlice.actions.addHistoryHymn(historyHymn))
      navigate(ROUTES.hymns + hymn.number)
      return
    }
    if (inputText) {
      foundedHymns = hymns.filter(hymn => {
        const text = Object.keys(hymn.text).reduce((acc, res) => acc += hymn.text[res], '')
        return text.toLowerCase().indexOf(inputText.toLowerCase()) === -1 ? false : true
      })
    }
    if (foundedHymns.length) {
      dispatch(hymnsSlice.actions.hymnsFounded(foundedHymns))
      navigate(ROUTES.foundedHymns)
      return
    }
    dispatch(hymnsSlice.actions.deleteCurrentHymn())
    dispatch(hymnsSlice.actions.hymnsFounded([]))
    return
  }

  useEffect(() => {
    dispatch(hymnsSlice.actions.deleteCurrentHymn())
  }, [dispatch])


  return (
    <div className={style.search}>
      <form className={style.search__form} onSubmit={(e) => toSearch(e)}>
        <input
          value={inputNumber ?? ''}
          onChange={(onChangeInputNumber)}
          className={style.search__input}
          type="number"
          placeholder='Поиск по номеру' />
        <input
          value={inputText}
          onChange={onChangeInputText}
          className={style.search__input}
          type="text"
          placeholder='Поиск по строке' />
        <button
          disabled={!inputNumber && !inputText}
          className={style.search__button}
          children='Поиск' />
      </form>
    </div>
  )
}

export default Search