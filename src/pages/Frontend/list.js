import React, { useEffect, useState } from 'react'
import NotesManage from "../../component/NotesManage"
import { useNotesContext } from '../../context/NotesContext'
import { useParams } from 'react-router-dom'
import { useListContext } from '../../context/ListContext'
import { useAuthContext } from '../../context/AuthContext'
export default function Today() {
  const param = useParams()
  const listId = param.id
  const [ListName , setListName] = useState("")
  const [listNotes , setListNotes] = useState([])
  const { lists, setLists } = useListContext()
  const { Notes, setNotes } = useNotesContext()
  const { user } = useAuthContext();
  useEffect(() => {
    let getListName = lists.find(list => list.id == listId)
    setListName(getListName)
  }, [listId])

  useEffect(()=>{
      let listNote = Notes.filter(note => note.list == ListName.name)
      setListNotes(listNote)
  },[ListName.name , Notes])
  return (
    <div className='container'>
      <div className="row">
        <div className="col">
          <h1 className='text-center'>{ListName.name} Notes</h1>
        </div>
      </div>
      <NotesManage getAllNotes={listNotes} setAllNotes={setListNotes} />
    </div>
  )
}
