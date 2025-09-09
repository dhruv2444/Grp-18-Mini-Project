import axios from "axios";
import { useState } from "react"
import { useAuthContext } from "../Context/AuthContext";
import toast from "react-hot-toast";

const useLogout = ()=>{
    const[loading,setLoading] = useState(false);
    const{setAuthUser} = useAuthContext();
    const logout = async()=>{
        setLoading(true)
        try {

            const user = localStorage.getItem('user')

            if(user){
                localStorage.removeItem("user");

                setAuthUser(null);
            }
            
         
           toast.success("Logout successFully ")
        } catch (error) {
            toast.error("fail to logout problem in the logout hook")

            
        }
        finally{
            setLoading(false)


        }

    }
    return{loading,logout};
}

export default useLogout;