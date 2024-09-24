import fs from 'fs'


const hymnText = {
    "1 verse": "Чт{C}об любить Тебя{G} лишь, я живу{Am};\nДо{F} конца люби{G}ть Тебя, Госпо{C}дь.\nО{G} прости меня{Am}, е{C}сли оставля{F}л\nПерву{Dm}ю любовь к Тебе{G}. \nТы{C} всего доро{G}же для меня{},\nТы{F} дороже мне{G}, чем жизнь моя{C}. \nНе{G} могу ничто{Am} я{C} сравнить с Тобо{F}й, \nО Жени{Dm}х любимый мо{G}й!",
    "1 chorus": "Отда{F}ю Тебе{G} я пе{F}рвенство во всё{C}м:\nНичто{Dm} не заменя{F}ет пусть Тебя{G}.\nПропита{F}й Собо{G}ю Ты{C} всё во мне{F}.\nЛишь Тебя{C} люби{Am}ть\nХ{Dm}очу до встре{G}чи с Тобо{C}й.",
    "2 verse": "Можешь всё забрать, что я люблю, \nНо взамен обильно дай Себя.\nВсё Ты для меня, дай мне лишь Себя, \nА не то, чего хочу.\nВсё, что окружает нас, пройдёт… \nКаждый здесь своим путём идёт, \nНо с Тобой идём мы всегда вдвоём \nИ друг друга любим мы.",
    "2 chorus": "Отдаю Тебе я первенство во всём:\nНичто не заменяет пусть Тебя.\nПропитай Собою Ты всё во мне.\nЛишь Тебя любить\nХочу до встречи с Тобой.",
    "3 verse": "Я люблю наедине с Тобой \nОтдавать Тебе мою любовь.\nМуж мой дорогой, о влеки Собой, \nДай войти мне в Твой покой.\nПервым будь в служенье и в труде, \nВ отношениях моих везде,\nВ житии моём... О Господь, во всём \nПервенство во мне имей.",
    "3 chorus": "Отдаю Тебе я первенство во всём:\nНичто не заменяет пусть Тебя.\nПропитай Собою Ты всё во мне.\nЛишь Тебя любить\nХочу до встречи с Тобой."
}

function getAccords(text) {
    const arr1 = text.split('\n')
    return arr1.reduce((acc, str, index) => {
        acc[index] = {}
        let quantityVowel = 0
        for (let i = 0; i < str.length; i++) {
            if (['у', 'е', 'ы', 'а', 'о', 'э', 'и', 'ю', 'У', 'Е', 'Ы', 'А', 'О', 'Э', 'И', 'Ю'].includes(str[i])) {
                quantityVowel += 1
            }
            if (str[i] === '{') {
                let str1 = str
                str1 = str1.slice(i).match(/{[^\}]*\}/g)[0]
                if (str1) acc[index][quantityVowel] = str1
            }
        }
        return acc

    }, {})
}

function pasteAccords(text, obj_with_accords) {
    const obj = JSON.parse(JSON.stringify(obj_with_accords))

    return text.split('\n').map((str, index, arr) => {
        let quantityVowel = 0
        const arrayFromStr = str.split('').map((letter, i, arr) => {
            if (obj[index]) {


                if (obj[index][quantityVowel] && ['у', 'е', 'ы', 'а', 'о', 'э', 'и', 'ю', 'У', 'Е', 'Ы', 'А', 'О', 'Э', 'И', 'Ю'].includes(letter)) {
                    quantityVowel += 1
                    const a = obj[index][quantityVowel - 1]
                    obj[index][quantityVowel] = null
                    return a + letter
                }
                if (obj[index][quantityVowel] && !['у', 'е', 'ы', 'а', 'о', 'э', 'и', 'ю', 'У', 'Е', 'Ы', 'А', 'О', 'Э', 'И', 'Ю'].includes(letter)) {
                    const a = obj[index][quantityVowel]
                    obj[index][quantityVowel] = null
                    return !quantityVowel ? letter + a : a + letter
                }
                if (['у', 'е', 'ы', 'а', 'о', 'э', 'и', 'ю', 'ё', 'У', 'Е', 'Ы', 'А', 'О', 'Э', 'И', 'Ю', 'Ё'].includes(letter)) {
                    quantityVowel += 1
                }
                return letter
            }
        })
        return arrayFromStr.join('')
    }).join('\n')
}

function copyAccords(text1, text2) {
    const obj = getAccords(text1)
    const text = pasteAccords(text2, obj)
}

function makeHymnWithAccords(obj) {
    let verse_with_accords = {}
    let chorus_with_accords = {}

    const text_with_accords = { ...obj }
    const keys = Object.keys(text)
    keys.forEach(element => {
        if (element === '1 verse') {
            verse_with_accords = getAccords(text_with_accords[element])
            return
        }
        if (element.endsWith(' verse')) {
            text_with_accords[element] = pasteAccords(text_with_accords[element], verse_with_accords)
        }
        if (element === '1 chorus') {
            chorus_with_accords = getAccords(text_with_accords[element])
            return
        }
        if (element.endsWith(' chorus')) {
            text_with_accords[element] = pasteAccords(text_with_accords[element], chorus_with_accords)
        }

    });
    return text_with_accords
}

function makeHymnWithoutAccords(obj) {
    const newObj = {}
    Object.keys(obj).forEach(key => {
        newObj[key] = obj[key].replace(/{[^\}]*\}/g, '')
    })
    return newObj
}



const text = makeHymnWithoutAccords(hymnText)
const text_with_accords = makeHymnWithAccords(hymnText)
let data = JSON.stringify({ text, text_with_accords });
fs.writeFileSync('result.json', data); 