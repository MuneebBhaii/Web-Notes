import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Row, Col, message } from 'antd';
import { collection,setDoc,doc,deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { useAuthContext } from '../../context/AuthContext'
import { firestore } from '../../config/firebase';
import {
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
export default function Today() {
  const { user } = useAuthContext()
  const [notes, setNotes] = useState([])
  const today = dayjs().format("YYYY-MM-DD")
  console.log(today)
  const fatchDocument = async () => {

    const q = query(collection(firestore, "notes"), where("date", ">", today), where("createdBy.uid", "==", user.uid))
    // const querySnapshot = await getDocs(collection(firestore, "notes"));
    const querySnapshot = await getDocs(q);
    let array = []
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      // data.id = doc.id
      array.push(data)
      // console.log(`${doc.id} => ${doc.data()}`);
    })
    setNotes(array)
  }

  useEffect(() => {
    fatchDocument()
  }, [])

  const editNote = async (note) => {
    
    await setDoc(doc(firestore, "notes", note.id), {
      title: "kia hall hai"
    }, { merge: true });
    message.success("Note update successfully")
  }
  const deleteNote = async (note) => {
    await deleteDoc(doc(firestore, "notes", note.id));
    message.success("Note deleted successfully")
  }
  return (
    <>
      <div className='container'>
        <div className="row">
          {notes.map((note, i) => {
            return (
              <div className="col-12 mb-2 col-sm-6  col-md-4 col-lg-3 mt-3 mb-md-3">
              <div className='' style={{ padding: '8px', borderRadius: 8 , height: '200px', backgroundColor: note.color }} key={i}><Row><Col span={20}><h5 className=''>{note.title}</h5></Col><Col span={4}><EditOutlined className='editOption' onClick={() => { editNote(note) }} /><DeleteOutlined className='deleteOption' onClick={() => { deleteNote(note) }} /></Col></Row><span>{note.list}</span><p className='textmanage'>{note.description}</p><br /><p className='date'>{note.date}</p></div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
