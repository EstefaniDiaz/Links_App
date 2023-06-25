import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import pool from '../db.js';
import helpers from './helpers.js';

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
 /*    console.log(user);
    console.log(user.username);
    console.log(user.password);  */
   
    if (user.password) {//del array cambio a json y obtenemos
    const validPassword = await helpers.matchPassword(password, user.password);
    /* console.log(password);
    console.log(user.username);
    console.log(user.password);
    console.log(" funciona el desencriptador"); */
    if (validPassword) {
      done(null, user, req.flash('success', 'Welcome ' + user.username));
    } else {
      done(null, false, req.flash('message', 'Incorrect Password'));
    }
  } if (user.password==null ) {
    done(null, false, req.flash('message', 'User does not have a password'));
  }
  } else {
    return done(null, false, req.flash('message', 'The Username does not exists.'));
  }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
  const {fullname}= req.body;
  const newUser ={
    username,
    password,
    fullname,
    rol:'usuario'
  };
  newUser.password = await helpers.encryptPassword(password);
  // Saving in the Database
  const [result] = await pool.query('INSERT INTO users SET ? ', [newUser]);
  newUser.id = result.insertId;
  return done(null, newUser);
}));


  passport.use('local.newadmin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    
    passReqToCallback: true
  }, async (req, username, password, done) => {
  const {fullname}= req.body;
  const newUser ={
    username,
    password,
    fullname,
    rol:'admin'
  };
newUser.password = await helpers.encryptPassword(password);
// Saving in the Database
const [result] = await pool.query('INSERT INTO users SET ? ', [newUser]);
newUser.id = result.insertId;
return done(null, newUser);
}));


  passport.serializeUser((user,done) => {
    if (user) {
      done(null, user.id); // Serializar el ID del usuario
    }else{
      console.log("Hey aqui en serialeze hay un problema");
    }
  });

  passport.deserializeUser(async (id, done) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    console.log(rows[0]);
    console.log("************************************************************************************************")
    console.log(rows);
    done(null, rows[0]);
    
  });
