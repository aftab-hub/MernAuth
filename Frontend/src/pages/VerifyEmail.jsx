import React, { useContext, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const VerifyEmail = () => {
 
  //  telling Axios to send cookies with requests to the backend, it's only use when we work with cookies.
  // If you're using tokens in localStorage or headers (like Bearer tokens), you don’t need it.
  axios.defaults.withCredentials = true;

const {backendUrl, isLoggedIn, userData, getUserData} = useContext(AppContext)
  const navigate = useNavigate()
  
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


  // this onSubmitHandler for verifying the email
  const onSubmitHandler = async (e)=>{
    try {
      e.preventDefault()
      // all the input field's data will added in this = otpArray
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('') // join here the otp
      const {data} = await axios.post(backendUrl + "/api/user/verifyEmail", {otp})
      if (data.success) {
         toast.success(data.message)
         getUserData()
         navigate('/')
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }


  useEffect(()=>{
    isLoggedIn && userData && userData.isAccountVerified && navigate('/')
  },[isLoggedIn, userData])
  return (
    <div className='flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-blue-400'>
           <img src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' onClick={()=>navigate('/email-verify')} />
        <form className='bg-slate-900 p-8 rounded-lg w-96 text-sm ' onSubmit={onSubmitHandler}>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
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
          <button className='cursor-pointer w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white'>Verify email</button>
        </form>
    </div>
  )
}

export default VerifyEmail