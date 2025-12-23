import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../api/product_api";
import { addToCart } from "../api/cart_api";
import { placeOrder } from "../api/order_api";
import { getReviews, addReview } from "../api/review_api";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import ReviewList from "../components/ReviewList";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [imgIndex, setImgIndex] = useState(0);
  const { lang } = useAuth();
  const { cartItems, addToCart } = useCart();
  const { t } = useTranslation();

  const isInCart = cartItems.some((item) => item.product._id === id);
  const isOutOfStock = !product || product.stock <= 0;

  const navigate = useNavigate();

  useEffect(() => {
    if (!lang) return;
    getProduct(id, { lang }).then((res) => setProduct(res.data));
    getReviews(id).then((res) => setReviews(res.data));
  }, [id, lang]);

  if (!product) return null;

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const submitReview = async () => {
    try {
      await addReview({
        productId: id,
        rating,
        comment,
      });

      const res = await getReviews(id);
      toast.success(t("reviews.submitted"));
      setReviews(res.data);

      setComment("");
      setRating(5);
    } catch (err) {
      const msg = t("reviews.submitError");
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ed] text-[#3d3d3d]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div className="space-y-4">
          <img
            src={
              product.images?.[imgIndex] ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSbA2z4dgaMbLcRflpIh8lrDaKxZAE43mFr1WH-bxDrT-T24zTi7P9LAEqiVdn34N3Tr0&usqp=CAU"
            }
            className="w-full h-105 object-contain rounded-2xl shadow-lg bg-[#e8dfd7]"
          />
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setImgIndex(i)}
                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 ${
                  i === imgIndex ? "border-[#c9b5a0]" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight text-[#2d2d2d]">
            {product.name}
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold text-[#c9945c]">
              ₹{product.price}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.stock > 0
                  ? "bg-[#d4e8d8] text-[#2d5c3f]"
                  : "bg-[#f0d4d4] text-[#8b3a3a]"
              }`}
            >
              {product.stock > 0
                ? t("product.inStock")
                : t("product.outOfStock")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.round(avgRating)
                      ? "text-[#d4a574]"
                      : "text-[#d4cfc7]"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-[#6b6b6b]">
              {avgRating} ({reviews.length} {t("reviews.reviews")})
            </span>
          </div>

          <p className="text-[#4a4a4a] leading-relaxed">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 bg-[#e8dfd7] p-4 rounded-xl">
            <div>
              <p className="text-sm text-[#6b6b6b]">{t("product.category")}</p>
              <p className="font-medium text-[#3d3d3d]">
                {product.categoryId?.name || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#6b6b6b]">{t("product.seller")}</p>
              <p className="font-medium text-[#3d3d3d]">
                {product.seller?.name || t("product.verifiedSeller")}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              disabled={isInCart || isOutOfStock}
              onClick={async () => {
                if (isOutOfStock) return;

                const success = await addToCart({
                  productId: id,
                  quantity: 1,
                  product,
                });

                if (!success) navigate("/login");
              }}
              className={`flex-1 border-2 border-[#c9b5a0] px-6 py-3 rounded-xl transition font-medium ${
                isInCart || isOutOfStock
                  ? "bg-[#c9b5c0]/20 cursor-not-allowed text-[#8a8a8a]"
                  : "hover:bg-[#e8dfd7] text-[#3d3d3d]"
              }`}
            >
              {isOutOfStock
                ? t("product.outOfStock")
                : isInCart
                ? t("cart.added")
                : t("cart.add")}
            </button>

            <button
              disabled={isOutOfStock}
              onClick={async () => {
                if (isOutOfStock) return;

                const success = await addToCart({
                  productId: id,
                  quantity: 1,
                  product,
                });

                if (!success) {
                  navigate("/login");
                  return;
                }

                navigate("/cart");
              }}
              className={`flex-1 px-6 py-3 rounded-xl transition font-medium ${
                isOutOfStock
                  ? "bg-[#c9b5c0]/30 cursor-not-allowed text-[#8a8a8a]"
                  : "bg-[#c9945c] text-white hover:bg-[#b88650]"
              }`}
            >
              {isOutOfStock ? t("product.outOfStock") : t("cart.buyNow")}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-5xl mr-auto mx-auto px-6 pb-16">
        <h2 className="text-2xl font-semibold mb-6 text-[#2d2d2d]">
          {t("reviews.title")}
        </h2>

        {/* Add Review */}
        <div className="bg-[#e8dfd7] p-6 rounded-2xl mb-8">
          <h3 className="font-medium mb-4 text-[#3d3d3d]">
            {t("reviews.write")}
          </h3>

          <div className="flex gap-2 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setRating(i + 1)}
                className={
                  i < rating
                    ? "text-[#d4a574] text-xl"
                    : "text-[#d4cfc7] text-xl"
                }
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t("reviews.placeholder")}
            className="w-full p-3 rounded-xl border border-[#d4cfc7] bg-[#f5f1ed] focus:outline-none focus:border-[#c9b5a0]"
          />

          <button
            onClick={submitReview}
            className="mt-4 bg-[#c9945c] text-white px-6 py-2 rounded-xl hover:bg-[#b88650] transition font-medium"
          >
            {t("reviews.submit")}
          </button>
        </div>

        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}
