const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db-config/db-config");

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  let sql = `INSERT INTO entertainment_web.users (email, password)
  VALUES ('${email}','${password}');`;
  db.db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });

  //   users[username] = {
  //     email,
  //     password, // NOTE: Passwords should NEVER be stored in the clear like this. Use a              // library like bcrypt to Hash the password. For demo purposes only.
  //   };
  //   console.log("Users Object:", users);
  //   res.json({ success: "true" });
});

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
