import { useId } from 'react'
import style from './FormHymn.module.css'
import Input from '../UI/Input/Input'
import Button from '../UI/Button/Button'
import { IHymn } from '../../models/hymns'
import { handleTranslate } from '../../tools/workWithTextHymns'

interface IFormHymnProps {
    hymn: IHymn,
    setHymn: (obj: IHymn) => void,
    saveHymn: (e: React.FormEvent<HTMLFormElement>) => void,
}

const FormHymn = ({ hymn, setHymn, saveHymn }: IFormHymnProps) => {
    const idCol = useId()
    const idNum = useId()

    const handleDeleteFragment = (key: string) => {
        if (hymn) {
            const state = hymn?.text_with_accords
            delete state[key]
            hymn && setHymn({ ...hymn, text_with_accords: { ...state } })
        }
    }

    return (
        <form className={style.formHymn__form} onSubmit={(e) => saveHymn(e)}>
            <div className={style.formHymn__inputContainer}>
                <label htmlFor={idCol} className={style.formHymn__label}>Сборник</label>
                <Input
                    id={idCol}
                    type='text'
                    value={hymn?.collection}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHymn({ ...hymn, collection: e.target.value })}
                />
            </div>
            <div className={style.formHymn__inputContainer}>
                <label htmlFor={idNum} className={style.formHymn__label}>Номер</label>
                <Input
                    id={idNum}
                    type='text'
                    value={hymn?.number}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHymn({ ...hymn, number: Number(e.target.value) })}
                />
            </div>

            {Object.keys(hymn?.text_with_accords).map((key, index, arr) => {
                return (
                    <div key={key} className={style.formHymn__inputContainer}>
                        <Input
                            type='text'
                            defaultValue={handleTranslate(key)}
                        />
                        <textarea
                            name={key}
                            className={style.formHymn__textarea}
                            rows={{ ...hymn }.text_with_accords[key].split('\n').length}
                            value={hymn.text_with_accords[key]}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setHymn({ ...hymn, text_with_accords: { ...hymn.text_with_accords, [e.target.name]: e.target.value } })}
                        />
                        <Button onClick={() => handleDeleteFragment(key)} children='Удалить' />
                    </div >
                )
            })}
            <Button children='Сохранить' />

        </form>
    )
}

export default FormHymn