import { createContext, useContext, useEffect, useState } from "react";
import i18n from "../i18n";
import { LANG_MAP } from "../i18n/langMap";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState(""); // keep as-is
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  if (!lang) return;

  const i18nLang = LANG_MAP[lang] || "en";
  i18n.changeLanguage(i18nLang);
}, [lang]);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedLang = localStorage.getItem("lang") || "english";

    if (storedUser) setUser(JSON.parse(storedUser));
    setLang(storedLang);

    setLoading(false);
  }, []);

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

  // 🔒 ONLY change i18n when USER explicitly changes language
  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);

    const i18nLang = LANG_MAP[newLang] || "en";
    i18n.changeLanguage(i18nLang);
  };

  return (
    <AuthContext.Provider
      value={{ user, lang, changeLanguage, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
