import React from "react";
import { ISettingsFont } from '../models/settingsFont'

export const stateSettingsFont: ISettingsFont = {
  fontSizeText: '14px',
  fontSizeAccord: '14px',

  colorText: '#000000',
  colorAccord: '#000000',

  setSettingsFont: (obj: ISettingsFont) => { }
}


export const contextSettingsFont = React.createContext<ISettingsFont>(stateSettingsFont)