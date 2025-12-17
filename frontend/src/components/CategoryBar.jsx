import { useEffect, useState } from "react";
import api from "../api/axios";

export default function CategoryBar({ onSelect }) {
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data));
  }, []);

  const select = id => {
    setActive(id);
    onSelect(id);
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
          All
        </button>

        {categories.map(c => (
          <button
            key={c._id}
            onClick={() => select(c._id)}
            className={`px-5 py-2 rounded-full border transition whitespace-nowrap ${
              active === c._id
                ? "bg-[#c9945c] text-white border-[#c9945c]"
                : "bg-[#e8dfd7] text-[#3d3d3d] border-[#c9b5a0] hover:bg-[#c9945c] hover:text-white"
            }`}
          >
            {c.translations[0]?.name}
          </button>
        ))}
      </div>
    </div>
  );
}
