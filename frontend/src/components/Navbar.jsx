import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { CartIcon } from "./Icons";
import LanguageSelect from "./LanguageSelector";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#f5f1ed] border-b border-[#d4cfc7]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-[#2d2d2d] font-semibold hover:opacity-80 transition"
        >
          <img
            src="/cart.png"
            alt="IndiKart Logo"
            className="h-10 w-full object-contain rounded-md"
          />
          <span className="text-3xl tracking-tight">Indi<span className="text-[#c88339]">Kart</span></span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-6 text-[#3d3d3d]">
          <LanguageSelect />
          <Link to="/marketplace" className="hover:text-[#c9945c] transition">
            {t("navbar.shop")}
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="hover:text-[#c9945c]">
                {t("navbar.login")}
              </Link>

              <Link
                to="/register"
                className="bg-[#c9945c] hover:bg-[#b88650] text-white px-4 py-2 rounded-full text-sm font-medium transition"
              >
                {t("navbar.signUp")}
              </Link>
            </>
          ) : (
            <>
              {user?.role === "SELLER" && (
                <Link to="/seller" className="hover:text-[#c9945c]">
                  {t("navbar.dashboard")}
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative hover:text-[#c9945c]">
                <CartIcon />
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="w-9 h-9 rounded-full bg-[#c9b5a0] flex items-center justify-center text-[#2d2d2d] font-semibold"
                >
                  {user.name?.[0]?.toUpperCase() || "U"}
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-48 bg-white border border-[#d4cfc7] rounded-xl shadow-lg overflow-hidden">
                    <div className="px-4 py-3 border-b text-sm text-[#4a4a4a]">
                      {user.name}
                    </div>

                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-[#e8dfd7]"
                    >
                      {t("navbar.profile")}
                    </Link>

                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm hover:bg-[#e8dfd7]"
                    >
                      {t("navbar.orders")}
                    </Link>

                    {user.role === "SELLER" && (
                      <Link
                        to="/seller"
                        className="block px-4 py-2 text-sm hover:bg-[#e8dfd7]"
                      >
                        {t("navbar.dashboard")}
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-[#8b3a3a] hover:bg-[#f0d4d4]"
                    >
                      {t("navbar.logout")}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
