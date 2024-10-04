import style from './Input.module.css'


const Input = (props: any) => {
  return (
    <input
      className={style.input}
      {...props} />
  )
}

export default Input