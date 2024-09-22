import fs from 'fs'


const hymnText = {
    "1 verse": "З{G}амысе{D}л у Бо{Em}га ве{D}чен,\nВ{G} вечном про{C}шлом о{G}н возни{D}к,\nВ{G}ечность в бу{D}дуще{Em}м охва{D}тит,\nМе{G}жду ни{C}ми вре{G}мя — ми{D7}г.\nЭ{C}то время для проце{G}сса,\nЧ{C}тоб свершил Он, что хоте{G}л;\nМ{C}ы лишь путники на све{G}те,\nИ{C}бо вечность — наш уде{G}л.",
    "2 verse": "Хочет Бог, чтоб Божьи люди\nБыли скреплены навек\nКак Его сосуд единый,\nСлавный новый человек.\nХочет с жизнью и природой\nСам войти в сосуд Он сей,\nДухом слившись с нашим духом\nК радости, хвале Своей.",
    "3 verse": "Бог работал в трёх аспектах,\nЧудный план чтоб воплотить:\nКак Отец, и Сын, и Дух Он\nХочет в нас Себя внедрить.\nНебо и земля — для плана;\nВсё творенье — это фон;\nС целью сей дух, душу, тело —\nЧеловека создал Он.",
    "4 verse": "В Божьем плане выступает\nДух наш центром и ядром;\nИ когда зовём Иисуса,\nДух Его и наш — одно.\nС центра до периферии\nХочет Бог всё пропитать,\nОбновить ум, чувства, волю,\nВ нашем сердце дом создать.",
    "5 verse": "Созидаемся мы в жизни\nИ скрепляемся в любви.\nЗавершая то, что начал,\nБог Свой план осуществит.\nО Господь, расти внутри нас,\nСозидая нас в Себе,\nКак сосуд тот совокупный,\nГде Бог явлен в полноте.",
    "6 verse": "Как итог и исполненье,\nВстанет церковь в славе всей,\nЧтобы завершить навеки\nЗамысел извечный сей.\nИ сосуд тот совокупный\nБожью славу всю вместит.\nДля Твоей, Господь, мы цели,\nВ нас Свой план осуществи."
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