function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else{
    res.status(401).json({ message: 'Failed Authentication' });
  }
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.status(200).json({ message: 'authenticated' });
  }

  next();
}


module.exports = {checkAuthenticated, checkNotAuthenticated}

