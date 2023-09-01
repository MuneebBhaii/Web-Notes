import "./App.scss";
import React from 'react'
import "bootstrap/dist/js/bootstrap.bundle"
import Routes from "./pages/Routes"
import AuthContextProvider from "./context/AuthContext";
export default function App() {
  return (
    <>
    <AuthContextProvider>
      <Routes />
    </AuthContextProvider>
    </>
  )
}
