import express from 'express'
import { login, loginwithgoogle, Signup } from '../controllers/auth.js';
import { booking, getSlots, } from '../controllers/slots.js';

var router=express.Router();

// Signup
router.post("/signup" ,Signup);

// login2
router.post("/login",login );

// google
router.post("/google",loginwithgoogle);

// getting slots
router.get('/slots/:id',getSlots );

// slot booking
router.post('/book-slot/:date/:time',booking );

export default router; 