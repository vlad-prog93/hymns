import style from './Button.module.css'

const Button = (props: { disabled?: boolean, children: string, onClick?: () => void }) => {
  return (
    <button className={style.button} {...props} />
  )
}

export default Button