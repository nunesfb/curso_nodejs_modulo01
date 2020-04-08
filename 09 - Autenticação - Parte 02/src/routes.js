import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/session', SessionController.session);

routes.use(authMiddleware);

routes.get('/test', (req, res) => res.json({ message: 'Its OK!' }));

export default routes;
