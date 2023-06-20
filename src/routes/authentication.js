const express =require('express');
const router= express.Router();
const pool = require ('../database');
const passport =  require('passport');
const { isLoggedIn,isNotLoggedIn } = require('../lib/auth');

router.get ('/signup',isNotLoggedIn ,(req,res) =>{
res.render('auth/signup');
;})

router.post('/signup',isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}
));

router.get('/signin',isNotLoggedIn, (req, res) => {
  res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn,(req, res, next) => {
  /* req.check('username', 'Username is Required').notEmpty();
  req.check('password', 'Password is Required').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
  } */
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
  });


  router.get("/logout",isLoggedIn, (req, res, next) => {
    req.logOut(req.user, err => {
        if(err) return next(err);
        res.redirect("/signin");  
    });
});

router.get ('/users', async (req, res)=>{
 
  const usuarios = await pool.query('SELECT * FROM users');
  const userIds = usuarios.map(user => user.id); // extract the IDs from the users array
  const links = await pool.query('SELECT * FROM links WHERE user_id IN (?)', [userIds]);

  const usersWithLinks = usuarios.map(user => {
    const userLinks = links.filter(link => link.user_id === user.id);
    return { ...user, links: userLinks };
  });

  res.render('admin/users', { usuarios: usersWithLinks });
});

router.get ('/newadmin',isLoggedIn ,(req,res) =>{
  res.render('auth/newadmin');
  ;})

router.post('/newadmin',isLoggedIn, passport.authenticate('local.newadmin', {
    successRedirect: '/users',
    failureRedirect: '/newadmin',
    failureFlash: true
}
));

module.exports =router;