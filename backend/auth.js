const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUsers } = require("./storage");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const u = getUsers().find(u => u.email === email);
  if (!u) return res.status(400).json({ error: "Email không tồn tại" });
  if (!await bcrypt.compare(password, u.pwHash))
    return res.status(400).json({ error: "Sai mật khẩu" });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token });
});

function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: "Thiếu token" });
  try {
    req.user = jwt.verify(h.split(" ")[1], JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Token không hợp lệ" });
  }
}

module.exports = { router, authMiddleware };
