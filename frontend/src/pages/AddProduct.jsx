import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { createProduct } from "../api/product_api";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { lang } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
    language: lang,
    price: "",
    stock: "",
    categoryId: "",
    images: [""],
    isActive: true,
  });

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const update = (k, v) => setForm({ ...form, [k]: v });

  const updateImage = (i, v) => {
    const imgs = [...form.images];
    imgs[i] = v;
    setForm({ ...form, images: imgs });
  };

  const addImageField = () =>
    setForm({ ...form, images: [...form.images, ""] });

  const removeImage = (i) =>
    setForm({
      ...form,
      images: form.images.filter((_, idx) => idx !== i),
    });

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.categoryId) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Adding product...");

    try {
      await createProduct({
        name: form.name,
        description: form.description,
        lang: form.language,
        categoryId: form.categoryId,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images.filter(Boolean),
      });

      toast.success("Product added successfully", { id: toastId });
      navigate("/seller");
    } catch {
      toast.error("Failed to add product", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2d2d2d]">Add New Product</h1>
          <p className="text-[#6b6b6b] mt-1">
            List your product on the marketplace
          </p>
        </div>

        <form
          onSubmit={submit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Basic Information">
              <Input
                label="Product Name *"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />

              <Textarea
                label="Description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
              />

              <Select
                label="Original Language"
                value={form.language}
                onChange={(e) => update("language", e.target.value)}
                options={[
                  { value: "english", label: "English" },
                  { value: "hindi", label: "हिंदी (Hindi)" },
                  { value: "punjabi", label: "ਪੰਜਾਬੀ (Punjabi)" },
                  { value: "gujarati", label: "ગુજરાતી (Gujarati)" },
                  { value: "tamil", label: "தமிழ் (Tamil)" },
                  { value: "telugu", label: "తెలుగు (Telugu)" },
                  { value: "bhojpuri", label: "भोजपुरी (Bhojpuri)" },
                  { value: "malyalam", label: "മലയാളം (Malayalam)" },
                  { value: "marathi", label: "मराठी (Marathi)" },
                  { value: "urdu", label: "اردو (Urdu)" },
                  { value: "bengali", label: "বাংলা (Bengali)" },
                ]}
              />

              <Select
                label="Category *"
                value={form.categoryId}
                onChange={(e) => update("categoryId", e.target.value)}
                options={categories.map((c) => ({
                  value: c._id,
                  label: c.translations[0]?.name,
                }))}
              />
            </Card>

            <Card title="Pricing & Inventory">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (₹) *"
                  type="number"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                />
                <Input
                  label="Stock *"
                  type="number"
                  value={form.stock}
                  onChange={(e) => update("stock", e.target.value)}
                />
              </div>
            </Card>

            <Card title="Product Images">
              <div className="space-y-3">
                {form.images.map((img, i) => (
                  <div key={i} className="flex gap-3">
                    <input
                      value={img}
                      onChange={(e) => updateImage(i, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 border rounded-lg px-3 py-2"
                    />
                    {form.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="text-sm text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addImageField}
                className="mt-3 text-sm text-[#c9945c]"
              >
                + Add another image
              </button>

              <div className="grid grid-cols-3 gap-3 mt-4">
                {form.images.filter(Boolean).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="h-24 w-full object-cover rounded-xl border"
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <Card title="Visibility">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => update("isActive", e.target.checked)}
                />
                <span className="text-sm">Product is active and visible</span>
              </label>
            </Card>

            <div className="sticky top-24">
              <button
                disabled={loading}
                className="w-full bg-[#c9945c] hover:bg-[#b88650] text-white py-3 rounded-2xl font-medium"
              >
                {loading ? "Saving..." : "Add Product"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/seller")}
                className="w-full mt-3 border py-3 rounded-2xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

/* ---------- UI COMPONENTS ---------- */

const Card = ({ title, children }) => (
  <div className="bg-white border rounded-2xl p-6">
    <h3 className="font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input {...props} className="w-full border rounded-lg px-3 py-2" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea
      {...props}
      rows={4}
      className="w-full border rounded-lg px-3 py-2"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select {...props} className="w-full border rounded-lg px-3 py-2">
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);
