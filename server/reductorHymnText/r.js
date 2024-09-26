import fs from 'fs'


const hymnText = {
    "1 verse": "Жи{C}знь возьми, Госпо{G}дь! Дай мне{C}\nПо{G}святить её Тебе{C},\nДни{} мои возьми, чтоб я{F}\nСла{C}вил ка{G}ждый миг Тебя{C-C7}.",
    "1 chorus": "З{F}а меня поруган и распя{C}т,\nКро{F}вь пролив, Ты умер за меня{C}.\nЯ хочу, Господь, любо{F}вь и жизнь изли{C}ть\nИ всегда{G} Тебе{G7} служи{C}ть.",
    "2 verse": "Для Твоих, Господь, трудов \nЧлены тела моего.\nСлово истины Твоей \nЧрез уста мои излей.",
    "2 chorus": "За меня поруган и распят,\nКровь пролив, Ты умер за меня.\nЯ хочу, Господь, любовь и жизнь излить\nИ всегда Тебе служить.",
    "3 verse": "Золото и серебро\nВсё возьми Себе моё; \nУм, способности мои \nДля Себя употреби.",
    "3 chorus": "За меня поруган и распят,\nКровь пролив, Ты умер за меня.\nЯ хочу, Господь, любовь и жизнь излить\nИ всегда Тебе служить.",
    "4 verse": "Сердце, воля вся моя \nПусть Тебе принадлежат. \nВсю возьми любовь мою: \nС ней у ног Твоих стою.",
    "4 chorus": "За меня поруган и распят,\nКровь пролив, Ты умер за меня.\nЯ хочу, Господь, любовь и жизнь излить\nИ всегда Тебе служить.",
    "5 verse": "О Господь, меня возьми, \nЧтоб с Тобой я стал одним. \nНавсегда хочу быть я\nВесь лишь только для Тебя!",
    "5 chorus": "За меня поруган и распят,\nКровь пролив, Ты умер за меня.\nЯ хочу, Господь, любовь и жизнь излить\nИ всегда Тебе служить."
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