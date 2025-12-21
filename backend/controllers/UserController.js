import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  const existing  = await User.findOne({ email: req.body.email });
  if (existing) {
    return res.status(400).json({ message: "Email already in use" });
  }
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

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      name,
      lang,
      address,
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name ?? user.name;
    user.lang = lang ?? user.lang;

    if (address) {
      const { street, city, state, country, pincode } = address;
      if (!street || !city || !state || !country || !pincode) {
        return res.status(400).json({ message: "Complete address is required" });
      }
      if (!/^\d{6}$/.test(pincode)) {
        return res.status(400).json({ message: "Invalid pincode" });
      }

      user.address = { street, city, state, country, pincode };
    }

    if (currentPassword || newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required" });
      }
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lang: user.lang,
      address: user.address,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
