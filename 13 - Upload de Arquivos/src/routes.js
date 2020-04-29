import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import DriverController from './app/controllers/DriverController';
import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';
import AvatarImageController from './app/controllers/AvatarImageController';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);

routes.post('/session', SessionController.session);

routes.use(authMiddleware);

routes.get('/users', adminMiddleware, UserController.index);
routes.get('/users/:id_user', adminMiddleware, UserController.details);
routes.put('/users', UserController.update);
routes.delete('/users/:id_user', adminMiddleware, UserController.delete);

routes.post('/drivers', DriverController.store);
routes.get('/drivers', adminMiddleware, DriverController.index);
routes.get('/drivers/:id_driver', adminMiddleware, DriverController.details);
routes.delete('/drivers/:id_driver', adminMiddleware, DriverController.delete);

routes.get('/test', (req, res) => res.json({ message: 'Its OK!' }));

routes.put(
  '/avatar',
  upload.single('file'),
  AvatarImageController.update_avatar_image
);

export default routes;
