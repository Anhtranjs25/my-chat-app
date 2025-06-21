(() => {
  const iframe = document.createElement("iframe");
  iframe.src = "https://my-chat-app-l6rp.onrender.com/"; // <-- nhớ có dấu /
  iframe.onload = () => {
    iframe.style.display = "block"; // 🔥 bật hiển thị khi iframe đã load
  };
  iframe.style = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 340px;
    height: 440px;
    border: none;
    z-index: 9999;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    border-radius: 8px;
    background: white;
  `;
  document.body.appendChild(iframe);
})();
  