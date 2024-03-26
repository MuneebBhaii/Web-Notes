import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useNotesContext } from '../../context/NotesContext'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { firestore } from '../../config/firebase'
import { useListContext } from '../../context/ListContext'
import { Select, message } from 'antd'
const initial = { title: "", list: null, date: "", description: "" }
export default function Notes() {
  const param = useParams()
  const navigate =  useNavigate()
  const { lists, setLists } = useListContext()
  const { Notes, setNotes } = useNotesContext()
  const [data, setData] = useState(initial)
  const [isEdit, setIsEdit] = useState(false)
  useEffect(() => {
    const selectNote = Notes.find(note => note.id == param.id)
    setData(selectNote)
  }, [])

  const handlechange = (e) => {
    setData(s => ({ ...s, [e.target.name]: e.target.value }))
  }

  const editblog = () => {
    setIsEdit(true)
  }

  const handleDelete = async () => {
    const currentNotes = Notes.filter(note => note.id != param.id)
    setNotes(currentNotes)
    setData(null)
    message.success("Delete note successfully")
    navigate("/")
    await deleteDoc(doc(firestore, "notes", param.id))
  }

  const handleSave = async () => {
    const { title, list, date, description } = data
    const update = {...data,
      title, list, date, description
    }
    await setDoc(doc(firestore, "notes", update.id), update);
    Notes.find(note => {
      if (note.id == param.id) {
        note.color = update.color;
        note.title = update.title;
        note.list = update.list;
        note.description = update.description;
        note.date = update.date
      }
    })
    setData(s => ({ ...s, update }))
    message.success("A notes updated successfully")
    const afterUpdate = Notes.map(sticky => sticky)
    setNotes(afterUpdate)
    setIsEdit(false)
  }

  return (
    <>
      <div className="container">
        <div className='row'>
          <h1 className='text-center'>Note</h1>
        </div>
        {data
          ?
          <div style={{ minWidth: "325px", maxWidth: "80%", backgroundColor: "blue", border: "none", margin: "0", padding: "10px", borderRadius: "8px", margin: "1rem auto" }} id='para'>
            <div className='row'>
              <div className="col" style={{ display: "flex", justifyContent: "flex-end", margin: "1rem 1rem 0 0" }}>
                <button className='btn btn-secondary' onClick={editblog}>Edit</button>
                <button className='ms-2 btn btn-danger' onClick={handleDelete}>Delete</button>
              </div>
            </div>
            <div className="row mt-3">
              <div className='col-4'><h3>Title:</h3></div>
              <div className='col-xs-8 col-sm-8 col-md-6 col-lg-6'>
                {isEdit ?
                  <input className='textEdit' name='title' value={data.title} onChange={handlechange} />
                  : <p className='text'>{data.title}</p>
                }
              </div>
            </div>
            <div className="row mt-3">
              <div className='col-4'><h3>Date:</h3></div>
              <div className='col-xs-8 col-sm-8 col-md-6 col-lg-6'>
                {isEdit ?
                  <input type='date' className='textEdit' name='date' value={data.date} onChange={handlechange} />
                  : <p className='text'>{data.date}</p>
                }
              </div>
            </div>
            <div className="row mt-3">
              <div className='col-4'><h3>Category:</h3></div>
              <div className='col-xs-8 col-sm-8 col-md-6 col-lg-6'>
                {isEdit ?
                  <select placeholder="Select list" className='textEdit' onChange={e => setData(s => ({...s , list:e.target.value}))}>
                    {lists.map((list, i) => {
                      return <option key={i} className='option' value={list.name}>{list.name}</option>
                    })}
                  </select>
                  : <p className='text'>{data.list}</p>
                }
              </div>
            </div>
            <div className="row mt-3">
              <div className='col'><h3>Description:</h3></div>
            </div>
            <div className='row mt-3'>
              <div className='col '>
                {isEdit ?
                  <textarea rows="5" className='textEdit textarea' name='description' value={data.description} onChange={handlechange} />
                  : <p className='text'>{data.description}</p>
                }
              </div>
            </div>
            {isEdit ?
              <div className="row mt-3 float-right">
                <button className='btn btn-primary w-25 m-auto' onClick={handleSave}>Save</button>
              </div>
              : ""
            }
          </div>
          :
          <h1 className='bg-secondary py-4 text-center text-white mt-5'>Todo not have</h1>
        }
      </div>
    </>
  )
}
