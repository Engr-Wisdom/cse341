// middleware/authMiddleware.js

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).send(`
    <h2>Unauthorized</h2>
    <p>You need to login to access this page.</p>
    <a href="/auth/google">Login with Google</a>
    `);
}

module.exports = { ensureAuthenticated };