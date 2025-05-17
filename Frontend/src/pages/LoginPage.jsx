import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'


const loginPage = () => {

  const [state, setState] = useState("Sign Up") // setting the state of the app

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const {backendUrl, setIsLoggedIn, getUserData} = useContext(AppContext)



  // this onSubmitHandler for login form
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()

      axios.defaults.withCredentials = true // to allow cookies to be sent with the request

      if (state === 'Sign Up') {
      const {data} = await axios.post(backendUrl + '/api/user/register',{name, email, password})
       
      if (data.success) {
        setIsLoggedIn(true)
        getUserData()
        navigate('/')
        
      }else{
        toast.error(data.message)
      }

      }else{
        const {data} = await axios.post(backendUrl + '/api/user/login',{email, password})
        if (data.success) {
          setIsLoggedIn(true)
          getUserData()
          navigate('/')
          
        }else{
          toast.error(error.message)
        }
  
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (


    <div className='flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-blue-400'>
     <img src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' onClick={()=>navigate('/')} />
       <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create account' : 'Login'}</h2>
        <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account'} </p>
        <form onSubmit={onSubmitHandler} >

        {state === 'Sign Up' && 
           (<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
           <img src={assets.person_icon} alt="" />
           <input type="text" className='outline-none ' placeholder='Full Name' required onChange={(e)=>setName(e.target.value)} value={name} />
         </div>)
      }
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input type="text" className='outline-none ' placeholder='Email' required onChange={(e)=>setEmail(e.target.value)} value={email}/>
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input type="text" className='outline-none' placeholder='Password' required onChange={(e)=>setPassword(e.target.value)} value={password}/>
          </div>

          <p className='cursor-pointer text-indigo-500 mb-4' onClick={()=>navigate('/reset-password')}>Forgot password?</p>
          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer'>{state} </button>
        </form>

         {state === 'Sign Up' ?
       ( <p className='text-center text-gray-400 text-xs mt-4'>Already have an account?
        <span onClick={()=>setState('Login')} className='text-blue-400 underline cursor-pointer mx-1'>Login here</span>
        </p>)
        :
        (<p className='text-center text-gray-400 text-xs mt-4'>Don't have an account?
        <span onClick={()=>setState('Sign Up')} className='text-blue-400 underline cursor-pointer mx-1'>Sign up</span>
        </p>)
        

        }

        
       </div>
    </div>
    
  )
}

export default loginPage