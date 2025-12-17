import { registerUser } from "../../api/auth_api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const f = e.target;

    try {
      await registerUser({
        name: f.name.value,
        email: f.email.value,
        password: f.password.value,
        role: f.role.value, // CONSUMER | SELLER
      });

      toast.success("Account created successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f1ed] px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white border border-[#c9b5a0] rounded-2xl p-8 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-[#2d2d2d] mb-2">
          Create Account
        </h1>
        <p className="text-sm text-[#6b6b6b] mb-6">
          Join our marketplace in seconds
        </p>

        {/* NAME */}
        <div className="mb-4">
          <label className="text-sm text-[#3d3d3d]">Name</label>
          <input
            name="name"
            required
            className="w-full mt-1 px-4 py-2 border border-[#c9b5a0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9945c]"
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm text-[#3d3d3d]">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full mt-1 px-4 py-2 border border-[#c9b5a0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9945c]"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="text-sm text-[#3d3d3d]">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full mt-1 px-4 py-2 border border-[#c9b5a0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9945c]"
          />
        </div>

        {/* ROLE */}
        <div className="mb-6">
          <label className="text-sm text-[#3d3d3d]">Account Type</label>
          <select
            name="role"
            className="w-full mt-1 px-4 py-2 border border-[#c9b5a0] rounded-lg bg-white"
          >
            <option value="CONSUMER">Consumer</option>
            <option value="SELLER">Seller</option>
          </select>
        </div>

        <button className="w-full bg-[#c9945c] hover:bg-[#b88650] text-white py-3 rounded-full font-medium transition">
          Create Account
        </button>

        <p className="text-center text-sm text-[#6b6b6b] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#c9945c] hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
