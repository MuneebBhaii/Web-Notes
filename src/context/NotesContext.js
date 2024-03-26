import React, { createContext, useContext, useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../config/firebase'
import { useAuthContext } from './AuthContext'
const NotesContext = createContext()

export default function NotesContextProvider({ children }) {
  const [Notes, setNotes] = useState([])
  const { user } = useAuthContext()

  useEffect(() => {
    const fatchDocument = async () => {
      const q = query(collection(firestore, "notes"), where("createdBy.uid", "==", user.uid))
      const querySnapshot = await getDocs(q);
      let array = []
      querySnapshot.forEach((doc) => {
        let data = doc.data()
        data.id = doc.id
        array.push(data)
        setNotes(array)
      })
    }

    fatchDocument()
  }, [])
  console.log(Notes)
  return (
    <NotesContext.Provider value={{ Notes, setNotes }}>
      {children}
    </NotesContext.Provider>
  )
}

export const useNotesContext = () => useContext(NotesContext)
