import { createContext, useContext, useEffect, useState } from "react";
import i18n from "../i18n";
import { LANG_MAP } from "../i18n/langMap";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState(""); // keep as-is
  const [loading, setLoading] = useState(true);

  /* ---------- i18n sync ---------- */
  useEffect(() => {
    if (!lang) return;

    const i18nLang = LANG_MAP[lang] || "en";
    i18n.changeLanguage(i18nLang);
  }, [lang]);

  /* ---------- hydrate from localStorage ---------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedLang = localStorage.getItem("lang") || "english";

    if (storedUser) setUser(JSON.parse(storedUser));
    setLang(storedLang);

    setLoading(false);
  }, []);

  /* ---------- auth actions ---------- */
  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    const userLang = data.user.lang || "english";
    localStorage.setItem("lang", userLang);

    setUser(data.user);
    setLang(userLang);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setLang("english");
  };

  /* ---------- language ---------- */
  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);

    const i18nLang = LANG_MAP[newLang] || "en";
    i18n.changeLanguage(i18nLang);
  };

  /* ---------- ✅ NEW: safe user updater ---------- */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        lang,
        loading,
        login,
        logout,
        changeLanguage,
        updateUser, // ✅ exposed here
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
