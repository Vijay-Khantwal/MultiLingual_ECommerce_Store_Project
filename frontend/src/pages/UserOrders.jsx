import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getUserOrders } from "../api/order_api";
import toast from "react-hot-toast";
import { useAuth } from "../auth/AuthContext";
import { useTranslation } from "react-i18next";

export default function UserOrders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getUserOrders({ lang });
        setOrders(res.data || []);
      } catch {
        toast.error(t("errors.fetchOrders"));
      } finally {
        setLoading(false);
      }
    };

    if (lang) fetchOrders();
  }, [lang, t]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-20 text-center text-gray-500">
          {t("common.loading")}
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          {t("orders.myOrders")}
        </h1>

        {orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* ------------------ COMPONENTS ------------------ */

const OrderCard = ({ order }) => {
  const { t } = useTranslation();
  const items = order.items || [];
  const address = order.address;
  console.log(order);

  return (
    <div className="border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-gray-700">
          {t("order.order")} #{order._id?.slice(-6)}
        </span>

        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            order.status === "DELIVERED"
              ? "bg-green-100 text-green-700"
              : order.status === "PLACED"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {t(`order.${order.status.toLowerCase()}`)}
        </span>
      </div>

      {/* ✅ ADDRESS */}
      {address && (
        <div className="mb-4 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
          <p className="font-medium text-gray-700 mb-1">
            {t("orders.deliveryAddress")}
          </p>
          <p>
            {address.street}, {address.city}, {address.state} –{" "}
            {address.pincode}
          </p>
        </div>
      )}

      {/* Items */}
      <div className="divide-y divide-gray-200">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 py-2">
            {t("orders.noItems")}
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center py-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    item.product?.images?.[0] ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSbA2z4dgaMbLcRflpIh8lrDaKxZAE43mFr1WH-bxDrT-T24zTi7P9LAEqiVdn34N3Tr0&usqp=CAU"
                  }
                  alt={item.product?.name}
                  className="w-12 h-12 object-cover rounded-lg border"
                />
                <div>
                  <p className="font-medium text-gray-800">
                    {item.product?.name || t("orders.deletedProduct")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("orders.qty")}: {item.quantity}
                  </p>
                </div>
              </div>

              <span className="font-medium text-gray-700">
                ₹{(item?.price || 0) * item.quantity}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Total */}
      <div className="mt-4 flex justify-end">
        <span className="text-lg font-semibold text-gray-800">
          {t("order.total")}: ₹{order.totalAmount}
        </span>
      </div>
    </div>
  );
};


const EmptyOrders = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-16 text-center text-gray-500">
      <p className="mb-3 text-lg font-medium">
        {t("orders.emptyTitle")}
      </p>
      <p className="text-sm">
        {t("orders.emptySubtitle")}
      </p>
    </div>
  );
};
