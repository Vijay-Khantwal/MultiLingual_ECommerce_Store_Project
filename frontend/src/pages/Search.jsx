import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { addToCart } from "../api/cart_api";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { searchProducts } from "../api/product_api";
import { useAuth } from "../auth/AuthContext";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "react-i18next";

export default function Search() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useAuth();

  const [query, setQuery] = useState(params.get("q") || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inStock, setInStock] = useState(false);

  const [sort, setSort] = useState("relevance");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const [page, setPage] = useState(1);
  const limit = 9;
  const [hasMore, setHasMore] = useState(true);

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    api.get("/categories", { params: { lang } }).then((res) => setCategories(res.data));
  }, []);

  /* ---------------- FETCH PRODUCTS ---------------- */
  const fetchProducts = async (reset = false) => {
    if (!lang) return;

    setLoading(true);
    try {
      const { data } = await searchProducts({
        q: query,
        minPrice,
        maxPrice,
        page,
        limit,
        lang,
        category,
        sort,
        inStock,
      });

      const items = Array.isArray(data) ? data : [];
      setProducts((prev) => (reset ? items : [...prev, ...items]));
      setHasMore(items.length === limit);
    } catch (e) {
      console.error(e);
      toast.error(t("errors.fetchProducts"));
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProducts(true);
      setParams(query ? { q: query } : {});
    }, 600);

    return () => clearTimeout(timer);
  }, [query, sort, minPrice, maxPrice, category, lang, inStock]);

  useEffect(() => {
    if (page > 1) fetchProducts();
  }, [page]);

  /* ---------------- UI ---------------- */

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2d2d2d]">
            {t("search.title")}
          </h1>
          <p className="text-sm text-[#6b6b6b] mt-1">{t("search.subtitle")}</p>
        </div>

        {/* SEARCH BAR */}
        <div className="flex gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            className="flex-1 border rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#c9945c]"
          />
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-xl px-3 py-2"
          >
            <option value="">{t("search.allCategories")}</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-xl px-3 py-2"
          >
            <option value="relevance">{t("search.relevance")}</option>
            <option value="price_asc">{t("sort.lowHigh")}</option>
            <option value="price_desc">{t("sort.highLow")}</option>
            <option value="newest">{t("sort.newest")}</option>
          </select>

          <input
            type="number"
            placeholder={t("search.minPrice")}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border rounded-xl px-3 py-2"
          />

          <input
            type="number"
            placeholder={t("search.maxPrice")}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border rounded-xl px-3 py-2"
          />
          <label className="flex items-center gap-2 border rounded-xl px-3 py-2 cursor-pointer">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
            />
            <span>{t("search.inStock")}</span>
          </label>

          <button
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
              setSort("relevance");
              setCategory("");
              setInStock(false);
            }}
            className="border border-[#c9b5a0] bg-[#e8dfd7] text-[#3d3d3d]  px-4 py-2  rounded-xl  transition  hover:bg-[#f5f1ed]  hover:text-[#2d2d2d]  active:bg-[#c9945c]  active:text-white
  "
          >
            {t("search.resetFilters")}
          </button>
        </div>

        {/* RESULTS */}
        {loading && products.length === 0 ? (
          <LoadingGrid />
        ) : products.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <button
                  disabled={loading}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-6 py-3 rounded-full bg-[#c9945c] hover:bg-[#b88650] text-white"
                >
                  {loading ? t("common.loading") : t("common.loadMore")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

/* ---------------- COMPONENTS ---------------- */

const LoadingGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
    ))}
  </div>
);

const EmptyState = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center py-20 text-gray-500">
      <p className="text-lg mb-2">{t("search.noResults")}</p>
      <p className="text-sm">{t("search.tryAgain")}</p>
    </div>
  );
};
