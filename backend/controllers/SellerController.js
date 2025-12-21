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
      address: order.address,
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

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, stock } = req.body;

    if (price == null || stock == null) {
      return res.status(400).json({ message: "Price and stock are required" });
    }

    if (price <= 0 || stock < 0) {
      return res
        .status(400)
        .json({ message: "Price and stock must be greater than zero" });
    }

    const product = await Product.findOne({
      _id: id,
      sellerId: req.user.userId,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.price = price;
    product.stock = stock;
    await product.save();

    res.json({
      message: "Product updated successfully",
      price: product.price,
      stock: product.stock,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
};
