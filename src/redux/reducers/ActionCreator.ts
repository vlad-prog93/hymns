import { AppDispatch } from "../store"
import { IHymn } from "../../models/hymns"
import { hymnsSlice } from "./HymnSlice"
import axios from "axios"


export const toFetchHymns = async (dispatch: AppDispatch) => {
  try {
    dispatch(hymnsSlice.actions.hymnsFetching())
    const { data } = await axios.get<IHymn[], any>('http://localhost:5000/api/hymns')
    dispatch(hymnsSlice.actions.hymnsFetchingSuccess(data))
    dispatch(hymnsSlice.actions.sortHymns())

  } catch (error) {
    // dispatch(hymnsSlice.actions.hymnsFetchingError(error))
    console.log(error)
  }
} 