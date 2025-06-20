require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const { router: authRouter, authMiddleware } = require("./auth");
const { addMessage, getMessages } = require("./storage");
const nodemailer = require("nodemailer");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use(express.static(path.join(__dirname, "../public")));

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const GMAIL_TO   = process.env.GMAIL_TO;

// cấu hình email
const emailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS
  }
});

// gửi email cảnh báo
function notifyEmail(phoneText) {
  emailer.sendMail({
    from: `"Chat Widget" <${GMAIL_USER}>`,
    to: GMAIL_TO,
    subject: "📞 SĐT mới từ khách hàng",
    text: `Khách hàng vừa để lại số điện thoại: ${phoneText}`
  }).then(() => {
    console.log("✅ Đã gửi email cảnh báo.");
  }).catch((err) => {
    console.error("❌ Gửi email lỗi:", err.message);
  });
}

app.get("/api/messages", authMiddleware, (req, res) => {
  res.json(getMessages());
});

io.on("connection", sock => {
  sock.on("send-message", data => {
    const msg = {
      ...data,
      id: Date.now(),
      from: data.from || "user"
    };
    addMessage(msg);
    io.emit("receive-message", msg);

    // nếu là số điện thoại, gửi email
    const phoneRegex = /^(0|\+84)[1-9][0-9]{8}$/;
    if (phoneRegex.test(data.text)) {
      notifyEmail(data.text);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
