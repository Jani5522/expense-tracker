const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const passport = require("passport");
const { checkAuthenticated } = require("../authentication/route-protection");
const bcrypt = require('bcryptjs');
require('dotenv').config();

router.post(
  "/login",
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info.message });

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.status(200).json({ message: 'Login successful', user });
      });
    })(req, res, next);
  }
);

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const { password: _, ...newUser } = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
      },
    });
    res.status(201).json(newUser);
  } catch (e) {
    // Check if the error is due to a unique constraint violation
    if (e.code === 'P2002' && e.meta && e.meta.target.includes('email')) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      console.error(e);
      res.status(500).json({ message: "Signup failed", error: e.message });
    }
  }
});

router.post("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err.message });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});

router.get("/", checkAuthenticated, (req, res) => {
  res.status(200).json(req.user);
});


module.exports = router;
