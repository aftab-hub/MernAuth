import React, { useContext, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Reset = () => {
  
  axios.defaults.withCredentials = true;

  const {backendUrl} = useContext(AppContext)

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpSubmited, setIsOtpSubmited] = useState(false)

 const inputRefs = useRef([])
   
 // this function is for fill the otp in every input field
  const handleInput = (e, index)=>{
   if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus()
   }
  }

  // this function is for delele the otp with backspace from every input field one by one
  const handleKeyDown = (e, index)=>{
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
        inputRefs.current[index - 1].focus();
    }
  }

  // pasting the otp using [clipboardData] it will automatically spread the opt into input fields
  const handlePaste = (e)=>{
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index)=>{
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

   const onSubmitEmail = async(e)=>{
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl + "/api/user/sendResetOpt", {email})
      if (data.success) {
        toast.success ? toast.success(data.message) : toast.error(data.message)
        data.success && setIsEmailSent(true)
      }
    } catch (error) {
      toast.error(error.message)
    }
   }


   const onSubmitOtp = async(e)=>{
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmited(true)
   }

   const onSubmitNewPassword = async(e)=>{
    e.preventDefault();
     try {
      const {data} = await axios.post(backendUrl + "/api/user/resetPassword", {email, otp, newPassword})
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate('/login')
     } catch (error) {
      toast.error(error.message)
     }
   }

  
  return (
    <div className='flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-blue-400'>
        <img  src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' onClick={()=>navigate('/')} />

     {!isEmailSent && 
        <form className='bg-slate-900 p-8 rounded-lg w-96 text-sm' onSubmit={onSubmitEmail}>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter your registered email address.</p>

        <div className='mb-4 flex items-center  gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] '>
          <img src={assets.mail_icon} className='w-3 h-3' alt="" />

          <input 
           type="email" placeholder='Email Id'
           className='bg-transparent outline-none text-white'
           required value={email} 
           onChange={(e)=> 
           setEmail(e.target.value)}
          />
        </div>

        <button className='cursor-pointer w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white' > Submit</button>
        </form>
}
                       {/*  ---------otp input form --------- */}
       
   {!isOtpSubmited && isEmailSent &&    
       <form className='bg-slate-900 p-8 rounded-lg w-96 text-sm ' onSubmit={onSubmitOtp}>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to email your id.</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>

           {/* here we are creating 6 input fields for otp */}
             {Array(6).fill(0).map((_, index)=>(
              <input type="text" maxLength='1' key={index} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md ' 
              ref={e => inputRefs.current[index] = e}  
              onInput={(e)=> handleInput(e, index)}
              onKeyDown={(e)=>handleKeyDown(e, index)}
              />
             ))}  
          </div>
          <button className='cursor-pointer w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white'>Submit</button>
        </form>
}
             {/* ----------Enter new Password--------- */}
 
 {isOtpSubmited && isEmailSent && 
        <form className='bg-slate-900 p-8 rounded-lg w-96 text-sm' onSubmit={onSubmitNewPassword}>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the new password below.</p>

        <div className='mb-4 flex items-center  gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] '>
          <img src={assets.lock_icon} className='w-3 h-3' alt="" />

          <input 
           type="password" placeholder='Create a new password'
           className='bg-transparent outline-none text-white'
           required value={newPassword} 
           onChange={(e)=> 
           setNewPassword(e.target.value)}
          />
        </div>

        <button className='cursor-pointer w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white' > Submit</button>
        </form>

           }
    </div>
  )
}

export default Reset