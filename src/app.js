import express from "express";
import morgan from "morgan";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import  pool  from './db.js';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_DATABASE } from "./config.js";
import exphbs from 'express-handlebars';
import path from 'path';
import flash from 'connect-flash';
import session from 'express-session';


import MySQLStoreModule from 'express-mysql-session';
const MySQLStore = MySQLStoreModule(session);

import passport from 'passport';


import indexRoutes from "./routes/index.js";

import helpers  from "./lib/handlebars.js";

import authenticationRoutes from './routes/authentication.js';
import linksRoutes from './routes/links.js';

const app = express();
import './lib/passport.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false})); //acepta desde el formulario los datos que envian los usuarios
app.use(express.json());


const sessionStore = new MySQLStore({ host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_DATABASE});//para el error de 
app.use(session({
  secret:'password',
  resave: false,
  saveUninitialized: false ,
  store: sessionStore 
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); 

//setting
app.set('views',path.join(__dirname, 'views'))// les dice donde se encuentra la carpeta views
app.engine('.hbs', exphbs.engine({
        defaultLayout: 'main',
        layoutsDir: path.join(app.get('views'),'layouts'),
        partialsDir: path.join(app.get('views'),'partials'),
        adminDir: path.join(app.get('views'),'admin'),
        extname : '.hbs',
        helpers: helpers
    }));
app.set('view engine', '.hbs');

//global Variables
app.use((req,res,next) =>{
  app.locals.success=req.flash('success');
  app.locals.message=req.flash('message');
  if (req.user) {
    app.locals.user = req.user;
    console.log("NO hay error XD");
    console.log(req.user);
  }else{

    console.log("ERROR EN APP.JS POR LOCALS USER SESSION")
  }
  next(); 
});

// Routes
app.use(authenticationRoutes);
app.use('/links', linksRoutes);
app.use('/',indexRoutes);


app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;