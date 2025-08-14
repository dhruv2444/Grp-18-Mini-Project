import { useState } from "react"
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useSignup = ()=>{
    const[loading,setLoading] = useState(false);
     const navigate = useNavigate();
    
    const signup = async(firstName,lastName,email,password)=>{
        if(!firstName || !lastName || !email || !password){
            toast.error("Please fill all the feilds");
            return ;
        }
        setLoading(true);
        try {

            const res =  await axios.post("http://localhost:5000/auth/signup",{
                firstName,lastName,email,password
            },{
                Headers:{"Content-Type": "application/json"}
            })

            console.log(res.data.user.firstName);
            const user = res.data.user;
            if(res.data.error){
                throw new Error(res.data.error);
            }
            localStorage.setItem("user",JSON.stringify(user))
            toast.success("successfully signup in");
            navigate("/")
        } catch (error) {
            console.log("error in the signup hook",error.message);
            toast.error(error.message);
            
        }
        finally{
            setLoading(false);
        }

    }
    return {loading,signup};
}

export default useSignup