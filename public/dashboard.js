const s = io();
let token;

btnLogin.onclick = async () => {
  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.value, password: password.value })
  });
  const data = await res.json();
  if (data.token) {
    token = data.token;
    auth.style.display = "none";
    dashboard.style.display = "block";
    loadMsgs();
  } else {
    msg.textContent = data.error;
  }
};

async function loadMsgs() {
  const res = await fetch("/api/messages", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const arr = await res.json();
  renderMsgs(arr);
}

function renderMsgs(arr) {
  msgs.innerHTML = "";
  arr.forEach(m => {
    const p = document.createElement("p");
    p.innerHTML = `<b>${m.from}:</b> ${m.text}`;
    p.onclick = () => { replyText.value = ""; replyText.focus(); };
    msgs.appendChild(p);
  });
}

s.on("receive-message", m => {
  if (dashboard.style.display === "block") {
    const p = document.createElement("p");
    p.innerHTML = `<b>${m.from}:</b> ${m.text}`;
    msgs.appendChild(p);
  }
});

btnReply.onclick = () => {
  const txt = replyText.value.trim();
  if (!txt) return;
  const msg = { from: "admin", text: txt };
  s.emit("send-message", msg);
  const p = document.createElement("p");
  p.innerHTML = `<b>Bạn:</b> ${txt}`;
  msgs.appendChild(p);
  replyText.value = "";
};
