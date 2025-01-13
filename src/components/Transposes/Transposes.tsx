// стили
import style from './Transposes.module.css'

// redux
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { hymnsSlice } from '../../redux/reducers/HymnSlice'

//models
import { Transpose } from '../../models/hymns'

// components
import MyButton from '../MyButton/MyButton'


const Transposes = () => {
  const { currentHymn } = useAppSelector(state => state.hymnReducer)
  const dispatch = useAppDispatch()


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
    <div className={style.transpose}>
      <MyButton style={{ color: '#FFF', width: '30px' }} onClick={() => transposeAccords(Transpose.UP)}>+</MyButton>
      <MyButton style={{ color: '#FFF', width: '30px' }} onClick={() => transposeAccords(Transpose.DOWN)}>-</MyButton>
    </div>
  )
}

export default Transposes