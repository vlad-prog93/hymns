import fs from 'fs'


const hymnText = {
    "1 verse": "По{D}лны масла светильники на{G}ши!\nМы пыла{D}ем, Господь, сейча{A}с!\nО Госпо{D}дь, мы хотим, чтобы к ду{G}ху\nОбраща{D}л всегда во всё{A}м Ты{A7} на{D}с!",
    "1 chorus": "О{D}, аминь! О, а{G}ллилу{Em}йя!\nО{A} Госпо{}дь, пылаем мы{A7} се{G}йча{D}с!\nО{D}, аминь! О, {G}аллилу{Em}йя!\nО{A}браща{A7}й же к духу на{D}с!",
    "2 verse": "Но запас к Твоему возвращенью \nМы в сосудах должны иметь. \nТы нам маслом сосуды наполни,\nЧтоб светильникам всегда гореть.",
    "2 chorus": "Наполняй, Иисус, Собой нас! \nКаждый миг Себя в нас добавляй! \nДай действительности больше, \nНас Собою наполняй!",
    "3 verse": "И пока к нам Господь не вернётся, \nДо тех пор будем мы пылать.\nИ на свадебный пир с Ним войдём мы, \nБудем ярко мы всегда сиять!",
    "3 chorus": "О Господь Иисус, приди же! \nНас пылающими Ты найди! \nО, приди к Своей Невесте, \nВ ней Ты радость обрети!"
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