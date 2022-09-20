const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
dotenv.config();
const db = require("./db-config/db-config");
const PORT = process.env.PORT || 8080;

app.use(cors());

app.use(express.json());
app.use(express.static(__dirname + "/assets/thumbnails/"));
app.use("/users", userRoutes);
app.set("view enginer", "ejs");

db.db.connect((error) => {
  if (error) {
    throw error;
  }
});

app.get("/", function (req, res) {
  res.send("Welcome to my entertainment web app API!");
});

app.get("/bookmarked", (req, res) => {
  let sql = "SELECT * FROM entertainment_web.data where isBookmarked='true';";
  db.db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/trending", (req, res) => {
  let sql = "SELECT * FROM entertainment_web.data where isTrending='true';";
  db.db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/recommended", (req, res) => {
  let sql = "SELECT * FROM entertainment_web.data where isTrending='false';";
  db.db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/series", (req, res) => {
  let sql = "SELECT * FROM entertainment_web.data where category='TV Series';";
  db.db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/movie", (req, res) => {
  let sql = "SELECT * FROM entertainment_web.data where category='Movie';";
  db.db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.patch("/bookmark/:id/:isBookmarked", (req, res) => {
  if (req.params.isBookmarked === "False") {
    let sql = `UPDATE entertainment_web.data
        SET isBookmarked = 'True' WHERE id=${req.params.id}`;
    db.db.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } else {
    let sql = `UPDATE entertainment_web.data
        SET isBookmarked = 'False' WHERE id=${req.params.id}`;
    db.db.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  }
});

app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});
