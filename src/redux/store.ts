import { configureStore } from '@reduxjs/toolkit'
import hymnReducer from './reducers/HymnSlice'
import menuReducer from './reducers/MenuSlice'

export const store = configureStore({
  reducer: {
    hymnReducer,
    menuReducer
  }
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']