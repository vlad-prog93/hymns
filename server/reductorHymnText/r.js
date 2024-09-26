import fs from 'fs'


const hymnText = {
    "1 verse": "Д{C}орогой Го{F}сподь Иису{C}с мо{F}й,\nТы обрё{C}л любо{Am}вь мою{G}!\nКто тако{Am}й, ка{F}к Ты, — жела{C}нный,\nСладкий и{Am} бла{F}гоуха{G}нный?\nПревзойти{Am} никт{F}о не мо{C}же{F}т\nКрасоту{C-G}, Господь, Твою{C}!",
    "2 verse": "Дорогой Господь Иисус мой, \nЗов Твой рад услышать я.\nВ сердце мне вошёл Твой голос — \nВся моя исчезла гордость,\nИ с исканьями другими \nЯ расстался навсегда.",
    "3 verse": "Дорогой Господь Иисус мой, \nНе противлюсь больше я.\nЯ у ног Твоих смягчаюсь,\nС песней в сердце возвращаюсь; \nБыть Твоим рабом я счастлив, \nРад я слушаться Тебя.",
    "4 verse": "Дорогой Господь Иисус мой, \nЯ пойду лишь за Тобой. \nХоть и плачу, повинуясь, \nНо Тебе не изменю я,\nЛишь Твоей ищу отрады, \nДай в любви мне Твой покой.",
    "5 verse": "Дорогой Господь Иисус мой, \nКогда нет Тебя со мной,\nТо рассвет теряет краски \nИ моя улыбка гаснет.\nТвоего прихода жду лишь, \nЖажду снова быть с Тобой.",
    "6 verse": "Дорогой Господь Иисус мой, \nКак же высказать мне всё? \nСтал Ты радостью, любовью, \nСтал моей Ты вечной долей. \nОдного Тебя желаю,\nТы — стремление моё.",
    "7 verse": "Дорогой Господь Иисус мой, \nВсё Тебе я отдаю!\nКто такой, как Ты, — желанный, \nСладкий и благоуханный?\nПревзойти никто не может \nКрасоту, Господь, Твою!"
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