import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import {setDoc, doc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
import { theme,Row,Col, message } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
export default function Today() {
  const [selectday, setSelectday] = useState()
  const [notes, setNotes] = useState([])
  const today = dayjs(selectday).format("YYYY-MM-DD")
  const { token } = theme.useToken();
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const fatchDocument = async () => {

    const q = query(collection(firestore, "notes"), where("date", "==", today))
    const querySnapshot = await getDocs(q);
    let array = []
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      data.id = doc.id
      array.push(data)
      console.log(`${doc.id} => ${doc.data()}`);
    })
    setNotes(array)
  }

  useEffect(() => {
    fatchDocument()
  }, [notes])

  const deleteNote = async (note) => {
    await deleteDoc(doc(firestore, "notes", note.id));
    message.success("Note deleted successfully")
  }

  const editNote = async (note) => {
    
    await setDoc(doc(firestore, "notes", note.id), {
      title: "kia hall hai"
    }, { merge: true });
    message.success("Note update successfully")
  }
  return (
    <main className='bg-light'>
      <div className="container">
        <div className="row">
          <div style={wrapperStyle}>
            <div className="col-12 mb-2 col-sm-6  col-md-4 col-lg-3 mb-md-3">
              <input type='date' onChange={e => setSelectday([e.target.value])} />
            </div>
          </div>
        </div>
        <div className="row">
        {notes.map((note, i) => {
            return (
              <div className="col-12 mb-2 col-sm-6  col-md-4 col-lg-3 mb-md-3">
              <div className='' style={{ padding: '8px', borderRadius: 8 , height: '200px', backgroundColor: note.color }} key={i}><Row><Col span={20}><h5 className=''>{note.title}</h5></Col><Col span={4}><EditOutlined className='editOption' onClick={() => { editNote(note) }} /><DeleteOutlined className='deleteOption' onClick={() => { deleteNote(note) }} /></Col></Row><span>{note.list}</span><p className='textmanage'>{note.description}</p><br /><p className='date'>{note.date}</p></div>
              </div>
          )})}
        </div>
      </div>
    </main>
  )
}
