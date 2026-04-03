const express = require("express");
const session = require("express-session")
const passport = require("passport")
const { Strategy } = require("passport-google-oauth20")
const mongodb = require("./database/mongodb");
const app = express();
require("dotenv").config()

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Z-key"
  )
  res.setHeader("Access-Controll-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  next()
})

// Express session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

passport.use(new Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
(accessToken, refreshToken, profile, done) => {
  return done(null, profile)
}
))

// Initialize passport
app.use(passport.initialize());
app.use(passport.session())

app.use("/auth", require("./routes/authRoutes"))

app.use("/", require("./routes/index"));

app.get("/", (req, res) => {
  if (req.user) {
    res.send(`Hello ${req.user.displayName} <a href="/logout">Logout</a>`)
  } else {
    res.send('<a href="/auth/google">Login with Google</a>')
  }
})

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/")
  })
})

const port = 3000;

startServer(port);

async function startServer(port) {
  await mongodb.initdb();

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}