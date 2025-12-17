import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedLang = localStorage.getItem("lang");
    setLang("english");

    if (storedLang) {
      setLang(storedLang);
    } else {
      setLang("english");
    }
    if (storedUser) setUser(JSON.parse(storedUser));

    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    const lang = data.user.lang || "english";
    localStorage.setItem("lang", lang);

    setUser(data.user);
    setLang(lang);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setLang("english");
  };

  // 🔥 IMPORTANT
  const changeLanguage = async (lang) => {
    setLang(lang);
    localStorage.setItem("lang", lang);

    // Sync to backend (if logged in)
    // if (user) {
    //   await api.put("/users/language", { lang: lang });
    // }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        lang,
        changeLanguage,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
