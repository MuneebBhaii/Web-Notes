import "./App.scss";
import React from 'react'
import "bootstrap/dist/js/bootstrap.bundle"
import Routes from "./pages/Routes"
import AuthContextProvider from "./context/AuthContext";
import NotesContextProvider from "./context/NotesContext";
export default function App() {
  return (
    <>
      <AuthContextProvider>
        {/* <NotesContextProvider> */}
          <Routes />
        {/* </NotesContextProvider> */}
      </AuthContextProvider>
    </>
  )
}
