import React, { useEffect, useState } from 'react'
import { Row, Col, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {doc, setDoc, collection, getDocs,deleteDoc, query, where } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
import { useAuthContext } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
export default function ListType() {
  const param = useParams();
  const listId = param.id;
  const { user } = useAuthContext();
  const [notes, setNotes] = useState([])
  const [listName, setListName] = useState("");


  const getListName = async () => {
    const listName = query(collection(firestore, "lists"), where("id", "==", listId))
    const querySnapshot = await getDocs(listName);
    querySnapshot.forEach((doc) => {
      let name = doc.data().name;
      setListName(name)
    })
  }
  const fatchDocument = async () => {
    const q = query(collection(firestore, "notes"),
     where("createdBy.uid", "==", user.uid),
     where("list", "==", listName));
    
    let array = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      array.push(doc.data())
    });
    setNotes(array)
  }
  useEffect(() => {
    fatchDocument()
    getListName()
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
    <div className='container'>
      <div className="row">
        <div className="col">
          <h1 className='text-center'>{listName} Notes</h1>
        </div>
      </div>
      <div className="row mt-3">
        {notes.map((note, i) => {
          return (
            <div className="col-12 mb-2 col-sm-6  col-md-4 col-lg-3 mb-md-3">
            <div className='' style={{ padding: '8px', borderRadius: 8 , height: '200px', backgroundColor: note.color }} key={i}><Row><Col span={20}><h5 className=''>{note.title}</h5></Col><Col span={4}><EditOutlined className='editOption' onClick={() => { editNote(note) }} /><DeleteOutlined className='deleteOption' onClick={() => { deleteNote(note) }} /></Col></Row><span>{note.list}</span><p className='textmanage'>{note.description}</p><br /><p className='date'>{note.date}</p></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
