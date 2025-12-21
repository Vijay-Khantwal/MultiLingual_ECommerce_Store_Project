import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";

export default function ProductCard({ product }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  const isInCart = cartItems.some((item) => item.product._id === product._id);
  const isOutOfStock = !product.stock || product.stock <= 0;

  return (
    <div className="bg-white border border-[#c9b5a0] rounded-lg overflow-hidden hover:shadow-lg transition flex flex-col">
      <Link to={`/products/${product._id}`}>
        <img
          src={
            product.images?.[0] ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSbA2z4dgaMbLcRflpIh8lrDaKxZAE43mFr1WH-bxDrT-T24zTi7P9LAEqiVdn34N3Tr0&usqp=CAU"
          }
          alt={product.name}
          className="h-48 shadow-sm w-full object-cover"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <h3 className="font-semibold text-[#2d2d2d] line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-[#6b6b6b] mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="font-semibold">₹{product.price}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              product.stock > 0
                ? "bg-[#d4e8d8] text-[#2d5c3f]"
                : "bg-[#f0d4d4] text-[#8b3a3a]"
            }`}
          >
            {product.stock > 0 ? t("product.inStock") : t("product.outOfStock")}
          </span>
        </div>

        <button
          disabled={isInCart || isOutOfStock}
          onClick={() =>
            addToCart({ productId: product._id, quantity: 1, product })
          }
          className={`mt-auto py-2 rounded-xl text-white w-full font-medium ${
            isInCart || isOutOfStock
              ? "bg-[#c9b5c0]/30 cursor-not-allowed"
              : "bg-[#c9945c] hover:bg-[#b88650]"
          }`}
        >
          {isOutOfStock
            ? t("product.outOfStock")
            : isInCart
            ? t("cart.added")
            : t("cart.add")}
        </button>
      </div>
    </div>
  );
}
