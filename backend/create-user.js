const readline = require("readline");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const dbFile = path.join(__dirname, "db.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function ask(q) {
  return new Promise(res => rl.question(q, res));
}

(async () => {
  const email = await ask("Email người dùng: ");
  const password = await ask("Mật khẩu: ");
  rl.close();

  const pwHash = await bcrypt.hash(password, 10);
  const db = fs.existsSync(dbFile)
    ? JSON.parse(fs.readFileSync(dbFile))
    : { users: [], messages: [] };

  if (db.users.find(u => u.email === email)) {
    console.log("❌ Tài khoản đã tồn tại.");
    process.exit(1);
  }

  db.users.push({ email, pwHash });
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
  console.log(`✅ Đã tạo tài khoản cho ${email}`);
})();
