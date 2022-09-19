const express = require("express");
const router = express.Router();
const { urlencoded } = require("body-parser");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const db = require("../db-config/db-config");
const e = require("express");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post(
  "/signup",
  urlencodedParser,
  [
    check("email", "Please enter a valid email format")
      .isEmail()
      .normalizeEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send({ errors: errors.array() });
    } else {
      const { email, password } = req.body;
      let sqlCredCheck = `SELECT * FROM entertainment_web.users WHERE email='${email}'`;
      db.db.query(sqlCredCheck, (err, result) => {
        if (result.length === 1) {
          return res.status(200).json({ errors: "Account already exists" });
        } else {
          let sql = `INSERT INTO entertainment_web.users (email, password)
          VALUES ('${email}','${password}');`;
          db.db.query(sql, (err, result) => {
            if (err) throw err;
            res.send(result);
          });
        }
      });
    }
  }
);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Login requires email and password fields" });
  }

  let sql = `SELECT * FROM entertainment_web.users WHERE email='${email}' AND password='${password}'`;
  db.db.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length !== 1) {
      return res.status(401).json({ error: "Invalid login credentials" });
    } else {
      const token = jwt.sign(
        { user_id: result[0].email },
        process.env.JWT_SECRET_KEY
      );
      res.json({
        message: "Successfully logged in",
        token,
      });
    }
  });
});

module.exports = router;
