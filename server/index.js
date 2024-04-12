const express = require("express");
const app = express();
const port = 8000;
const bodyParser = require("body-parser");
// Parse incoming JSON data
app.use(bodyParser.json());

// เราสร้างตัวแปร users ขึ้นมาเป็น Array จำลองการเก็บข้อมูลใน Server (ซึ่งของจริงจะเป็น database)
let users = [];
let counter = 1;

app.get("/user", (req, res) => {
  res.json(users);
});

// Route handler for creating a new user
app.post("/user", (req, res) => {
  const data = req.body;

  const newUser = {
    id: counter,
    firstname: data.firstname,
    lastname: data.lastname,
    age: data.age,
  };
  
  counter += 1;

  users.push(newUser);

  // Server ตอบกลับมาว่าเพิ่มแล้วเรียบร้อย
  res.status(201).json({ message: "User created successfully", user: newUser });
});

// Route handler for getting a user by their ID
app.get("/user/:id", (req, res) => {
  const id = req.params.id;

  // Find the user with the given ID
  const user = users.find((user) => user.id === parseInt(id));

  // Check if the user with the specified ID exists
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.put("/user/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;

  // Find the user with the given ID
  const user = users.find((user) => user.id === parseInt(id));

  // Check if the user with the specified ID exists
  if (user) {
    // Update the user properties with the new data
    user.firstname = data.firstname || user.firstname;
    user.lastname = data.lastname || user.lastname;
    user.age = data.age || user.age;

    res.json({ message: "User updated successfully", user: user });
  } else {
    res.status(404).json({ error: "User not found" });
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

app.delete("/user/:id", (req, res) => {
  const id = req.params.id;
  const selectedIndex = users.findIndex((user) => (user.id === parseInt(id)));

  // Check if the index is valid
  if (selectedIndex >= 0) {
    // Remove the user at the specified index
    const deletedUser = users.splice(selectedIndex, 1);
    res.json({ message: "User deleted successfully", user: deletedUser });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});
// ประกาศ​gxbf http server ที่ port 8000 (ตามตัวแปร port)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
