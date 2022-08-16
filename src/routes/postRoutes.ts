import {Router} from "express";

import postController from "../controllers/postController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

// post CRUD
router.post('/', authMiddleware.authentication, postController.createPost);
router.get('/:id', postController.readPost);
router.put('/', authMiddleware.authentication, postController.updatePost);
router.delete('/', authMiddleware.authentication, postController.deletePost);

// list posts
router.get('/list/:username', postController.postsList);

export default router;
