import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.userId;

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [{ productId, quantity }],
    });
    return res.json(cart);
  }

  const exists = cart.items.some(
    (item) => item.productId.toString() === productId
  );

  if (exists) {
    return res.status(400).json({
      message: "Product exists in cart",
    });
  }

  cart.items.push({ productId, quantity });
  await cart.save();

  res.json(cart);
};


export const getCart = async (req, res) => {
  const { lang = "english" } = req.query;

  const cart = await Cart.findOne({ userId: req.user.userId })
    .populate("items.productId");

  if (!cart) {
    return res.json({ items: [] });
  }

  const items = cart.items.map((item) => {
    const p = item.productId;
    if (!p) return null;

    const t =
      p.translations?.find((tr) => tr.lang === lang) || null;

    return {
      _id: item._id,
      quantity: item.quantity,

      product: {
        _id: p._id,
        price: p.price,
        stock: p.stock,
        images: p.images,
        sellerId: p.sellerId,
        categoryId: p.categoryId,

        name: t?.name || p.defaultName,
        description: t?.description || p.defaultDes,
      },
    };
  }).filter(Boolean);

  res.json({
    _id: cart._id,
    userId: cart.userId,
    items,
  });
};

export const updateCartItem = async (req, res) => {
  const { itemId, quantity } = req.body;
  const userId = req.user.userId;

  const cart = await Cart.findOne({ userId }).populate("items.productId");
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.id(itemId);
  if (!item) return res.status(404).json({ message: "Item not found" });

  const product = item.productId;
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (quantity > product.stock) {
    return res.status(400).json({
      message: `Only ${product.stock} items available in stock`,
    });
  }

  item.quantity = quantity;
  await cart.save();

  res.json(cart);
};

export const removeFromCart = async (req, res) => {
  const { itemId } = req.query;
  const userId = req.user.userId;

  const cart = await Cart.findOne({ userId });
  console.log("Removing item:", itemId,userId);

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = cart.items.filter(
    item => item._id.toString() !== itemId
  );

  await cart.save();
  res.json(cart);
};
