import React from 'react'
import { useAuthContext } from '../../Context/AuthContext'
import LogoutBtn from '../../Component/LogoutBtn'

const Home = () => {
  const{authUser,setAuthUser} = useAuthContext()
  console.log("home->",authUser)
  return (

    <div>

    <div>hello {authUser? authUser.firstName: "User"}  
      <br></br>

      <LogoutBtn/>
    </div>

    </div>
  )
}

export default Home