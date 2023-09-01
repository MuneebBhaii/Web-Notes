import React, { useEffect, useState } from 'react'
// import dayjs from 'dayjs'
import { collection, getDocs ,query , where } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
import { useAuthContext } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
export default function ListType() {
  const param = useParams();
  const listId  = param.id;
  const {user} = useAuthContext();
  const [notes, setNotes] = useState([])
  const [listName, setListName] = useState("");


  const getListName = async()=>{
    const listName = query(collection(firestore , "lists"),where("id" , "==" ,listId))
    const querySnapshot = await getDocs(listName);
    querySnapshot.forEach((doc) => {
      let name = doc.data().name;
      setListName(name)
    })
  }
  const fatchDocument = async () => {
    console.log(listName)
    const q = query(collection(firestore, "notes"), where("list", "==", listName), where("createdBy.uid", "==", user.uid))
    // const querySnapshot = await getDocs(collection(firestore, "notes"));
    const querySnapshot = await getDocs(q);
    let array = []
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      console.log(data)
      array.push(data)
    })
    setNotes(array)
    fatchDocument()
  }

  useEffect(() => {
    console.log(listName)
    getListName()
  }, [listId])
  return (
    <div className='container'>
      <div className="row mt-3">
      {notes.map((note, i) => {
        return(
          <div className="col-12 mb-2 col-sm-6  col-md-4 col-lg-3 mb-md-3">
            <div style={{ padding: '8px', borderRadius: 8 , height: '200px', backgroundColor: note.color }} key={i}><h5 className=''>{note.title}</h5><span>{note.list}</span><p className='textmanage'>{note.description}</p><br /><p className='date'>{note.date}</p></div>
          </div>
        ) 
      })}
      </div>
    </div>
  )
}
