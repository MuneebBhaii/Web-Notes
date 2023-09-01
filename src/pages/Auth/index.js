import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './Register'
import Login from './Login'

export default function Index() {
  return (
    <Routes>
        <Route path='login' element={<Login/>}/>
        <Route path='register' element={<Register/>}/>
    </Routes>
  )
}
