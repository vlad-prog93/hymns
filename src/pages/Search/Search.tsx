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

// components
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'


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
      !hymn && dispatch(hymnsSlice.actions.setError('Гимн с таким номером не найден'))
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
      !foundedHymns.length && dispatch(hymnsSlice.actions.setError('Гимнов не найдено'))
    }
    if (foundedHymns.length) {
      dispatch(hymnsSlice.actions.hymnsFounded(foundedHymns))
      navigate(ROUTES.foundedHymns)
      return
    }
    setInputNumber(null)
    setInputText('')
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
        <Input
          value={inputNumber ?? ''}
          onChange={(onChangeInputNumber)}
          type="number"
          placeholder='Поиск по номеру' />
        <Input
          value={inputText}
          onChange={onChangeInputText}
          type="text"
          placeholder='Поиск по строке' />
        <Button
          disabled={!inputNumber && !inputText}
          children='Поиск' />
      </form>
    </div>
  )
}

export default Search