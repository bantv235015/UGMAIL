import bcrypt from "bcrypt";
import { uploadImageFromBuffer } from "../middlewares/uploadMiddleware.js";
import Session from "../models/Session.js";
import User from "../models/User.js";

const publicUserFields =
  "_id username email displayName avatarUrl bio phone showOnlineStatus notificationEnabled blockedUsers createdAt updatedAt";

export const authMe = async (req, res) => {
  try {
    return res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.error("Loi khi goi authMe", error);
    return res.status(500).json({ message: "Loi he thong" });
  }
};

export const searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "Can cung cap username trong query." });
    }

    const user = await User.findOne({ username }).select(
      "_id displayName username avatarUrl"
    );

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Loi xay ra khi searchUserByUsername", error);
    return res.status(500).json({ message: "Loi he thong" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const allowedFields = [
      "displayName",
      "username",
      "email",
      "phone",
      "bio",
      "showOnlineStatus",
      "notificationEnabled",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] =
          typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field];
      }
    });

    if (updates.displayName === "") {
      return res.status(400).json({ message: "Ten hien thi khong duoc de trong" });
    }

    if (updates.username === "") {
      return res.status(400).json({ message: "Username khong duoc de trong" });
    }

    if (updates.email === "") {
      return res.status(400).json({ message: "Email khong duoc de trong" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select(publicUserFields);

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Username hoac email da ton tai" });
    }

    console.error("Loi khi update profile", error);
    return res.status(500).json({ message: "Loi he thong" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Thieu mat khau" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mat khau moi phai co it nhat 6 ky tu" });
    }

    const user = await User.findById(req.user._id).select("hashedPassword");

    const passwordCorrect = await bcrypt.compare(currentPassword, user.hashedPassword);

    if (!passwordCorrect) {
      return res.status(401).json({ message: "Mat khau hien tai khong dung" });
    }

    user.hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.save();

    await Session.deleteMany({ userId: req.user._id });

    return res.status(200).json({ message: "Da doi mat khau" });
  } catch (error) {
    console.error("Loi khi doi mat khau", error);
    return res.status(500).json({ message: "Loi he thong" });
  }
};

export const blockAndReportUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "Can nhap username" });
    }

    const targetUser = await User.findOne({
      username: username.trim().toLowerCase(),
    }).select("_id username displayName");

    if (!targetUser) {
      return res.status(404).json({ message: "Khong tim thay nguoi dung" });
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Khong the chan chinh ban" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { blockedUsers: targetUser._id } },
      { new: true }
    ).select(publicUserFields);

    return res.status(200).json({
      message: "Da chan nguoi dung va ghi nhan bao cao",
      blockedUser: targetUser,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Loi khi chan va bao cao user", error);
    return res.status(500).json({ message: "Loi he thong" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    await Session.deleteMany({ userId: req.user._id });
    await User.findByIdAndDelete(req.user._id);

    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "Da xoa tai khoan" });
  } catch (error) {
    console.error("Loi khi xoa tai khoan", error);
    return res.status(500).json({ message: "Loi he thong" });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user._id;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadImageFromBuffer(file.buffer);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        avatarUrl: result.secure_url,
        avatarId: result.public_id,
      },
      {
        new: true,
      }
    ).select("avatarUrl");

    if (!updatedUser.avatarUrl) {
      return res.status(400).json({ message: "Avatar tra ve null" });
    }

    return res.status(200).json({ avatarUrl: updatedUser.avatarUrl });
  } catch (error) {
    console.error("Loi xay ra khi upload avatar", error);
    return res.status(500).json({ message: "Upload failed" });
  }
};
