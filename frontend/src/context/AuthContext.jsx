import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const checkAuth = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/check-auth`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setAuth(true);
        setUserId(res.data.userId);
        setUserEmail(res.data.userEmail);
        setUserName(res.data.userName);
      } else setAuth(false);
    } catch (error) {
      setAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        checkAuth,
        userId,
        userEmail,
        userName
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);