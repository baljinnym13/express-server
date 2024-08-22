const express = require("express");

const port = 8000;
const cors = require("cors");

const app = express();
const fs = require("fs");
app.use(express.json());
app.use(cors());

const data = fs.readFileSync("./users.json", { encoding: "utf8" });
const { users } = JSON.parse(data);

app.get("/users", (req, res) => {
  res.status(200).json({ users: users });
});

app.post("/users", (req, res) => {
  const newuser = {
    eid: users.length + 1,
    ...req.body,
  };
  users.push(newuser);
  fs.writeFileSync("./users.json", JSON.stringify({ users }));
  res.status(201).json({ user: newuser });
});

app.put("/users/:userId", (req, res) => {
  const findIndex = users.findIndex(
    (user) => user.id === parseInt(req.params.userId)
  );
  if (findIndex > -1) {
    users[findIndex].name = req.body.name;
    fs.writeFileSync("./users.json", JSON.stringify({ users }));

    res.status(200).json({ user: users[findIndex] });
  } else {
    res.status(400).json({ message: "not found user id" });
  }
});

app.delete("/users/:id", (req, res) => {
  const findIndex = users.findIndex(
    (user) => user.eid === parseInt(req.params.id)
  );
  if (findIndex > -1) {
    const deletedUser = users.splice(findIndex, 1);
    fs.writeFileSync("./users.json", JSON.stringify({ users }));
    res.status(200).json({ user: deletedUser[0] });
  } else {
    res.status(400).json({ message: "not found user id" });
  }
});

app.listen(port, () => {
  console.log("server is runing at localhost:8000");
});
