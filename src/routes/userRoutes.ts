import {Router} from "express";

import userController from "../controllers/userController";

import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

// user CRUD
router.post('/', userController.createUser);
router.get('/:username', userController.readUser);
router.put('/', authMiddleware.authentication, userController.updateUser);
router.delete('/', authMiddleware.authentication, userController.deleteUser);

export default router;
