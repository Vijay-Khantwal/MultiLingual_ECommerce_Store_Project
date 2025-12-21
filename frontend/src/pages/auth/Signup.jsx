import { registerUser } from "../../api/auth_api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import NavBar from "../../components/Navbar";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [role, setRole] = useState("CONSUMER");

  const submit = async (e) => {
    e.preventDefault();
    const f = e.target;

    // ---------- BASIC VALIDATIONS ----------
    if (!f.name.value.trim()) {
      return toast.error(t("auth.nameRequired"));
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!f.email.value.trim() || !emailPattern.test(f.email.value)) {
      return toast.error(t("auth.invalidEmail"));
    }

    if (!f.password.value || f.password.value.length < 6) {
      return toast.error(t("auth.passwordTooShort"));
    }

    // ---------- ADDRESS VALIDATION FOR CONSUMER ----------
    if (role === "CONSUMER") {
      if (!f.street.value || !f.city.value || !f.state.value || !f.pincode.value) {
        return toast.error(t("auth.addressRequired"));
      }

      if (!/^\d{6}$/.test(f.pincode.value)) {
        return toast.error(t("auth.invalidPincode"));
      }
    }

    // ---------- API CALL ----------
    try {
      await registerUser({
        name: f.name.value.trim(),
        email: f.email.value.trim(),
        password: f.password.value,
        role,
        address:
          role === "CONSUMER"
            ? {
                street: f.street.value.trim(),
                city: f.city.value.trim(),
                state: f.state.value.trim(),
                pincode: f.pincode.value.trim(),
              }
            : undefined,
      });

      toast.success(t("auth.signupSuccess"));
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || t("auth.signupFailed"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f1ed]">
      <NavBar />
      <div className="flex flex-1 items-center justify-center px-4">
        <form
          onSubmit={submit}
          className="w-full max-w-md bg-white border border-[#c9b5a0] rounded-2xl p-8 shadow-sm"
        >
          <h1 className="text-2xl font-bold text-[#2d2d2d] mb-1">
            {t("auth.createAccount")}
          </h1>
          <p className="text-sm text-[#6b6b6b] mb-6">
            {t("auth.signupSubtitle")}
          </p>

          {/* BASIC INFO */}
          <Field label={t("auth.name")}>
            <input name="name" className="input" />
          </Field>

          <Field label={t("auth.email")}>
            <input name="email" type="email" className="input" />
          </Field>

          <Field label={t("auth.password")}>
            <input name="password" type="password" className="input" />
          </Field>

          {/* ROLE */}
          <Field label={t("auth.accountType")}>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input bg-white"
            >
              <option value="CONSUMER">{t("auth.consumer")}</option>
              <option value="SELLER">{t("auth.seller")}</option>
            </select>
          </Field>

          {/* ADDRESS FOR CONSUMER */}
          {role === "CONSUMER" && (
            <div className="mb-6 bg-[#faf7f4] border border-[#e0d6cb] rounded-xl p-4">
              <p className="text-sm font-medium mb-3">📍 {t("auth.address")}</p>
              <div className="grid grid-cols-2 gap-3">
                <input name="street" placeholder={t("auth.street")} className="input col-span-2" />
                <input name="city" placeholder={t("auth.city")} className="input" />
                <input name="state" placeholder={t("auth.state")} className="input" />
                <input name="pincode" placeholder={t("auth.pincode")} className="input col-span-2" />
              </div>
            </div>
          )}

          <button className="w-full bg-[#c9945c] hover:bg-[#b88650] text-white py-3 rounded-full font-medium transition">
            {t("auth.createAccount")}
          </button>

          <p className="text-center text-sm text-[#6b6b6b] mt-6">
            {t("auth.alreadyAccount")}{" "}
            <Link to="/login" className="text-[#c9945c] hover:underline">
              {t("auth.login")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className="text-sm text-[#3d3d3d]">{label}</label>
    {children}
  </div>
);
