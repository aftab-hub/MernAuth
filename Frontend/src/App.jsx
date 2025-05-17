import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import Reset from './pages/Reset'
import VerifyEmail from './pages/VerifyEmail'
import { ToastContainer } from 'react-toastify';

const App = () => {
  
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<Reset />} />
        <Route path="/email-verify" element={<VerifyEmail />} />
      </Routes>
    </div>
  )
}

export default App