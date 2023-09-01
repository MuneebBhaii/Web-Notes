import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { collection, getDocs, query, where } from 'firebase/firestore';
// import { useAuthContext } from '../../context/AuthContext'
import { firestore } from '../../config/firebase';
export default function Today() {
  // const { user } = useAuthContext()
  const [notes, setNotes] = useState([])
  const today = dayjs().format("YYYY-MM-DD")
  console.log(today)
  const fatchDocument = async () => {

    const q = query(collection(firestore, "notes"), where("date", ">", today))
    // const querySnapshot = await getDocs(collection(firestore, "notes"));
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
  }, [])
  return (
    <>
      <div className='container'>
        <div className="row">
          {notes.map((note, i) => {
            return (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div style={{ padding: '8px', borderRadius: 8 , height: '220px', backgroundColor: note.color }} key={i}><h5 className=''>{note.title}</h5><span>{note.list}</span><p className='textmanage'>{note.description}</p><br /><p className='date'>{note.date}</p></div>
            </div>
          )})}
        </div>
      </div>
    </>
  )
}
