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


//Permissoes para criar
verifyAuthUserorAdminCreate = (req, res, next) => {
  if (req.isAuthenticated()) {

    if (req.user.nivel >0 ) next()
    else res.render('SemPermissoes', { user: req.user })

  } else
    res.redirect("/utilizadores/menu");

}




//Permissoes para alterar
verifyAuthUserorAdminEdit = (req, res, next) => {
  if (req.isAuthenticated()) {

    if (req.user.nivel == 2 || req.user._id == req.params.username) next()
    else res.render('SemPermissoes', { user: req.user })

  } else
    res.redirect("/utilizadores/menu");

}


module.exports.verifyAuthAdmin = verifyAuthAdmin;
module.exports.verifyAuth = verifyAuth;
module.exports.verifyAuthUserorAdminEdit = verifyAuthUserorAdminEdit
module.exports.verifyAuthUserorAdminCreate = verifyAuthUserorAdminCreate