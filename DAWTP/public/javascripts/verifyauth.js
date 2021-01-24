verifyAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    //req.isAuthenticated() will return true if user is logged in
    next();
  } else {
    res.redirect("/utilizadores/menu");
  }
}




verifyAuthAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    //req.isAuthenticated() will return true if user is logged in

    console.log("ATAO MEN" + req.user)
    if (req.user.nivel == 2) next();
    else res.redirect("/")
    
  } else {
    res.redirect("/utilizadores/menu");
  }
}




module.exports.verifyAuthAdmin = verifyAuthAdmin;
module.exports.verifyAuth = verifyAuth;