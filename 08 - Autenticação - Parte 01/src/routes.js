import { Router } from 'express';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.get('/test', (req, res) => res.json({ message: 'Its OK!' }));

routes.post('/session', SessionController.session);

export default routes;
