import { useState } from "react"
import toast, { ToastBar } from "react-hot-toast";
import axios from "axios";
import { useAuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
const useLogin =()=>{
    const[loading,setLoading] = useState(false);
    const{authuser,setAuthUser} = useAuthContext();

    const navigate = useNavigate();

    const login = async(email,password)=>{
        
        if(!email || !password){
            toast.error("please enter the password and email ")
        }
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/auth/login',{
                email:email,
                password:password,
            },
        {
          headers:{  "Content-Type": "application/json"}
        }
        )

        console.log(res.data);
        const user = res.data.user;
        if(user.error){
            throw new Error(error.response?.data?.message || error.message);
        }
        localStorage.setItem("user",JSON.stringify(user))
        setAuthUser(user);
          navigate("/");
        toast.success('Successfully Login !')
            
        } catch (error) {
            toast.error(error.message)
        }
        finally{
            setLoading(false);
        }
    }
    return {login,loading}
}

export default useLogin

