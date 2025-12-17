import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { updateCartItem } from "../api/cart_api";
import { placeOrder } from "../api/order_api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, removeFromCart, loadCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();
  const { lang } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      await loadCart();
      setLoading(false);
    };
    fetch();
  }, [lang]);

  const changeQty = async (productId, qty) => {
    console.log(productId);
    if (qty < 1) return;
    // console.log(cartItems);

    const item = cartItems.find(i => i._id === productId);
    // console.log(item);
    if (!item) return;

    try {
      await updateCartItem(productId, qty);
      await loadCart(); // reload to sync
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    }
  };
  

  const checkout = async () => {
    setCheckoutLoading(true);
    try {
      await placeOrder();
      toast.success("Order placed successfully");
      await loadCart();
      navigate("/orders");
    } catch {
      toast.error("Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const total = cartItems.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-20 text-center text-[#6b6b6b]">
          Loading your cart...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-[#2d2d2d] mb-8">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <EmptyCart onShop={() => navigate("/marketplace")} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-5">
              {cartItems.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  onQtyChange={changeQty}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* SUMMARY */}
            <div className="bg-[#f5f1ed] border border-[#d4cfc7] rounded-2xl p-6 h-fit sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <SummaryRow label="Subtotal" value={`₹${total}`} />
                <SummaryRow label="Shipping" value="Free" />
                <SummaryRow label="Total" value={`₹${total}`} bold />
              </div>

              <button
                disabled={checkoutLoading}
                onClick={checkout}
                className="w-full mt-6 bg-[#c9945c] hover:bg-[#b88650] text-white py-3 rounded-2xl font-medium"
              >
                {checkoutLoading ? "Placing order..." : "Checkout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ---------------- COMPONENTS ---------------- */

const CartItem = ({ item, onQtyChange, onRemove }) => {
  const { product, quantity } = item;
  if (!product) return null;
  // console.log(item._id);

  return (
    <div className="bg-white border border-[#d4cfc7] rounded-2xl p-4 flex gap-4">
      <img
        src={
          product.images?.[0] ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSbA2z4dgaMbLcRflpIh8lrDaKxZAE43mFr1WH-bxDrT-T24zTi7P9LAEqiVdn34N3Tr0&usqp=CAU"
        }
        className="w-24 h-24 object-cover rounded-xl"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-[#2d2d2d]">
          {product.name || "Deleted Product"}
        </h3>

        <p className="text-sm text-[#6b6b6b] mt-1">₹{product.price || 0}</p>

        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => onQtyChange(item._id, quantity - 1)}
            className="w-8 h-8 border rounded-full"
          >
            −
          </button>

          <span className="font-medium">{quantity}</span>

          <button
            onClick={() => onQtyChange( item._id, quantity + 1)}
            className="w-8 h-8 border rounded-full"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-between items-end">
        <span className="font-semibold">
          ₹{(product.price || 0) * quantity}
        </span>

        <button
          onClick={() => onRemove(item._id)}
          className="text-sm text-[#8b3a3a]"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value, bold }) => (
  <div
    className={`flex justify-between ${bold ? "font-semibold text-base" : ""}`}
  >
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const EmptyCart = ({ onShop }) => (
  <div className="bg-[#f5f1ed] border border-[#d4cfc7] rounded-2xl p-16 text-center text-[#6b6b6b]">
    <p className="mb-6">Your cart is empty</p>
    <button
      onClick={onShop}
      className="bg-[#c9945c] hover:bg-[#b88650] text-white px-6 py-3 rounded-full"
    >
      Continue Shopping
    </button>
  </div>
);
