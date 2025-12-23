import Product from "../models/Product.js";
import getTranslations from "../services/geminiService.js";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      lang,
      categoryId,
      price,
      stock,
      images = [],
    } = req.body;

    console.log("Generating translations for product:", name);
    const translationsRaw = await getTranslations(
      JSON.stringify({ name, des: description, lang })
    );

    const translations = JSON.parse(translationsRaw);

    console.log("Translations successfully received");

    const product = await Product.create({
      sellerId: req.user.userId,
      categoryId,
      price,
      stock,
      images,
      defaultName: name,
      defaultDes: description,
      translations,
    });

    res.status(201).json({
      message: "Product created successfully",
      productId: product._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Product creation failed" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { lang = "english", sort = "latest", category, inStock } = req.query;

    const filter = { isActive: true };

    if (category) {
      filter.categoryId = category;
    }

    if (inStock === "true") {
      filter.stock = { $gt: 0 };
    }

    let sortQuery = { createdAt: -1 };

    if (sort === "price_high") {
      sortQuery = { price: -1 };
    } else if (sort === "price_low") {
      sortQuery = { price: 1 };
    }

    const products = await Product.find(filter).sort(sortQuery).lean();

    const response = products.map((p) => {
      const t = p.translations?.find((tr) => tr.lang === lang);

      return {
        _id: p._id,
        price: p.price,
        stock: p.stock,
        images: p.images,
        category: p.category,
        name: t?.name || p.defaultName,
        description: t?.description || p.defaultDes,
      };
    });

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  const { lang = "english" } = req.query;

  const product = await Product.findById(req.params.id)
    .populate("sellerId", "name")
    .lean();

  if (!product) return res.status(404).json({ message: "Product not found" });

  const t = product.translations.find((tr) => tr.lang === lang);
  console.log("Fetched product with language:", lang);
  console.log(t);

  res.json({
    _id: product._id,
    seller: product.sellerId,
    price: product.price,
    stock: product.stock,
    images: product.images,
    name: t?.name || product.defaultName,
    description: t?.description || product.defaultDes,
    averageRating: product.averageRating,
    reviewCount: product.reviewCount,
  });
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: "Product not found" });

  if (product.sellerId.toString() !== req.user.userId)
    return res.status(403).json({ message: "Not your product" });

  product.isActive = false;
  await product.save();

  res.json({ message: "Product deleted successfully" });
};

export const searchProducts = async (req, res) => {
  try {
    const {
      q = "",
      lang = "english",
      category,
      minPrice = 0,
      maxPrice = Number.MAX_SAFE_INTEGER,
      page = 1,
      limit = 9,
      sort,
      inStock,
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const min = minPrice === "" ? 0 : Number(minPrice);
    const max = maxPrice === "" ? Number.MAX_SAFE_INTEGER : Number(maxPrice);

    const sortStage =
      sort === "price_asc"
        ? { price: 1 }
        : sort === "price_desc"
        ? { price: -1 }
        : sort === "newest"
        ? { createdAt: -1 }
        : null;

    const pipeline = [
      {
        $match: {
          isActive: true,
          price: { $gte: min, $lte: max },
          ...(category && {
            categoryId: new mongoose.Types.ObjectId(category),
          }),
          ...(inStock === "true" && {
            stock: { $gt: 0 },
          }),
        },
      },
      {
        $addFields: {
          matchedTranslation: {
            $first: {
              $filter: {
                input: "$translations",
                as: "t",
                cond: {
                  $and: [
                    { $eq: ["$$t.lang", lang] },
                    ...(q
                      ? [
                          {
                            $or: [
                              {
                                $regexMatch: {
                                  input: "$$t.name",
                                  regex: q,
                                  options: "i",
                                },
                              },
                              {
                                $regexMatch: {
                                  input: "$$t.description",
                                  regex: q,
                                  options: "i",
                                },
                              },
                            ],
                          },
                        ]
                      : []),
                  ],
                },
              },
            },
          },
        },
      },
      {
        $match: {
          matchedTranslation: { $ne: null },
        },
      },
      ...(sortStage ? [{ $sort: sortStage }] : []),
      {
        $project: {
          _id: 1,
          price: 1,
          images: 1,
          name: "$matchedTranslation.name",
          description: "$matchedTranslation.description",
          stock: 1,
          sellerId: 1,
          categoryId: 1,
        },
      },
      { $skip: (pageNum - 1) * limitNum },
      { $limit: limitNum },
    ];

    const products = await Product.aggregate(pipeline);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
};
