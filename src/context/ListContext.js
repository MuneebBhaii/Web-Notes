import React, { createContext, useContext, useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../config/firebase'
import { useAuthContext } from './AuthContext'
const ListContext = createContext()

export default function ListContextProvider({ children }) {
  const [lists, setLists] = useState([])

  const { user } = useAuthContext()

  useEffect(() => {
    const getListAll = async () => {
      const q1 = query(collection(firestore, "lists"), where("userId", "==", "all"));
      const q2 = query(collection(firestore, "lists"), where("createdBy.uid", "==", user.uid));
      // jab do different condition ka data get kar na ho . then use below method
      const [querySnapshot1, querySnapshot2] = await Promise.all([getDocs(q1), getDocs(q2)])
      const array = [];
      querySnapshot1.forEach((doc) => {
        array.push(doc.data());
      });
      querySnapshot2.forEach((doc) => {
        array.push(doc.data());
      });
      setLists(array);
    }
    
    getListAll()
  }, [])
  console.log(lists)
  return (
    <ListContext.Provider value={{ lists, setLists }}>
      {children}
    </ListContext.Provider>
  )
}

export const useListContext = () => useContext(ListContext)
