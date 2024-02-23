const express = require("express");
const session = require("express-session");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session storage for user data from login
app.use(
  session({
    secret: "key123",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: "auto" },
  })
);

// Serve index.html at the root route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Handle GET request for the "/callback" route
app.get("/callback", (req, res) => {
  const data = req.query.data;

  if (data) {
    const userInfo = JSON.parse(data);

    req.session.data = userInfo;

    res.redirect("/user?new=true");
  } else {
    res.send("Error logging in.");
  }
});

// Display user information
app.get("/user", (req, res) => {
  if (req.query.new === "true") {

    if (!req.session.data) {
      return res.status(404).send("No new user logged in");
    }

    const filePath = __dirname + "/usernew.html";
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Error loading the page");
      }

      const pageWithData = data.replace(
        "%%DATA_PLACEHOLDER%%",
        JSON.stringify(req.session.data)
      );
      res.send(pageWithData);

      delete req.session.data;

    });

  } else {
    res.sendFile(__dirname + "/user.html");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});