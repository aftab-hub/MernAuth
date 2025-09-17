import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()

export const AppContextProvider = (props) =>{
  
       //  telling Axios to send cookies with requests to the backend
       axios.defaults.withCredentials = true;

    const backendUrl =  "https://mernauth-backend-y0er.onrender.com"; // importing the env variables 
    const [isLoggedIn, setIsLoggedIn] = useState(false)  // for login 
    const [userData, setUserData] = useState(false) // for storing the data in userData

    // checking the authentication 
    const getAuthState = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/isAuth')
            if (data.success) {
                setIsLoggedIn(true)
                getUserData()
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }


    const getUserData = async () => {   // to get user data {name} after login
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
            
        } catch (error) {
          toast.error(error.message)  
        }
    }
    
  

 

    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData,
        getAuthState
    }

    return(
        <AppContext.Provider value={value}>
         {props.children}
        </AppContext.Provider>
    )
}
