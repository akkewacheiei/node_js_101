const express = require("express");
const app = express();
const port = 8000;
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");

// Parse incoming JSON data
app.use(bodyParser.json());

// เราสร้างตัวแปร users ขึ้นมาเป็น Array จำลองการเก็บข้อมูลใน Server (ซึ่งของจริงจะเป็น database)
let users = [];
let counter = 1;

let conn = null;
// function connectMySQL
const connectMySQL = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "tutorials",
    port: 8889,
  });
};

// Route handler for getting all users
app.get("/users", async (req, res) => {
  try {
    let results = await conn.query("SELECT * FROM users");
    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Route handler for creating a new user
app.post("/user", async (req, res) => {
  const data = req.body;

  try {
    const result = await conn.query("INSERT INTO users SET ?", data);
    console.log("result :", result);
    const userId = result[0].insertId;
    res.status(201).json({ message: "User created successfully", userId });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Error creating user" });
  }
});

// Route handler for getting a user by their ID
app.get("/user/:id", async (req, res) => {
  const id = req.params.id;

  try {
    let [results] = await conn.query("SELECT * FROM users WHERE id = ?", id);
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Error fetching user" });
  }
});

app.put("/user/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const result = await conn.query("UPDATE users SET ? WHERE id = ?", [
      data,
      id,
    ]);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated successfully", userId: id });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Error updating user" });
  }
});

app.patch("/user/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;

  let userToUpdate = users.find((user) => user.id === parseInt(id));

  if (!userToUpdate) {
    return res.status(404).json({ message: "User not found" });
  }

  if (data.firstname) {
    userToUpdate.firstname = data.firstname;
  }

  if (data.lastname) {
    userToUpdate.lastname = data.lastname;
  }

  if (data.age) {
    userToUpdate.age = data.age;
  }

  res.json({ message: "User updated successfully", user: userToUpdate });
});

app.delete("/user/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await conn.query("DELETE FROM users WHERE id = ?", [id]);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully", userId: id });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Error deleting user" });
  }
});

// ประกาศ​gxbf http server ที่ port 8000 (ตามตัวแปร port)
app.listen(port, async () => {
  // เรียกใช้ connectMySQL ตอน start server
  await connectMySQL();
  console.log(`Example app listening on port ${port}`);
});
