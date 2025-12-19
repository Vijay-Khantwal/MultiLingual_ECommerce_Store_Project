import { registerUser } from "../../api/auth_api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import NavBar from "../../components/NavBar";
import { useTranslation } from "react-i18next";

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const submit = async (e) => {
    e.preventDefault();
    const f = e.target;

    try {
      await registerUser({
        name: f.name.value,
        email: f.email.value,
        password: f.password.value,
        role: f.role.value,
      });

      toast.success(t("auth.signupSuccess"));
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || t("auth.signupFailed")
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f1ed] overflow-hidden">
      <NavBar />

      {/* CENTER AREA */}
      <div className="flex flex-1 items-center justify-center px-4">
        <form
          onSubmit={submit}
          className="w-full max-w-md bg-white border border-[#c9b5a0] rounded-2xl p-8 shadow-sm"
        >
          <h1 className="text-2xl font-bold text-[#2d2d2d] mb-2">
            {t("auth.createAccount")}
          </h1>

          <p className="text-sm text-[#6b6b6b] mb-6">
            {t("auth.signupSubtitle")}
          </p>

          {/* NAME */}
          <div className="mb-4">
            <label className="text-sm text-[#3d3d3d]">
              {t("auth.name")}
            </label>
            <input
              name="name"
              required
              className="w-full mt-1 px-4 py-2 border border-[#c9b5a0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9945c]"
            />
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-sm text-[#3d3d3d]">
              {t("auth.email")}
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full mt-1 px-4 py-2 border border-[#c9b5a0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9945c]"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="text-sm text-[#3d3d3d]">
              {t("auth.password")}
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full mt-1 px-4 py-2 border border-[#c9b5a0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9945c]"
            />
          </div>

          {/* ROLE */}
          <div className="mb-6">
            <label className="text-sm text-[#3d3d3d]">
              {t("auth.accountType")}
            </label>
            <select
              name="role"
              className="w-full mt-1 px-4 py-2 border border-[#c9b5a0] rounded-lg bg-white"
            >
              <option value="CONSUMER">
                {t("auth.consumer")}
              </option>
              <option value="SELLER">
                {t("auth.seller")}
              </option>
            </select>
          </div>

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
