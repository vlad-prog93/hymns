import fs from 'fs'


const hymnText = {
    "1 verse": "В мо{A}ём духе, внутри{A7}, — вечной жи{D}зни родни{Bm}к:\nЗдесь Бо{E}г Триеди{E7}ный течё{A}т.\nБог Оте{A}ц есть исто{A7}к, русло — Сы{D}н, Сам Христо{Bm}с,\nИ оби{E}льно мне Ду{E7}х жизнь даё{A}т.",
    "1 chorus": "Как мне до{E}рог, Госпо{E7}дь, Твой пото{A-A7}к!\nДушу-жи{D}знь я отверг наконе{A}ц!\nУглубляй жизни чи{A7}стый пото{D-Bm}к\nИ, придя{A}, дай мне жи{E}знь как вене{A-D-A}ц.",
    "2 verse": "Иисус, Пастырь мой, мне дарует покой\nИ к тихим Он водам ведёт.\nПрекратил я борьбу и свою суету;\nВ том потоке — блаженство моё.",
    "2 chorus": "Как мне дорог, Господь, Твой поток!\nДушу-жизнь я отверг наконец!\nУглубляй жизни чистый поток\nИ, придя, дай мне жизнь как венец.",
    "3 verse": "Я по зову Его во Святое Святых\nПришёл пред лицом Его жить.\nАллилуйя, Иисус ободряет меня:\n«Пребудь во Мне — ты ветвь Лозы».",
    "3 chorus": "Как мне дорог, Господь, Твой поток!\nДушу-жизнь я отверг наконец!\nУглубляй жизни чистый поток\nИ, придя, дай мне жизнь как венец."
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