import fs from 'fs'


const hymnText = {
    "1 verse": "Я{Dm} хоте{A}л найти{Dm} исто{A}чник,\nЧтоб он жа{Gm}жду мне у{A}толи{Dm}л,\nНо{Dm} нигде{A} не мог н{Dm}апи{A}ться, \nЖаждой т{Gm}ой же охва{A}чен бы{Dm}л.\n{C}Но нашёл Того{F} я,\n{C}Кто жажду утоли{F}л,\n{C}Живым источнико{F}м во мне{Dm}\n{A}Он в глубине{A7} заби{Dm}л. \nПью Его я!",
    "1 chorus": "Ста{A}л Иисус моею жи{Dm}знью,\nИ{C}исус есть жизнь моя{F};\nПо{A}лностью я{A7} насы{Dm}щен,\nИ{A}исус есть жи{A7}знь мо{Dm}я.",
    "2 verse": "Я, вкусив такой источник,\nК родникам сердце устремил; \nВиденье с горы увидел:\nВот собранье — Иерусалим. \nИ меня нашёл Он,\nВ церковь меня привёл;\nЯ наслажденье здесь вкусил \nИ что искал — нашёл.\nАллилуйя!",
    "2 chorus": "Стал Иисус моею жизнью, \nИисус есть жизнь моя; \nПолностью я насыщен, \nИисус есть жизнь моя.",
    "3 verse": "Всю борьбу оставь, скиталец, \nЖизнь бессмысленной суеты, \nПризови Иисуса имя —\nОн войдёт, лишь попросишь ты! \nИ Его найдёшь ты,\nЕго лишь призови;\nЕго приняв, не станешь ты \nЖить так, как раньше жил, \nНе захочешь!",
    "3 chorus": "Стал Иисус моею жизнью, \nИисус есть жизнь моя; \nПолностью я насыщен, \nИисус есть жизнь моя."
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