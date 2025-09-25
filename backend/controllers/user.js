import {
  hashPassword,
  validatePassword,
  verifyPassword,
} from "../utils/password.js";
import validateEmail from "../utils/emailValidator.js";
import validateString from "../utils/stringValidator.js";
import User from "../models/user.js";
import { generateToken } from "../utils/token.js";
import { defaultCalendar } from "../utils/default.js";
import { Calendar } from "../models/calendar.js";

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (!validateString(name)) {
      return res.json({
        success: false,
        message: "Name should contain only letters",
      });
    }

    if (!validateEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already registered. Please login instead.",
      });
    }

    const passwordValidationMessage = validatePassword(password);
    if (!passwordValidationMessage.success) {
      return res.json(passwordValidationMessage);
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = await generateToken({
      id: user._id,
      email: user.email,
      name: user.name,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    defaultCalendar.owner = user._id;
    await Calendar.create(defaultCalendar);

    return res.json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.json({
      success: false,
      message: "Something went wrong during signup",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!validateEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found. Please signup first.",
      });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = await generateToken({
      id: user._id,
      email: user.email,
      name: user.name,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.json({
      success: false,
      message: "Something went wrong during login",
    });
  }
};

const logout = async (_, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.json({
      success: false,
      message: "Something went wrong during logout",
    });
  }
};

export { signup, login, logout };