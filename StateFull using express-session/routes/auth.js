import express from 'express'
import { handleLogin, handleLogout, handleSignup } from '../controllers/auth.js';
const router = express.Router();

router.post('/login',handleLogin);
router.post('/signup',handleSignup);
router.get('/logout',handleLogout)
export default router;