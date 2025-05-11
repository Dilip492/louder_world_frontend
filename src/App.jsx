import { useState } from 'react'
import Card from './Components/Card'

import EmailPage from './Components/EmailPage'
import { Routes, Route } from 'react-router-dom';
import Otp from './Components/Otp';
import { UserProvider } from "./context/UserContext"

function App() {


  return (
    <>

      <UserProvider>
        <Routes>
          <Route path='/' element={<Card />} />
          <Route path='/Emailverify' element={<EmailPage />} />
          <Route path='/OtpVerification' element={<Otp />} />
        </Routes>
      </UserProvider>
    </>
  )
}

export default App
