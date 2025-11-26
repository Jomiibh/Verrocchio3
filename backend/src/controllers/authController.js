import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../config/models/User.js";

function toClientUser(doc) {
  return {
    id: doc.id,
    email: doc.email,
    username: doc.username,
    display_name: doc.display_name || "",
    avatar_url: doc.avatar_url || null,
    role: doc.role === "artist" ? 1 : 2, // align with frontend enum (Artist=1, Buyer=2)
  };
}

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function register(req, res) {
  try {
    const { email, username, password, display_name, role = "buyer", avatar_url } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: "Email, username, and password are required" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      password_hash,
      display_name: display_name || username,
      role: role === "artist" ? "artist" : "buyer",
      avatar_url: avatar_url || null,
    });

    const token = signToken(user.id);
    return res.status(201).json({ user: toClientUser(user), token });
  } catch (err) {
    console.error("Register error", err);
    return res.status(500).json({ error: "Registration failed" });
  }
}

export async function login(req, res) {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: "Email/username and password are required" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = signToken(user.id);
    return res.json({ user: toClientUser(user), token });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ error: "Login failed" });
  }
}

export async function me(req, res) {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ user: toClientUser(user) });
  } catch (err) {
    console.error("Me error", err);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
}
