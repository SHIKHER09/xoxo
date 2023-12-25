import express from 'express'
import { createSlots,  } from '../controllers/slots.js';
import { SignupADM, loginADM, loginwithgoogle, loginwithgoogleADM } from '../controllers/auth.js';

const router=express.Router();

// Signup
router.post("/signup" ,SignupADM);

// login2
router.post("/login",loginADM );

// google
router.post("/google",loginwithgoogleADM);

// create slot
router.post('/createSlot', createSlots);


export default router;