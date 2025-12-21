import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { user, loading, updateUser } = useAuth();
  const { t } = useTranslation();

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      street: user.address?.street || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      country: user.address?.country || "",
      pincode: user.address?.pincode || "",

      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [user]);

  if (loading || !user || !form) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 text-[#6b6b6b]">
          {t("common.loading")}
        </div>
      </>
    );
  }

  const submit = async (e) => {
    e.preventDefault();

    const wantsPasswordChange =
      form.currentPassword || form.newPassword || form.confirmPassword;

    const wantsAddressUpdate =
      form.street || form.city || form.state || form.country || form.pincode;

    // ---------- ADDRESS VALIDATION ----------
    if (wantsAddressUpdate) {
      if (
        !form.street ||
        !form.city ||
        !form.state ||
        !form.country ||
        !form.pincode
      ) {
        return toast.error(t("profile.address"));
      }

      if (!/^\d{6}$/.test(form.pincode)) {
        return toast.error(t("profile.invalidPincode"));
      }
    }

    // ---------- PASSWORD VALIDATION ----------
    if (wantsPasswordChange) {
      if (!form.currentPassword) {
        return toast.error(t("profile.currentPassword"));
      }

      if (!form.newPassword || form.newPassword.length < 6) {
        return toast.error(t("profile.passwordTooShort"));
      }

      if (form.newPassword !== form.confirmPassword) {
        return toast.error(t("profile.passwordMismatch"));
      }
    }

    // ---------- PAYLOAD ----------
    const payload = { name: form.name.trim() };

    if (wantsAddressUpdate) {
      payload.address = {
        street: form.street.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        pincode: form.pincode.trim(),
      };
    }

    if (wantsPasswordChange) {
      payload.currentPassword = form.currentPassword;
      payload.newPassword = form.newPassword;
    }

    try {
      const res = await api.put("/users/me", payload);
      updateUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success(t("profile.updated"));

      // Clear password fields after update
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || t("profile.updateFailed"));
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">{t("profile.title")}</h1>

        <form
          onSubmit={submit}
          className="bg-white border border-[#d4cfc7] rounded-2xl p-6 space-y-6"
        >
          {/* BASIC */}
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
            placeholder={t("profile.name")}
          />

          {/* ADDRESS */}
          <div className="grid grid-cols-2 gap-3">
            <input
              className="input col-span-2"
              placeholder={t("profile.street")}
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              
            />
            <input
              className="input"
              placeholder={t("profile.city")}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              
            />
            <input
              className="input"
              placeholder={t("profile.state")}
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              
            />
            <input
              className="input"
              placeholder={t("profile.country")}
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              
            />
            <input
              className="input col-span-2"
              placeholder={t("profile.pincode")}
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              
            />
          </div>

          {/* PASSWORD CHANGE */}
          <div className="border-t pt-4 space-y-3">
            <p className="font-medium text-[#2d2d2d]">
              {t("profile.changePassword")}
            </p>

            <input
              type="password"
              className="input"
              placeholder={t("profile.currentPassword")}
              value={form.currentPassword}
              onChange={(e) =>
                setForm({ ...form, currentPassword: e.target.value })
              }
            />

            <input
              type="password"
              className="input"
              placeholder={t("profile.newPassword")}
              value={form.newPassword}
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
            />

            <input
              type="password"
              className="input"
              placeholder={t("profile.confirmPassword")}
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </div>

          <button className="bg-[#c9945c] hover:bg-[#b88650] text-white px-6 py-2 rounded-full">
            {t("profile.update")}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
