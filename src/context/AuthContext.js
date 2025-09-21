// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user/token from cookies on page refresh
  useEffect(() => {
    const savedUser = Cookies.get("user");
    const savedToken = Cookies.get("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    Cookies.set("user", JSON.stringify(userData), { expires: 1 }); // 1 day
    Cookies.set("token", authToken, { expires: 1 });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("user");
    Cookies.remove("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
