import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async (firstName, lastName, email, password) => {
    if (!firstName || !lastName || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "/auth/signup",
        { firstName, lastName, email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // ✅ store cookie if backend sets one
        }
      );

      console.log("Signup response:", res.data);

      const user = res.data.user;

      if (!res.data.success) {
        throw new Error(res.data.message || "Signup failed");
      }

      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Successfully signed up!");
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
};

export default useSignup;
