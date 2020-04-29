import 'dotenv/config';

import express from 'express';
import path from 'path';
import Youch from 'youch';

import 'express-async-errors';

import routes from './routes';
import './database';

class Index {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(
      '/avatar',
      express.static(path.resolve(__dirname, '..', 'uploads'))
    );
  }

  routes() {
    this.app.use(routes);
  }

  exceptionHandler() {
    this.app.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal Server Error!' });
    });
  }
}

export default new Index().app;
