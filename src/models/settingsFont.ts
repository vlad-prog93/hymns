export interface ISettingsFont {
  fontSizeText: string,
  fontSizeAccord: string,

  colorText: string,
  colorAccord: string,

  setSettingsFont: (obj: ISettingsFont) => void
}