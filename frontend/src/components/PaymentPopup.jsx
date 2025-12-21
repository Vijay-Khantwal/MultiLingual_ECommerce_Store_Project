import axios from "axios";
import toast from "react-hot-toast";
import { RazorPayIcon } from "../components/Icons";
import { useTranslation } from "react-i18next";

export default function PaymentPopup({ total, onClose, onSuccess }) {
  const { t } = useTranslation();
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Create Razorpay order ONLY
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { orderId, amount } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        order_id: orderId,
        name: "LocalLingo",
        description: t("payment.checkout"),

        // 2️⃣ SUCCESS ONLY
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.status === 200) {
              toast.success(t("payment.success"));
              onSuccess(); // reload cart + navigate orders
              onClose();
            }
          } catch (err) {
            console.error(err);
            toast.error(t("payment.verifyFailed"));
          }
        },

        theme: {
          color: "#c9945c",
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);

        // 3️⃣ FAILED PAYMENT
        rzp.on("payment.failed", (response) => {
          console.error(response.error);
           toast.error(t("payment.failed"));
        });

        rzp.open();
      } else {
         toast.error(t("payment.sdkNotLoaded"));
      }
    } catch (err) {
      console.error(err);
       toast.error(t("payment.initFailed"));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-[90%] max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl text-gray-400"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4">{t("payment.confirm")}</h2>

        <div className="flex justify-between text-sm mb-6">
          <span>{t("payment.totalAmount")}</span>
          <span className="font-semibold">₹{total}</span>
        </div>

        <button
          onClick={handlePayment}
          className="w-full bg-[#c9945c] hover:bg-[#b88650] flex gap-1 justify-center items-center text-white py-3 rounded-xl font-medium"
        >
          {t("payment.payNow")}{" "}
          <span>
            <RazorPayIcon />
          </span>
        </button>
      </div>
    </div>
  );
}

export const verifyPayment = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    dbOrderId,
  } = req.body;

  // ✅ CANCEL / FAIL GUARD (JAVA HAS THIS)
  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ message: "Payment cancelled or failed" });
  }

  const order = await Order.findById(dbOrderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // ✅ PREVENT DOUBLE PROCESSING (JAVA: isPaymentProcessed)
  if (order.payment.status === "SUCCESS") {
    return res.status(400).json({ message: "Payment already processed" });
  }

  // ✅ SIGNATURE VERIFICATION (JAVA PORT)
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    order.payment.status = "FAILED";
    await order.save();
    return res.status(400).json({ message: "Invalid payment signature" });
  }

  // ✅ MARK SUCCESS
  order.payment.paymentId = razorpay_payment_id;
  order.payment.signature = razorpay_signature;
  order.payment.status = "SUCCESS";
  order.status = "PAID";
  await order.save();

  // ✅ CLEAR CART (ONLY AFTER SUCCESS)
  await Cart.updateOne({ userId: order.userId }, { $set: { items: [] } });

  res.json({ message: "Payment successful" });
};
