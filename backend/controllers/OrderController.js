import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export const placeOrder = async (req, res) => {
  const userId = req.user.userId;

  const cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const items = cart.items.map((item) => ({
    productId: item.productId._id,
    sellerId: item.productId.sellerId,
    quantity: item.quantity,
    price: item.productId.price,
  }));

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = await Order.create({
    userId,
    items,
    totalAmount,
    status: "PLACED",
  });

  cart.items = [];
  await cart.save();

  res.json(order);
};
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
    items: order.items.map((item) => {
      const product = item.productId;

      if (!product) return null;

      const t =
        product.translations?.find((tr) => tr.lang === lang) || {};

      return {
        _id: item._id,
        quantity: item.quantity,
        product: {
          _id: product._id,
          price: product.price,
          images: product.images,
          name: t.name || product.defaultName,
          description: t.description || product.defaultDes,
        },
      };
    }).filter(Boolean),
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
