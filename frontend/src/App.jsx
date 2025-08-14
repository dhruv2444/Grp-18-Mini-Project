import React from 'react'
import Nav from './Component/Nav'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Signup from './pages/Signin/Signup'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home/Home'

const App = () => {
  return (

    <>
    <div className=' h-full  py-4'>

    <div className='max-w-[90vw] mx-auto'>
    <Nav/>
    <div>
      <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path='/login' element = {<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        
      </Routes>
       <Toaster/>
    </div>
      
    </div>
    </div>

    
    
    </>
  )
}

export default App
