import style from './Admin.module.css'
import Button from '../../components/UI/Button/Button'

const Admin = () => {
  return (
    <div className={style.admin}>

      <h3 className={style.admin__title}>Выберите действие</h3>
      <Button children='Создать гимн' />
      <Button children='Удалить гимн' />
      <Button children='Отредактировать гимн' />
    </div>
  )
}

export default Admin