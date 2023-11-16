import * as Koa from 'koa';
import response from './response';
import HttpErrorMiddleware from './httpError';
const Middleware = (App: Koa) => {
  App.use(response);
  App.use(HttpErrorMiddleware);
};

export default Middleware;
