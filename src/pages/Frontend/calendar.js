import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { doc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
import { theme, Row, Col, message } from 'antd';
import {
  DeleteOutlined,
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
  }, [fatchDocument()])

  const deleteNote = async (note) => {
    await deleteDoc(doc(firestore, "notes", note.id));
    message.success("Note deleted successfully")
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
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div style={{padding: '8px', borderRadius: 8 , height: '200px', backgroundColor: note.color }} key={i}><h5 className=''>{note.title}</h5><span>{note.list}</span><p className='textmanage'>{note.description}</p><br /><p className='date'>{note.date}</p></div>
            </div>
          )})}
        </div>
      </div>
    </main>
  )
}
