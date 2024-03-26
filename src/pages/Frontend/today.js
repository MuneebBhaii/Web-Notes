import React, { useEffect, useState } from 'react'
import NotesManage from "../../component/NotesManage"
import { useNotesContext } from '../../context/NotesContext'
import dayjs from 'dayjs'
export default function Today() {
  const [todayNotes, setTodayNotes] = useState([])
  const { Notes, setNotes } = useNotesContext()
  const today = dayjs().format("YYYY-MM-DD")
  useEffect(()=>{
    let getNotes = Notes.filter(note => note.date == today)
    setTodayNotes(getNotes)
  },[Notes])
  return (
    <>
    <NotesManage getAllNotes = {todayNotes} setAllNotes = {setTodayNotes}/>
    </>
  )
}
