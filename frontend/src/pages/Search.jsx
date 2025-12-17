import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { addToCart } from "../api/cart_api";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { searchProducts } from "../api/product_api";
import { useAuth } from "../auth/AuthContext";
import ProductCard from "../components/ProductCard";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useAuth();

  const [query, setQuery] = useState(params.get("q") || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

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
    api.get("/categories").then((res) => setCategories(res.data));
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
      });
      console.log(data);

      const items = Array.isArray(data) ? data : [];

      setProducts((prev) => (reset ? items : [...prev, ...items]));
      setHasMore(items.length === limit);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EFFECTS ---------------- */

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProducts(true);
      setParams(query ? { q: query } : {});
    }, 600);

    return () => clearTimeout(timer);
  }, [query, sort, minPrice, maxPrice, category, lang]);

  // Pagination
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
          <h1 className="text-3xl font-bold text-[#2d2d2d]">Search Products</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">
            Find products by name, price or category
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="flex gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
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
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.translations?.[0]?.name}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-xl px-3 py-2"
          >
            <option value="relevance">Relevance</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>

          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border rounded-xl px-3 py-2"
          />

          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border rounded-xl px-3 py-2"
          />

          <button
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
              setSort("relevance");
              setCategory("");
            }}
            className="border rounded-xl px-4 py-2 hover:bg-gray-50"
          >
            Reset Filters
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
                  {loading ? "Loading..." : "Load More"}
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

// const ProductCard = ({ product, navigate }) => {
//   const { _id, name, price, images } = product;
//   const image =
//     images?.[0] ||
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSbA2z4dgaMbLcRflpIh8lrDaKxZAE43mFr1WH-bxDrT-T24zTi7P9LAEqiVdn34N3Tr0&usqp=CAU";

//   return (
//     <div className="border rounded-2xl bg-white p-4 hover:shadow-md transition">
//       <div
//         onClick={() => navigate(`/product/${_id}`)}
//         className="cursor-pointer"
//       >
//         <img
//           src={image}
//           alt={name}
//           className="w-full h-48 object-cover rounded-xl"
//         />

//         <h3 className="mt-3 font-semibold text-[#2d2d2d]">{name}</h3>
//         <p className="text-sm text-[#6b6b6b] mt-1">₹{price}</p>
//       </div>

//       <button
//         onClick={() =>
//           addToCart({
//             productId: _id,
//             quantity: 1,
//             navigate,
//           })
//         }
//         className="mt-4 w-full bg-[#c9945c] hover:bg-[#b88650] text-white py-2 rounded-xl"
//       >
//         Add to Cart
//       </button>
//     </div>
//   );
// };

const LoadingGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-20 text-gray-500">
    <p className="text-lg mb-2">No products found</p>
    <p className="text-sm">Try changing keywords or filters</p>
  </div>
);
