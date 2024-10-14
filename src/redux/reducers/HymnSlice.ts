import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IHistoryHymn, IHymn, IHymnText } from "../../models/hymns";
import { deleteFavoriteHymnLS, deleteHistoryHymnLS, getHistoryHymnsLS, setFavoriteHymnLS, setHistoryHymnLS } from "../../tools/storage";

interface HymnState {
  hymns: IHymn[],
  currentHymn: IHymn | null,
  favoriteHymns: IHymn[],
  historyHymns: IHistoryHymn[],
  foundedHymns: IHymn[],
  isTextWithAccord: boolean,
  isTranposeOpen: boolean,
  isLoading: boolean,
  error: null | string,
  isShowAutoScroll: boolean,
  isScroll: boolean
}

const initialState: HymnState = {
  hymns: [],
  currentHymn: null,
  favoriteHymns: [],
  historyHymns: [],
  foundedHymns: [],
  isTextWithAccord: false,
  isTranposeOpen: false,
  isLoading: false,
  error: null,
  isShowAutoScroll: false,
  isScroll: false
}

export const hymnsSlice = createSlice({
  name: 'hymn',
  initialState,
  reducers: {

    //Запрос гимнов
    hymnsFetching(state) {
      state.isLoading = true
    },

    hymnsFetchingSuccess(state, action: PayloadAction<IHymn[]>) {
      state.isLoading = false
      state.error = null
      state.hymns = action.payload
    },

    hymnsFetchingError(state, action: PayloadAction<any>) {
      state.isLoading = false
      state.error = action.payload
    },

    //гимн с аккордами или без
    toggleHymnText(state, action: PayloadAction<boolean>) {
      state.isTextWithAccord = action.payload
    },

    // установить и удалить текущий гимн
    setCurrentHymn(state, action: PayloadAction<IHymn>) {
      state.currentHymn = action.payload
    },

    deleteCurrentHymn(state) {
      state.currentHymn = null
    },


    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },

    // установить избранные гимны, добавить в избранные, удалить из избранных
    setFavoriteHymnsList(state, action: PayloadAction<string[]>) {
      const far: IHymn[] = []

      action.payload.forEach(ID => {
        state.hymns.forEach(hymn => {
          if (hymn._id === ID) {
            far.push(hymn)
          }
        })
      })
      state.favoriteHymns = far
    },

    setFavoriteHymn(state, action: PayloadAction<string>) {
      setFavoriteHymnLS(action.payload)
      state.favoriteHymns.push(...state.hymns.filter(hymn => hymn._id === action.payload))
    },

    deleteFavoriteHymn(state, action: PayloadAction<string>) {
      deleteFavoriteHymnLS(action.payload)
      state.favoriteHymns = state.favoriteHymns.filter(hymn => hymn._id !== action.payload)
    },

    // сортировка гимнов
    sortHymns(state) {
      state.hymns = [...state.hymns.sort((a, b) => a.shortText.toLowerCase().localeCompare(b.shortText.toLowerCase()))]
    },

    //перелистывание гимнов
    prevHymn(state) {
      if (state.currentHymn) {
        const ind = state.currentHymn.number === 1 ? state.hymns.length : state.currentHymn.number - 1
        state.currentHymn = state.hymns.find(hymn => hymn.number === ind) || null
      }
    },

    nextHymn(state) {
      if (state.currentHymn) {
        const ind = state.hymns.length === state.currentHymn.number ? 1 : state.currentHymn.number + 1
        state.currentHymn = state.hymns.find(hymn => hymn.number === ind) || null
      }
    },


    // транспонирование гимнов
    toggleTranposeMenu(state, action: PayloadAction<boolean>) {
      state.isTranposeOpen = action.payload
    },

    transposeAccords(state, action: PayloadAction<IHymnText>) {
      if (state.currentHymn) {
        state.currentHymn.text_with_accords = action.payload
      }
    },

    // найденные гимны
    hymnsFounded(state, action: PayloadAction<IHymn[]>) {
      state.foundedHymns = action.payload
    },

    // история
    getHistoryHymns(state) {
      const hymns = getHistoryHymnsLS()
      state.historyHymns = hymns.sort((a, b) => b.time - a.time)
    },

    addHistoryHymn(state, action: PayloadAction<IHistoryHymn>) {
      if (state.historyHymns.length === 5) {
        deleteHistoryHymnLS()
        state.historyHymns = state.historyHymns.splice(1, state.historyHymns.length - 1)
      }
      const isAlreadyOpened = state.historyHymns.find(historyHymn => historyHymn._id === action.payload._id)
      if (!isAlreadyOpened) {
        state.historyHymns.unshift(action.payload)
        setHistoryHymnLS(action.payload)
      }
    },

    deleteHymn(state, action: PayloadAction<string>) {
      state.hymns = state.hymns.filter(hymn => hymn._id !== action.payload)
    },

    updateHymn(state, action: PayloadAction<IHymn>) {
      state.hymns = state.hymns.map(hymn => {
        if (hymn._id === action.payload._id) {
          return action.payload
        }
        return hymn
      })
    },

    createHymn(state, action: PayloadAction<IHymn>) {
      state.hymns.push(action.payload)
    },

    showAutoScroll(state) {
      state.isShowAutoScroll = true
    },

    hideAutoScroll(state) {
      state.isShowAutoScroll = false
    },

    onScroll(state) {
      state.isScroll = true
    },

    offScroll(state) {
      state.isScroll = false
    }
  }
})

export default hymnsSlice.reducer