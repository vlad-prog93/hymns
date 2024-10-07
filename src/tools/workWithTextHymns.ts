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


export const deleteAccords = (obj: { [key: string]: string }): { [key: string]: string } => {
  const result = { ...obj }
  Object.keys(result).forEach((key) => {
    result[key] = result[key].replace(/{[^\}]*\}/g, '')
  })
  return result
}