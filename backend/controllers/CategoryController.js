import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.json(category);
};

export const getCategories = async (req, res) => {
  const {lang = "english"} = req.query;
  console.log(lang);
  const categories = await Category.find();
  const response = categories.map((c) => {
    const t = c.translations?.find(
      (tr) => tr.language == lang
    );
     return {
      _id: c._id,
      name: t?.name || c.translations?.[1]?.name || ""
    };
  });
  res.json(response);
};
