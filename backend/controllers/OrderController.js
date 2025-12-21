import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export const getUserOrders = async (req, res) => {
  const { lang = "english" } = req.query;

  const orders = await Order.find({
    userId: req.user.userId,
  })
    .populate("items.productId")
    .sort({ createdAt: -1 });

  const response = orders.map((order) => ({
    _id: order._id,
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt,

    address: order.address,

    items: order.items
      .map((item) => {
        const product = item.productId;
        if (!product) return null;

        const t =
          product.translations?.find((tr) => tr.lang === lang) || {};

        return {
          _id: item._id,
          quantity: item.quantity,
          price: item.price,
          product: {
            _id: product._id,
            images: product.images,
            name: t.name || product.defaultName,
            description: t.description || product.defaultDes,
          },
        };
      })
      .filter(Boolean),
  }));

  res.json(response);
};


export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const ownsItem = order.items.some(
    (i) => i.sellerId && i.sellerId.toString() === req.user.userId
  );

  if (!ownsItem) return res.status(403).json({ message: "Not your order" });

  order.status = status;
  await order.save();

  res.json(order);
};
