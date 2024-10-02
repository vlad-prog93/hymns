export interface IHymnText {
  [key: string]: string
}

export interface IHymn {
  _id: string,
  number: number,
  collection: string,
  shortText: string,
  text: IHymnText,
  text_with_accords: IHymnText
}

export enum Transpose {
  UP = 'UP',
  DOWN = 'DOWN'
}

export interface IHistoryHymn extends IHymn {
  time: number
}