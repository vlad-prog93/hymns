import fs from 'fs'


const hymnText = {
    "1 verse": "Го{A}ды горевал я у кре{D}ста{A},\nКа{E}ялся{E7} в грехах я бе{A}з ко{D}нца{A},\nНо коснулся, реку пере{D}йдя{A},\nПресто{E-E7}ла я{A-A7}.",
    "1 chorus": "Ми{D}лость в Нём нашёл и бла{A}годать,\nЧто{E}бы на{E7} ристалище{A} бежа{A7}ть.\nСме{D}ло я сейчас иду{A} опять\nХриста{E} вку{E7}ша{A}ть.",
    "2 verse": "Каждый раз, когда призыв звучал, \nЯ был рад и каяться вставал,\nЕжедневно падал, но теперь \nПрестол познал.",
    "2 chorus": "Милость в Нём нашёл и благодать,\nЧтобы на ристалище бежать.\nСмело я сейчас иду опять\nХриста вкушать.",
    "3 verse": "Братья, будем смело приступать,\nОставлять грехи, вперёд бежать. \nНет завесы, чтоб препятствовать \nИ вход скрывать.",
    "3 chorus": "Милость в Нём нашёл и благодать,\nЧтобы на ристалище бежать.\nСмело я сейчас иду опять\nХриста вкушать.",
    "4 verse": "За завесой наслажденье — Бог, \nЖезл, и манна, и живой закон;\nСам Христос — Ковчег, чтоб жить нам в Нём, \nАллилуйя!",
    "4 chorus": "Милость в Нём нашёл и благодать,\nЧтобы на ристалище бежать.\nСмело я сейчас иду опять\nХриста вкушать."
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