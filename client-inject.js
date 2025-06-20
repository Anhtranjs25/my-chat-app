(() => {
    const iframe = document.createElement("iframe");
    iframe.src = "https://your-domain.com/widget.html"; // thay bằng domain thật
    iframe.style = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 320px;
      height: 400px;
      border: none;
      z-index: 99999;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(iframe);
  })();
  