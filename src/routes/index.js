import express from 'express';
const router = express.Router();
import pool from '../db.js';

router.get('/', async(req,res) => {
    res.render('index');
   

});

export default router;