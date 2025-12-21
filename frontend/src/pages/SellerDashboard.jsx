import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import { getSellerProducts, deleteProduct } from "../api/product_api";
import { getSellerOrders, updateOrderStatus } from "../api/order_api";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import EditProductModal from "../components/EditProductModal";

const statusColors = {
  PLACED: "bg-[#e8dfd7] text-[#2d2d2d]",
  CANCELLED: "bg-[#d4e8d8] text-[#2d5c3f]",
  SHIPPED: "bg-[#c9b5a0] text-[#2d2d2d]",
  DELIVERED: "bg-[#11bf31] text-white",
  PAID: "bg-[#11bf31] text-white",
};

export default function SellerDashboard() {
  const { t } = useTranslation();
  const { user, lang } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "SELLER") {
      navigate("/");
      return;
    }
    loadData();
    // eslint-disable-next-line
  }, [lang]);

  const loadData = async () => {
    setLoading(true);
    const [p, o] = await Promise.all([
      getSellerProducts({ lang }),
      getSellerOrders({ lang }),
    ]);
    setProducts(p.data);
    setOrders(o.data);
    console.log(o.data);
    setLoading(false);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm(t("seller.confirmDelete"))) return;
    await deleteProduct(id);
    loadData();
  };

  const handleStatusChange = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
    loadData();
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center text-[#6b6b6b]">
          {t("common.loading")}
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#2d2d2d]">
              {t("seller.dashboard")}
            </h1>
            <p className="text-[#6b6b6b] mt-1">
              {t("seller.welcome", { name: user?.name })}
            </p>
          </div>

          <button
            onClick={() => navigate("/seller/add-product")}
            className="bg-[#c9945c] hover:bg-[#b88650] text-white px-5 py-2 rounded-full"
          >
            + {t("seller.addProduct")}
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Stat title={t("seller.totalProducts")} value={products.length} />
          <Stat title={t("seller.totalOrders")} value={orders.length} />
          <Stat title={t("seller.revenue")} value={`₹${totalRevenue}`} />
        </div>

        {/* MAIN GRID */}
        {editProduct && (
          <EditProductModal
            product={editProduct}
            onClose={() => setEditProduct(null)}
            onUpdated={loadData}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* PRODUCTS */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              {t("seller.yourProducts")}
            </h2>

            {products.length === 0 && (
              <EmptyState
                text={t("seller.noProducts")}
                action={() => navigate("/seller/add-product")}
                label={t("seller.addFirstProduct")}
              />
            )}

            <div className="space-y-4">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white border border-[#d4cfc7] rounded-2xl p-4 flex gap-4"
                >
                  <img
                    src={
                      p.images?.[0] ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSbA2z4dgaMbLcRflpIh8lrDaKxZAE43mFr1WH-bxDrT-T24zTi7P9LAEqiVdn34N3Tr0&usqp=CAU"
                    }
                    className="w-20 h-20 object-cover rounded-xl"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-[#2d2d2d]">{p.name}</h3>
                    <p className="text-sm text-[#6b6b6b]">
                      ₹{p.price} • {t("seller.stock")} {p.stock}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setEditProduct(p)}
                      className="border px-3 py-1 rounded-lg text-sm hover:bg-[#f5f1ed]"
                    >
                      {t("common.edit")}
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      className="border px-3 py-1 rounded-lg text-sm text-[#8b3a3a]"
                    >
                      {t("common.delete")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ORDERS */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t("seller.orders")}</h2>

            {orders.length === 0 && <EmptyState text={t("seller.noOrders")} />}

            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white border border-[#d4cfc7] rounded-2xl p-5"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold">
                      {t("order.order")} #{order._id.slice(-6)}
                    </span>

                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusColors[order.status]
                      }`}
                    >
                      <option value="PLACED">{t("order.placed")}</option>
                      <option value="PAID">{t("order.paid")}</option>
                      <option value="SHIPPED">{t("order.shipped")}</option>
                      <option value="CANCELLED">{t("order.cancelled")}</option>
                      <option value="DELIVERED">{t("order.delivered")}</option>
                    </select>
                  </div>

                  {/* ✅ DELIVERY ADDRESS */}
                  {order.address && (
                    <div className="mb-4 text-sm bg-[#f5f1ed] border border-[#e0d6cb] rounded-xl p-3">
                      <p className="font-medium text-[#2d2d2d] mb-1">
                        {t("orders.deliveryAddress")}
                      </p>
                      <p className="text-[#6b6b6b]">
                        {order.address.street}, {order.address.city},{" "}
                        {order.address.state} – {order.address.pincode}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex justify-between">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-right mt-3 font-semibold">
                    {t("order.total")}: ₹{order.totalAmount}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

/* ---------------- COMPONENTS ---------------- */

const Stat = ({ title, value }) => (
  <div className="bg-[#e8dfd7] rounded-2xl p-6">
    <p className="text-sm text-[#6b6b6b]">{title}</p>
    <p className="text-2xl font-bold text-[#2d2d2d] mt-1">{value}</p>
  </div>
);

const EmptyState = ({ text, action, label }) => (
  <div className="bg-[#f5f1ed] border border-[#d4cfc7] rounded-2xl p-8 text-center text-[#6b6b6b]">
    <p className="mb-4">{text}</p>
    {action && (
      <button
        onClick={action}
        className="bg-[#c9945c] hover:bg-[#b88650] text-white px-5 py-2 rounded-full"
      >
        {label}
      </button>
    )}
  </div>
);
