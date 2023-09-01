import React from 'react'
import {BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
// layout
import Frontend from "./Frontend"
import Auth from "./Auth"
import { useAuthContext } from '../context/AuthContext'
import PrivateRoute from '../context/PrivateRoute'
export default function Index() {
  const { isAuthenticated} = useAuthContext()
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/*" element={<PrivateRoute Component={Frontend}/>} />
      <Route path="/Auth/*" element={!isAuthenticated ? <Auth/> : <Navigate to ="/" replace/>} />
      <Route path='*' element ={<h1 className='text-center'>page not found <br /> 404</h1>} />
    </Routes>
    </BrowserRouter>
  )
}
