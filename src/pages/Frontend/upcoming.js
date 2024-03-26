import React, { useEffect, useState } from 'react'
import NotesManage from "../../component/NotesManage"
import { useNotesContext } from '../../context/NotesContext'
import dayjs from 'dayjs'
export default function Upcoming() {
  const [upcomingNotes, setUpcomingNotes] = useState([])
  const { Notes, setNotes } = useNotesContext()
  const today = dayjs().format("YYYY-MM-DD")
  useEffect(()=>{
    let getNotes = Notes.filter(note => note.date > today)
    setUpcomingNotes(getNotes)
  },[Notes])
  return (
    <>
    <NotesManage getAllNotes = {upcomingNotes} setAllNotes = {setUpcomingNotes}/>
    </>
  )
}
