import { useEffect, useState } from "react";
import api from "../api/axios";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthContext";

export default function CategoryBar({ onSelect , lang}) {
  // const {lang} = useAuth();
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories", { params: { lang } });
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, [lang]);

  const select = (id) => {
    setActive(id);
    onSelect(id);
  };

  const getCategoryName = (category) => {
    // Use current language, fallback to first translation or default name
    return (
      category.name
    );
  };

  return (
    <div className="mt-6">
      <div className="flex gap-3 overflow-x-auto pb-3">
        <button
          onClick={() => select(null)}
          className={`px-5 py-2 rounded-full border transition whitespace-nowrap ${
            active === null
              ? "bg-[#c9945c] text-white border-[#c9945c]"
              : "bg-[#e8dfd7] text-[#3d3d3d] border-[#c9b5a0] hover:bg-[#c9945c] hover:text-white"
          }`}
        >
          {t("category.all")}
        </button>

        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => select(c._id)}
            className={`px-5 py-2 rounded-full border transition whitespace-nowrap ${
              active === c._id
                ? "bg-[#c9945c] text-white border-[#c9945c]"
                : "bg-[#e8dfd7] text-[#3d3d3d] border-[#c9b5a0] hover:bg-[#c9945c] hover:text-white"
            }`}
          >
            {getCategoryName(c)}
          </button>
        ))}
      </div>
    </div>
  );
}
