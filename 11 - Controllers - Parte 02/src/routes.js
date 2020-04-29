import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import DriverController from './app/controllers/DriverController';
import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';

const routes = new Router();

routes.post('/users', UserController.store);

routes.post('/session', SessionController.session);

routes.use(authMiddleware);

routes.get('/users', adminMiddleware, UserController.index);
routes.get('/users/:id_user', adminMiddleware, UserController.details);

routes.post('/drivers', DriverController.store);
routes.get('/drivers', adminMiddleware, DriverController.index);
routes.get('/drivers/:id_driver', adminMiddleware, DriverController.details);

routes.get('/test', (req, res) => res.json({ message: 'Its OK!' }));

export default routes;
