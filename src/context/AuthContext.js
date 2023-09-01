import React , {createContext ,useContext,useEffect,useState} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
export const AuthContext = createContext()
export default function AuthContextProvider({children}) {
  const [user , setUser] = useState({})
  const [isAuthenticated , setIsAuthenticated]= useState(false)
 useEffect(()=>{
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user)
      setIsAuthenticated(true)
    } else {
      console.log("not signed in")
    }
  });
 } , [])
 
  return (
    <AuthContext.Provider value={{user , isAuthenticated ,setIsAuthenticated}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = ()=>{
  return useContext(AuthContext)
}