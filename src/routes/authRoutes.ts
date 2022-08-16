import {Router} from "express";

import authController from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

// sign in and sign out
router.post('/signin', authController.signIn);
router.post('/signout', authController.signOut);

// me
router.get('/me', authMiddleware.authentication, authController.me);

export default router;
