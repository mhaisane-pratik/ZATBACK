import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();
const userController = new UserController();

router.get('/me', (req, res, next) => userController.getProfile(req, res, next));
router.put('/me', (req, res, next) => userController.updateProfile(req, res, next));

export const UserModule = router;
