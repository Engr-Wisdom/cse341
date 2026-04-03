const express = require("express");
const passport = require("passport");
const router = express.Router();

// Start Google login
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback URL after login
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful login, redirect home
    res.redirect("/");
  }
);

module.exports = router;