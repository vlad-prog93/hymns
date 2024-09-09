import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MenuState {
  isMenuActive: boolean
}

const initialState: MenuState = {
  isMenuActive: false
}

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    toogleMenuActive(state, action: PayloadAction<boolean>) {
      state.isMenuActive = action.payload
    }
  }
})

export default menuSlice.reducer