const express = require("express");
const dotenv = require("dotenv");
const app = express();
const mysql = require("mysql2");

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.static(__dirname + "/assets/thumbnails/"));

dotenv.config();
const PORT = process.env.PORT ?? 8080;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((error) => {
  if (error) {
    throw error;
  }
});

app.get("/", function (req, res) {
  res.send("Welcome to my entertainment web app API!");
});

app.get("/bookmarked", (req, res) => {
  let sql = "SELECT * FROM entertainment_web.data where isBookmarked='true';";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/trending", (req, res) => {
  let sql = "SELECT * FROM entertainment_web.data where isTrending='true';";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/recommended", (req, res) => {
  let sql = "SELECT * FROM entertainment_web.data where isTrending='false';";
  db.query(sql, (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.get("/series", (req, res) => {
  let sql = "SELECT * FROM entertainment_web.data where category='TV Series';";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/movie", (req, res) => {
  let sql = "SELECT * FROM entertainment_web.data where category='Movie';";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.patch("/bookmark/:id/:isBookmarked", (req, res) => {
  if (req.params.isBookmarked === "False") {
    let sql = `UPDATE entertainment_web.data
        SET isBookmarked = 'True' WHERE id=${req.params.id}`;
    db.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } else {
    let sql = `UPDATE entertainment_web.data
        SET isBookmarked = 'False' WHERE id=${req.params.id}`;
    db.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  }
});

app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});
