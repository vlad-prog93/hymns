export const handleTranslate = (key: string): string => {
  const translatedKey = key.replace(/verse/g, 'куплет').replace(/bridge/g, 'куплет-припев').replace(/chorus/g, 'припев')
  return translatedKey
}

export const changeViewTextHymn = (obj: { [key: string]: string }) => {
  const result = { ...obj }
  Object.keys(result).forEach((key) => {

    const rows_text = result[key].split('\n')
    const res = rows_text.map((str) => {
      let shift = 0
      let text_accords = []
      const obj: any = {}
      let text_without_accords = str
      while (text_without_accords.match(/{[^\}]*\}/)) {
        text_without_accords = text_without_accords.replace(/{[^\}]*\}/, (match: string) => {
          const a = match.replace(/{/, '').replace(/}/, '')
          if (a) {
            obj[text_without_accords.indexOf(match) - 1 - shift] = a
            shift = shift + a.length - 1
          }
          return ''
        })
      }
      for (let key in obj) {
        text_accords[Number(key)] = obj[key]
      }

      let text_accords_long: any = []
      for (let i of text_accords) {
        if (!i) {
          text_accords_long.push(' ')
        } else {
          text_accords_long.push(i)
        }
      }
      text_accords_long = text_accords_long.join('')
      let text_without_accords_long = text_without_accords

      let quantityAddSpaceInEndStr = text_accords_long.length - text_without_accords_long.length

      if (quantityAddSpaceInEndStr < 0) {
        let space = ''
        while (quantityAddSpaceInEndStr !== 0) {
          space += ' '
          quantityAddSpaceInEndStr += 1
        }
        text_accords_long = text_accords_long + space
      }
      if (quantityAddSpaceInEndStr > 0) {
        let space = ''
        while (quantityAddSpaceInEndStr !== 0) {
          space += ' '
          quantityAddSpaceInEndStr -= 1
        }
        text_without_accords_long = text_without_accords_long + space
      }

      return text_accords_long + '\n' + text_without_accords_long
    })
    result[key] = res.join('\n')
  })

  return result
}

export const moveAccordsInText = (obj: { [key: string]: string }): { [key: string]: string } => {
  const result = { ...obj }

  Object.keys(result).forEach((key, ind) => {
    const arrAccords: string[] = []
    const arrTexts: string[] = []

    result[key].split('\n').forEach((str, i) => {
      if (i % 2 === 0) {
        arrAccords.push(str)
      } else {
        arrTexts.push(str)
      }
    })


    const arr = arrAccords.map((str, iStr) => {
      let resultTextStr = ''
      let shift = 1

      str.split('').forEach((accord, indAccord, arrayStr) => {
        if (shift !== 1) {
          shift -= 1
          if (arrTexts[iStr].split('')[indAccord]) {
            resultTextStr += arrTexts[iStr].split('')[indAccord]
          }
          return
        }
        if (accord !== ' ') {
          let letter = accord
          while (/\S/.test(arrayStr[indAccord + shift]) && arrayStr[indAccord + shift]) {
            letter += arrayStr[indAccord + shift]
            shift += 1
          }
          resultTextStr = resultTextStr + arrTexts[iStr][indAccord] + '{' + letter + '}'
          return
        }
        resultTextStr += arrTexts[iStr].split('')[indAccord]
      })
      return resultTextStr
    })

    result[key] = arr.join('\n')
  })

  return result
}







// DeleteAccords
export const deleteAccords = (obj: { [key: string]: string }): { [key: string]: string } => {
  const result = { ...obj }
  Object.keys(result).forEach((key) => {
    result[key] = result[key].replace(/{[^\}]*\}/g, '')
  })
  return result
}


