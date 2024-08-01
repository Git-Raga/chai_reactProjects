import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Notes from './pages/Notes'
import LoginRegister from './pages/LoginRegister'
 

function App() {
   
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route element={<Notes/>}path='/'/>
        <Route element={<LoginRegister/>}path='/login'/>
      </Routes>
      </BrowserRouter>
      
          
       
    </>
  )
}

export default App
