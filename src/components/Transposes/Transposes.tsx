// стили
import style from './Transposes.module.css'

// redux
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { hymnsSlice } from '../../redux/reducers/HymnSlice'

//models
import { Transpose } from '../../models/hymns'


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
      <button className={style.transpose_btn} onClick={() => transposeAccords(Transpose.UP)}>+</button>
      <button className={style.transpose_btn} onClick={() => transposeAccords(Transpose.DOWN)}>-</button>
    </div>
  )
}

export default Transposes