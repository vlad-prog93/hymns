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
    console.log(error)
  }
}

export const toDeleteHymn = async (dispatch: AppDispatch, id: string) => {
  try {
    const { data } = await axios.delete<string>('http://localhost:5000/api/hymns', { data: { _id: id } })
    dispatch(hymnsSlice.actions.deleteHymn(data))
  } catch (error) {
    console.log(error)
  }
}

export const toUpdateHymn = async (dispatch: AppDispatch, hymn: IHymn) => {
  try {
    const { data } = await axios.patch<IHymn>('http://localhost:5000/api/hymns', { ...hymn })
    dispatch(hymnsSlice.actions.updateHymn(data))
  } catch (error) {
    console.log(error)
  }
}

export const toCreateHymn = async (dispatch: AppDispatch, hymn: IHymn) => {
  try {
    const { data } = await axios.post<IHymn>('http://localhost:5000/api/hymns', { ...hymn })
    dispatch(hymnsSlice.actions.createHymn(data))

  } catch (error) {
    console.log(error)
  }
} 