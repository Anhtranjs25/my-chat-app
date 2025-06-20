const fs = require("fs");
const path = require("path");
const dbFile = path.join(__dirname, "db.json");
let db = { users: [], messages: [] };

function save() {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}
if (fs.existsSync(dbFile)) {
  db = require(dbFile);
}

module.exports = {
  getUsers: () => db.users,
  addUser: u => { db.users.push(u); save(); },
  updateUser: (email, up) => {
    db.users = db.users.map(u => u.email === email ? { ...u, ...up } : u);
    save();
  },
  addMessage: m => { db.messages.push(m); save(); },
  getMessages: () => db.messages
};
