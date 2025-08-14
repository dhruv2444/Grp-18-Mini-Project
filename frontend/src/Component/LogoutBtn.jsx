
import { LogOut } from 'lucide-react'; 
import useLogout from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LogoutBtn = () => {
    const{loading, logout} = useLogout();

    const navigate = useNavigate()


  const handleLogout = async () => {
   
    try {
      
      await logout();
      navigate('/login')
    } catch (error) {
      toast.error('Logout failed');
    } 
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`
        inline-flex items-center justify-center gap-2 
        bg-gray-800 text-white py-2.5 px-4 rounded-lg 
        hover:bg-gray-900 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 
        disabled:opacity-50 disabled:cursor-not-allowed 
        transition-colors font-medium
       
      `}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
           Logout...
        </>
      ) : (
        <>
          <LogOut size={16} />
          Sign out
        </>
      )}
    </button>
  );
};

export default LogoutBtn;