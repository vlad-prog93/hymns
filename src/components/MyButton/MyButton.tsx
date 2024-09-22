import style from './MyButton.module.css'

const MyButton = (props: any) => {
    return (
        <button className={style.MyButton} {...props}>{props.children}</button>
    )
}

export default MyButton