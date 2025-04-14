import React, { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  let storedUser = localStorage.getItem("stoxieUser");

  try {
    storedUser = storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    storedUser = null;
  }

  // 💰 Add default balance if not present
  const initialUser = storedUser
    ? { ...storedUser, balance: storedUser.balance ?? 5000.00 }
    : null;

  const [user, setUser] = useState(initialUser);

  const login = (userData) => {
    // fallback balance if not present
    const updatedUser = {
      ...userData,
      balance: userData.balance ?? 5000.00,
    };

    localStorage.setItem("stoxieUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem("stoxieUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
