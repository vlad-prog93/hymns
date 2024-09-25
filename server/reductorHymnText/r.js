import fs from 'fs'


const hymnText = {
    "1 verse": "Бы{G}ли в прошлом мё{C}ртвы мы в грехе{G},\nВ мире, где разлад лишь цари{D}т;\nНо{G} Сам Бог нас о{C}живил в Христе{G},\nВоскресил и в небеса{D7}х с Ним посади{G}л.",
    "1 chorus": "И{G}исус нас вме{C}сте собирает,\nП{G}осмотри: святы{D}е здесь — одно{D7}.\nВсех на{G}с любо{C}вь Его скрепляет,\nК мере ро{G}ста полноты{D} Христа ведё{G}т.",
    "2 verse": "Со святыми можем мы постичь \nБога измерения все\nИ Христа безмерную любовь —\nТак наполнимся мы к Божьей полноте.",
    "2 chorus": "Иисус нас вместе собирает,\nПосмотри: святые здесь — одно.\nВсех нас любовь Его скрепляет,\nК мере роста полноты Христа ведёт.",
    "3 verse": "Знаем Божий замысел сейчас, \nТайну, что поведана нам:\nВместе видим церковь и Христа,\nИ все вместе посрамляем мы врага.",
    "3 chorus": "Иисус нас вместе собирает,\nПосмотри: святые здесь — одно.\nВсех нас любовь Его скрепляет,\nК мере роста полноты Христа ведёт.",
    "4 verse": "О Отец, чрез Духа укрепи \nВ человеке внутреннем нас,\nПрочно нас в любви укорени,\nО Господь, устроив дом у нас в сердцах.",
    "4 chorus": "Иисус нас вместе собирает,\nПосмотри: святые здесь — одно.\nВсех нас любовь Его скрепляет,\nК мере роста полноты Христа ведёт.",
    "5 verse": "В Теле члены будут скреплены, \nПринося друг другу Христа. \nВсе мы, в меру действуя свою,\nБудем ростом в жизни Тело созидать.",
    "5 chorus": "Иисус нас вместе собирает,\nПосмотри: святые здесь — одно.\nВсех нас любовь Его скрепляет,\nК мере роста полноты Христа ведёт.",
    "6 verse": "Мы — единый новый человек — \nЗамысел Его воплотим:\nПусть прославлен в церкви будет Бог \nИ в Христе Иисусе в вечности. Аминь.",
    "6 chorus": "Иисус нас вместе собирает,\nПосмотри: святые здесь — одно.\nВсех нас любовь Его скрепляет,\nК мере роста полноты Христа ведёт."
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