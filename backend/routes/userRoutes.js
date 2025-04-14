import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // make sure .js extension is correct

const router = express.Router();

// ✅ Token Middleware — defined right here itself
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ GET current user
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET Balance
router.get("/balance/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PATCH Balance (Add / Withdraw)
router.patch("/balance/:id", async (req, res) => {
  const { type, amount } = req.body;
  const amt = parseFloat(amount);

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (type === "add") {
      user.balance += amt;
    } else if (type === "withdraw") {
      if (user.balance < amt) {
        return res.status(400).json({ message: "Insufficient funds" });
      }
      user.balance -= amt;
    }

    await user.save();
    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET Watchlist
router.get("/watchlist", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ PUT Toggle Watchlist
router.put("/watchlist", authenticate, async (req, res) => {
  const { symbol } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!symbol) return res.status(400).json({ error: "Symbol is required" });

    if (user.watchlist.includes(symbol)) {
      user.watchlist = user.watchlist.filter((item) => item !== symbol);
    } else {
      user.watchlist.push(symbol);
    }

    await user.save();
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
