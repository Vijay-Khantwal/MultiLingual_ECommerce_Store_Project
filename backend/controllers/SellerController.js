import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getSellerProducts = async (req, res) => {
  const { lang = "english" } = req.query;
  console.log("Fetching products with language:", lang);

  const products = await Product.find({ isActive: true, sellerId: req.user.userId }).lean();

  const response = products.map(p => {
    const t = p.translations.find(tr => tr.lang === lang);
    
    return {
      _id: p._id,
      price: p.price,
      stock: p.stock,
      images: p.images,
      name: t?.name || p.defaultName,
      description: t?.description || p.defaultDes
    };
  });

  res.json(response);
};
export const getSellerOrders = async (req, res) => {
  try {
    const { lang = "english" } = req.query;

    const orders = await Order.find({
      "items.sellerId": req.user.userId,
    })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    const response = orders.map(order => ({
      _id: order._id,
      userId: order.userId,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,

      items: order.items
        .filter(item => String(item.sellerId) === req.user.userId)
        .map(item => {
          const product = item.productId;
          const t =
            product?.translations?.find(tr => tr.lang === lang) || {};

          return {
            productId: product?._id,
            name: t.name || product.defaultName,
            description: t.description || product.defaultDes,
            price: item.price,
            quantity: item.quantity,
          };
        }),
    }));

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch seller orders" });
  }
};
