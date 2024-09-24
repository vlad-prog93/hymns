import fs from 'fs'


const hymnText = {
    "1 verse": "Я{C} всю жизнь воды{F} холо{C}дной\nИз ключа хоте{Am}л испи{Dm-G}ть,\nЧтобы жа{Am}жды не{F}преста{C}нно{Am}й\nМог я пламя у{Dm}гаси{G}ть.",
    "1 chorus": "Аллилу{Am}йя! Мно{F}ю на{C}йден\nТот, кого{Am} так жа{F}ждал я{G}!\nУтоли{Am}л Иису{F}с мне жа{C}жду{F}, \nЖизнь Его{C} спасла{G} меня{C}.",
    "2 verse": "Шелухой вокруг питаясь, \nВсю я силу потерял, \nВечно лучшего желая, \nНепрестанно голодал.",
    "2 chorus": "Аллилуйя! Мною найден\nТот, кого так жаждал я!\nУтолил Иисус мне жажду, \nЖизнь Его спасла меня.",
    "3 verse": "Беден был — искал богатства, \nНасыщения искал,\nНо в насмешку над душою \nЯ лишь прах вокруг собрал.",
    "3 chorus": "Аллилуйя! Мною найден\nТот, кого так жаждал я!\nУтолил Иисус мне жажду, \nЖизнь Его спасла меня.",
    "4 verse": "Ключ воды, текущей вечно, \nХлеб обильный — жизнь моя, \nНесказанное богатство — \nИскупитель для меня.",
    "4 chorus": "Аллилуйя! Мною найден\nТот, кого так жаждал я!\nУтолил Иисус мне жажду, \nЖизнь Его спасла меня."
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