import express from 'express';
const router= express.Router();
import pool from '../db.js';
import passport from "passport";
import { isLoggedIn ,isNotLoggedIn } from '../lib/auth.js';


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
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/profile', isLoggedIn, (req, res) => {
  /*   console.log("profile errrror");
    console.log(req.user[0]);
    console.log("profile errrro");
 */
    res.render('profile');
  });


  router.get("/logout",isLoggedIn, (req, res, next) => {
    req.logOut(req.user, err => {
        if(err) return next(err);
        res.redirect("/signin");
        console.log("todo hido despues de cerrar sesion")  
    });
});

router.get ('/users',isLoggedIn, async (req, res)=>{
 
  const [usuarios] = await pool.query('SELECT * FROM users');
  const userIds = [usuarios].map(user => user.id); // extract the IDs from the users array
  const links = await pool.query('SELECT * FROM links WHERE user_id IN (?)', [userIds]);

  const usersWithLinks = usuarios.map(user => {
    const userLinks = links.filter(link => link.user_id === user.id);

    
    
    return { ...user, links: userLinks };
  });

  console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII")
  console.log(usersWithLinks);
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

export default router;