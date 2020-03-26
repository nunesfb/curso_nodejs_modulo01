import { Router } from 'express';

const routes = new Router();

routes.get('/test', (req, res) => res.json({ message: 'Its OK!' }));

export default routes;
