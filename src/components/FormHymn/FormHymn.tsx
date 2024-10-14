import { createRef, useEffect, useId, useRef } from 'react'
import style from './FormHymn.module.css'
import Input from '../UI/Input/Input'
import Button from '../UI/Button/Button'
import { IHymn } from '../../models/hymns'
import { balanceStr, handleTranslate } from '../../tools/workWithTextHymns'

interface IFormHymnProps {
    hymn: IHymn,
    setHymn: (obj: IHymn) => void,
    saveHymn: (e: React.FormEvent<HTMLFormElement>) => void,
}

const FormHymn = ({ hymn, setHymn, saveHymn }: IFormHymnProps) => {
    const idCol = useId()
    const idNum = useId()
    const refs: any = useRef(Object.keys(hymn.text_with_accords).map(() => createRef()))

    const handleDeleteFragment = (key: string) => {
        if (hymn) {
            const state = hymn?.text_with_accords
            delete state[key]
            hymn && setHymn({ ...hymn, text_with_accords: { ...state } })
        }
    }

    const generateAccords = () => {
        if (hymn.text_with_accords) {
            let arrAccordsVerse: string[] = []
            let arrAccordsChorus: string[] = []
            let TEXT_WITH_ACCORDS: { [key: string]: string } = {}

            Object.keys(hymn.text_with_accords).forEach(key => {
                if (key === '1 verse') {
                    TEXT_WITH_ACCORDS['1 verse'] = hymn.text_with_accords['1 verse']
                }
                if (key === '1 chorus') {
                    TEXT_WITH_ACCORDS['1 chorus'] = hymn.text_with_accords['1 chorus']
                }
            })

            hymn.text_with_accords['1 verse']
                .split('\n')
                .forEach((el, ind) => ind % 2 === 0 && arrAccordsVerse.push(el))
            hymn.text_with_accords['1 chorus']
                .split('\n')
                .forEach((el, ind) => ind % 2 === 0 && arrAccordsChorus.push(el))

            Object.keys(hymn.text_with_accords).forEach(key => {
                if (key === '1 verse') {
                    TEXT_WITH_ACCORDS['1 verse'] = hymn.text_with_accords['1 verse']
                }
                if (key === '1 chorus') {
                    TEXT_WITH_ACCORDS['1 chorus'] = hymn.text_with_accords['1 chorus']
                }
            })

            //     hymn.text_with_accords['1 verse']
            //         .split('\n')
            //         .forEach((el, ind) => ind % 2 === 0 && arrAccordsVerse.push(el))
            //     hymn.text_with_accords['1 chorus']
            //         .split('\n')
            //         .forEach((el, ind) => ind % 2 === 0 && arrAccordsChorus.push(el))

            //     Object.keys(hymn.text_with_accords).forEach(key => {
            //         if (key.endsWith(' verse') && key !== '1 verse') {
            //             const text_with_accords =
            //                 hymn.text_with_accords[key]
            //                     .split('\n')
            //                     .map((el, ind) => arrAccordsVerse[ind] + '\n' + el)
            //                     .join('\n')
            //             TEXT_WITH_ACCORDS[key] = text_with_accords
            //         }
            //         if (key.endsWith(' chorus') && key !== '1 chorus') {
            //             const text_with_accords =
            //                 hymn.text_with_accords[key]
            //                     .split('\n')
            //                     .map((el, ind) => arrAccordsChorus[ind] + '\n' + el)
            //                     .join('\n')
            //             TEXT_WITH_ACCORDS[key] = text_with_accords
            //         }

            //     })
            //     setHymn({ ...hymn, text_with_accords: { ...TEXT_WITH_ACCORDS } })
            // }
            Object.keys(hymn.text_with_accords).forEach(key => {
                console.log(hymn.text_with_accords[key].split("\n").splice(0, 2).join('\n'))
                console.log(balanceStr(hymn.text_with_accords[key].split("\n").splice(0, 2).join('\n')))
            })
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
                    defaultValue={hymn?.number}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHymn({ ...hymn, number: Number(e.target.value) })}
                />
            </div>

            {Object.keys(hymn?.text_with_accords).map((key, index, arr) => {
                return (
                    <div key={key} className={style.formHymn__inputContainer}>
                        <Input
                            type='text'
                            defaultValue={handleTranslate(key)}
                            ref={refs[index]}
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
            <Button children='Генерировать аккорды' onClick={generateAccords} />
            <Button children='Сохранить' />

        </form>
    )
}

export default FormHymn