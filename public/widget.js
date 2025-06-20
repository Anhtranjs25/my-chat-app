const socket = io();
const box = document.getElementById("chat-box");
const input = document.getElementById("chat-input");
const send = document.getElementById("send-btn");

send.onclick = () => {
  const text = input.value.trim();
  if (!text) return;

  const msg = { text, time: Date.now() };
  socket.emit("send-message", msg);
  appendMsg("Bạn", text);
  input.value = "";

  const phoneRegex = /^(0|\+84)[1-9][0-9]{8}$/;
  if (phoneRegex.test(text)) {
    localStorage.setItem("savedPhone", text);
  }
};

socket.on("receive-message", msg => {
  if (msg.from === "admin") {
    appendMsg("Admin", msg.text);
  } else {
    if (msg.text.toLowerCase().includes("sđt") ||
        msg.text.toLowerCase().includes("số điện thoại")) {
      suggestPhoneNumber();
    } else {
      appendMsg("Admin", msg.text);
    }
  }
});

function appendMsg(sender, text) {
  const p = document.createElement("p");
  p.innerHTML = `<b>${sender}:</b> ${text}`;
  box.appendChild(p);
  box.scrollTop = box.scrollHeight;
}

function suggestPhoneNumber() {
  const saved = localStorage.getItem("savedPhone");
  if (!saved || document.getElementById("phone-suggest")) return;

  const btn = document.createElement("button");
  btn.id = "phone-suggest";
  btn.textContent = `📱 Gửi lại số: ${saved}`;
  btn.onclick = () => {
    socket.emit("send-message", { text: saved });
    appendMsg("Bạn", saved);
    btn.remove();
  };
  box.appendChild(btn);
}
