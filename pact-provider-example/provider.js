const express = require("express");
const app = express();

app.get("/user/1", (req, res) => {
    res.json({
        id: 1,
        name: "Alice",
        email: "alice@example.com"
    });
});

const server = app.listen(8081, () => {
    console.log("UserService running on port 8081");
});

module.exports = server;
