import { Link } from 'react-router-dom'
import { ROUTES } from '../../utils/routes'
import style from './NewHymn.module.css'
import { useEffect, useState } from 'react'
import { IHymn } from '../../models/hymns'
import Input from '../../components/UI/Input/Input'
import { handleTranslate } from '../../tools/workWithTextHymns'
import Button from '../../components/UI/Button/Button'
import FormHymn from '../../components/FormHymn/FormHymn'

const NewHymn = () => {
  const [newHymn, setNewHymn] = useState<IHymn>()
  const [quantityVerse, setQuantityVerse] = useState<number>(0)
  const [quantityChorus, setQuantityChorus] = useState<number>(0)
  const [quantityBridge, setQuantityBridge] = useState<number>(1)

  const AddVerse = () => {
    setQuantityVerse(prev => prev + 1)
    newHymn && setNewHymn({ ...newHymn, collection: ' ', shortText: ' ', text: { ' ': ' ' }, text_with_accords: { ...newHymn.text_with_accords, [(quantityVerse + 1).toString() + ' verse']: ' ' } })
    !newHymn && setNewHymn({ number: 0, collection: ' ', shortText: ' ', text: { ' ': ' ' }, text_with_accords: { [(quantityVerse + 1).toString() + ' verse']: ' ' } })
  }
  const AddChorus = () => {
    newHymn && setNewHymn({ ...newHymn, collection: ' ', shortText: ' ', text: { ' ': ' ' }, text_with_accords: { ...newHymn.text_with_accords, [(quantityVerse).toString() + ' chorus']: ' ' } })
    !newHymn && setNewHymn({ number: 0, collection: ' ', shortText: ' ', text: { ' ': ' ' }, text_with_accords: { [(quantityVerse).toString() + ' chorus']: ' ' } })
  }
  const AddBridge = () => {
    setQuantityBridge(prev => prev + 1)
    newHymn && setNewHymn({ ...newHymn, collection: ' ', shortText: ' ', text: { ' ': ' ' }, text_with_accords: { ...newHymn.text_with_accords, [(quantityVerse).toString() + ' verse ' + (quantityBridge).toString() + ' bridge']: ' ' } })
    !newHymn && setNewHymn({ number: 0, collection: ' ', shortText: ' ', text: { ' ': ' ' }, text_with_accords: { [(quantityVerse).toString() + ' verse ' + (quantityBridge).toString() + ' bridge']: ' ' } })
  }



  const saveHymn = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(e)
  }

  return (
    <section className={style.newHymn}>
      <Link className={style.newHymn__link} to={ROUTES.home + ROUTES.admin} children='Назад' />
      <h4 className={style.newHymn__title}>Создание нового гимна</h4>
      <ul className={style.newHymn__list}>
        <li className={style.newHymn__item}>
          <button className={style.newHymn__button} children='Добавить куплет' onClick={AddVerse} />
        </li>
        <li className={style.newHymn__item}>
          <button className={style.newHymn__button} children='Добавить припев' onClick={AddChorus} />
        </li>
        <li className={style.newHymn__item}>
          <button className={style.newHymn__button} children='Добавить мост' onClick={AddBridge} />
        </li>
      </ul>

      {newHymn && <FormHymn hymn={newHymn} setHymn={setNewHymn} saveHymn={saveHymn} />}

    </section>
  )
}

export default NewHymn