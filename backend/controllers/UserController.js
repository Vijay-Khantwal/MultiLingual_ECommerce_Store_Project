import User from "../models/User.js";

export const createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
};

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};