// balanceStr ---- уравнять по длине строчки   --- дано СТРОКА: "   G       C\nБог мудро являет\n"    нужно получить строку: "   G       C   \nБог мудро являет\n" 
export const balanceStr = (text: string) => {
  const arr_from_text = text.split('\n').map((str, index, arr) => {

    // проверяем, это строка является аккордами или нет
    if (index % 2 === 0) {

      let text_with_accord = arr[index] // строчка текста с аккордами
      let text_without_accord = arr[index + 1] // строчка текста без аккордов

      let shift = text_with_accord.length - text_without_accord.length // дельта длины строчек

      if (shift < 0) {
        while (shift < 0) {
          text_with_accord += ' '
          shift += 1
        }
      }
      return text_with_accord
    }

    if (index % 2 === 1) {
      let text_with_accord = arr[index - 1]
      let text_without_accord = arr[index]
      let shift = text_with_accord.length - text_without_accord.length
      if (shift > 0) {
        while (shift > 0) {
          text_without_accord += ' '
          shift -= 1
        }
      }
      return text_without_accord
    }
  })

  return arr_from_text.join('\n')
}

// AccordUP   ---- аккорды поднять наверх      --- дано: СТРОКА: "Бог{G} мудро{C} являет"           нужно получить строку: "   G       C\nБог мудро являет"
export const accordUP = (text: string): string => {

  // 1 часть результата
  let text_with_accord: string

  // 2 часть результата
  let text_without_accord: string

  let shift = 0  // смещение аккорда

  const index_and_accord: { [key: number]: string } = {} // {2: G} , где 2 - индекс на котором находится аккорд, G - сам аккорд

  text_without_accord = text // сейчас цикл while будет убирать поочередно аккорды и результат №2 получим
  while (text_without_accord.match(/{[^\}]*\}/)) {
    text_without_accord = text_without_accord.replace(/{[^\}]*\}/, (match: string) => {
      const accord = match.replace(/{/, '').replace(/}/, '') // пример: G, F, F#m
      index_and_accord[text_without_accord.indexOf(match) - 1 - shift] = accord
      shift = shift + accord.length - 1
      return ''
    })
  }

  // получение результата №1
  const arr_with_accord_and_undefined: string[] | undefined[] = []
  for (let key in index_and_accord) {
    arr_with_accord_and_undefined[Number(key)] = index_and_accord[key]
  }

  // функцию map нельзя использовать для обхода по пустым слотам, поэтому "for of"
  let arr_with_accord_and_string: string[] = []
  for (let i of arr_with_accord_and_undefined) {
    !i ? arr_with_accord_and_string.push(' ') : arr_with_accord_and_string.push(i)
  }
  text_with_accord = arr_with_accord_and_string.join('') + '\n'  // результат №2




  return text_with_accord + text_without_accord
}

// AccordDown ---- спустить аккорды вниз       --- дано: СТРОКА "   G       C\nБог мудро являет\n"    нужно получить строку: Бог{G} мудро{C} являет\n
export const accordDown = (text: string) => {
  const arr_from_text = balanceStr(text).split('\n')

  let arr_with_accord: string[] = [] // массив строчек текста с аккордами
  let arr_without_accord: string[] = [] // массив строчек текста без аккордов
  let text_result: string = '' // результат

  // заполняем два массива с аккордами и текстом
  arr_from_text.forEach((el, ind) => ind % 2 ? arr_with_accord.push(el) : arr_without_accord.push(el))

  // пройтись по всему тексту массивов с аккордами и без
  for (let i = 0; i < arr_with_accord.length; i++) {
    const text_with_accord = arr_with_accord[i]
    const text_without_accord = arr_without_accord[i]

    // пройтись по тексту строчки
    for (let j = 0; j < text_with_accord.length; j++) {

      if (text_with_accord[j] === ' ') {
        text_result += text_without_accord[j]
      } else {
        let accord = text_with_accord[j]
        let text = text_without_accord[j]
        let shift = 1

        while (text_with_accord[j + shift] !== ' ' || text_with_accord[j + shift] !== undefined) {
          accord += text_with_accord[j + shift]
          text += text_without_accord[j + shift]
          shift += 1
        }

        text_result += '{' + accord + '}' + text
        j += shift
      }
    }
  }

  return text_result
}


