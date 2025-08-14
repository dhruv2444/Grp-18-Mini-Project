
import { FaBars } from "react-icons/fa6";

const Nav = () => {
  return (
    <div>

        <div className="flex justify-between py-2 items-center text-2xl border-2 border-slate-600 rounded-full px-4 ">
            <p className='font-bold '>Logo</p>
            <div className='text-black'><FaBars /></div>
        </div>
        
    </div>
  )
}

export default Nav