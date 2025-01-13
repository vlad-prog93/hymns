import { IHistoryHymn, IHymn } from "../models/hymns"

export const getFavoriteHymnsLS = (): string[] => {
  const hymnsString = localStorage.getItem('favorite')
  return hymnsString ? JSON.parse(hymnsString) : []
}

export const setFavoriteHymnLS = (value: string) => {
  const hymnsString = localStorage.getItem('favorite')
  const hymnsList: string[] = hymnsString ? JSON.parse(hymnsString) : []
  hymnsList.push(value)
  return localStorage.setItem('favorite', JSON.stringify(hymnsList))
}

export const deleteFavoriteHymnLS = (value: string) => {
  const hymnsString = localStorage.getItem('favorite')
  const hymnsList: string[] = hymnsString ? JSON.parse(hymnsString) : []
  return localStorage.setItem('favorite', JSON.stringify(hymnsList.filter((id: string) => id !== value)))
}


export const getHistoryHymnsLS = (): IHistoryHymn[] => {
  const hymnsString = localStorage.getItem('history')
  return hymnsString ? JSON.parse(hymnsString) : []
}

export const setHistoryHymnLS = (value: IHistoryHymn) => {
  const hymnsString = localStorage.getItem('history')
  const hymnsList: IHistoryHymn[] = hymnsString ? JSON.parse(hymnsString) : []
  hymnsList.push(value)
  return localStorage.setItem('history', JSON.stringify(hymnsList))
}

export const deleteHistoryHymnLS = () => {
  const hymnsString = localStorage.getItem('history')
  const hymnsList: IHistoryHymn[] = hymnsString ? JSON.parse(hymnsString) : []
  return localStorage.setItem('history', JSON.stringify(hymnsList.splice(1, hymnsList.length - 1)))
}