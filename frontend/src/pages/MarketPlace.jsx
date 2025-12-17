import { useEffect, useRef, useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import toast from "react-hot-toast";
import { getProducts, searchProducts } from "../api/product_api";
import ProductCard from "../components/ProductCard";
import {
  SecurePaymentIcon,
  VerifiedSellerIcon,
  FastDeliveryIcon,
  EasyReturnIcon,
} from "../components/Icons";
import { useAuth } from "../auth/AuthContext";

/* COLOR ROLES
primary-bg: #f5f1ed
secondary-bg: #e8dfd7
accent: #c9945c
accent-hover: #b88650
heading: #2d2d2d
text: #3d3d3d
secondary-text: #6b6b6b
border: #c9b5a0
rating-filled: #d4a574
*/

const FEATURES = [
  {
    title: "Secure Payments",
    icon: SecurePaymentIcon,
    desc: "100% safe and encrypted transactions",
  },
  {
    title: "Verified Sellers",
    icon: VerifiedSellerIcon,
    desc: "Only trusted and approved vendors",
  },
  {
    title: "Fast Delivery",
    icon: FastDeliveryIcon,
    desc: "Quick doorstep delivery nationwide",
  },
  {
    title: "Easy Returns",
    icon: EasyReturnIcon,
    desc: "Hassle-free returns & refunds",
  },
];
export function FeatureStrip() {
  return (
    <section
      className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto px-6 mt-12 "
      id="products-section"
    >
      {FEATURES.map(({ title, icon: Icon, desc }) => (
        <div
          key={title}
          className="bg-[#e8dfd7] p-6 rounded-2xl text-center hover:shadow-md transition"
        >
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#c9945c]/15 flex items-center justify-center">
              <Icon className="w-6 h-6 text-[#c9945c]" />
            </div>
          </div>

          <p className="font-semibold text-[#2d2d2d]">{title}</p>
          <p className="text-sm text-[#6b6b6b] mt-2">{desc}</p>
        </div>
      ))}
    </section>
  );
}

export default function MarketPlace() {
  const [categoryId, setCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const sliderRef = useRef(null);
  const [sort, setSort] = useState("");
  const {lang} = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  useEffect(() => {
    if(lang == "") return;
    console.log(lang);
    fetchProducts();
  }, [categoryId, sort,lang]);

  const fetchProducts = async (reset = false) => {
    try {
      const res = await getProducts({
        lang: lang,
        sort,
        category: categoryId || undefined, 
      });
      // const items = data?.products || [];
      setProducts(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to fetch products");
    }
  };
  const AUTO_SLIDE_INTERVAL = 4000;
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slidesCount = 7;

    const interval = setInterval(() => {
      currentIndexRef.current = (currentIndexRef.current + 1) % slidesCount;

      slider.scrollTo({
        left: slider.offsetWidth * currentIndexRef.current,
        behavior: "smooth",
      });
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const scroll = (dir) => {
    const width = sliderRef.current.offsetWidth;
    const slidesCount = 7;

    if (dir === "left") {
      currentIndexRef.current =
        (currentIndexRef.current - 1 + slidesCount) % slidesCount;
    } else {
      currentIndexRef.current = (currentIndexRef.current + 1) % slidesCount;
    }

    sliderRef.current.scrollTo({
      left: width * currentIndexRef.current,
      behavior: "smooth",
    });
  };

  // useEffect(() => {
  //   getProducts(categoryId).then((res) => setProducts(res.data));
  // }, [categoryId]);

  return (
    <div className="min-h-screen bg-[#f5f1ed] text-[#3d3d3d]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* SLIDER */}
        <div
          ref={sliderRef}
          className="flex overflow-x-hidden snap-x snap-mandatory"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="relative min-w-full snap-center">
              <img
                src={`https://static.photos/retail/1200x630?random=${i * 10}`}
                className="w-full h-105 object-cover"
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/70" />
            </div>
          ))}
        </div>

        {/* ARROWS */}
        <button
          onClick={() => scroll("left")}
          className="absolute z-10 left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center"
        >
          ‹
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-4 z-10 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
        >
          ›
        </button>

        {/* CENTER TEXT */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
      <div className="max-w-2xl text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Discover Timeless Products
        </h1>

        <p className="mb-8 text-lg md:text-xl opacity-90">
          Curated collections • Trusted sellers • Best prices
        </p>

        {/* SEARCH BAR */}
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-[#f5f1ed] rounded-full overflow-hidden shadow-lg max-w-xl mx-auto mb-6"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search local products..."
            className="
              flex-1
              px-5 py-3
              text-[#3d3d3d]
              placeholder-[#6b6b6b]
              bg-transparent
              focus:outline-none
            "
          />

          <button
            type="submit"
            className="
              bg-[#c9945c]
              hover:bg-[#b88650]
              px-6 py-3
              font-medium
              text-white
              transition
            "
          >
            Search
          </button>
        </form>

        {/* SHOP CTA */}
        <a
          href="#products-section"
          className="
            inline-block
            bg-[#c9945c]
            hover:bg-[#b88650]
            px-8 py-3
            rounded-full
            font-medium
            transition
          "
        >
          Shop Now
        </a>
      </div>
    </div>
      </section>

      <FeatureStrip />
      {/* CATEGORY + FILTER */}
      <section className="max-w-7xl mx-auto px-6 mt-10">
        <h2 className="text-2xl font-semibold text-[#2d2d2d] mb-4">
          Browse Categories
        </h2>
        <CategoryBar onSelect={setCategoryId} />
      </section>

      {/* PRODUCT GRID */}
      <section id="products" className="max-w-7xl mx-auto px-6 mt-14">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#2d2d2d]">
            Featured Products
          </h2>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-[#c9b5a0] bg-white rounded-lg px-3 py-2"
          >
            <option value="">Sort by</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-[#e8dfd7] mt-20 py-16">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h3 className="text-2xl font-semibold text-[#2d2d2d] mb-3">
            Stay Updated
          </h3>
          <p className="text-[#6b6b6b] mb-6">
            Get offers, new arrivals & deals directly in your inbox
          </p>
          <div className="flex gap-3 justify-center">
            <input
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg w-64 border border-[#c9b5a0]"
            />
            <button className="bg-[#c9945c] hover:bg-[#b88650] text-white px-6 rounded-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#2d2d2d] text-[#f5f1ed] py-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold mb-3">MyStore</h4>
            <p className="text-sm opacity-80">
              A modern multi-vendor marketplace
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>All Products</li>
              <li>Categories</li>
              <li>Deals</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Help Center</li>
              <li>Returns</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
