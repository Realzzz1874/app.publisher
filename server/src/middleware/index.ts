import * as Koa from 'koa';
import response from './response';
import cors from './cors';
const Middleware = (App: Koa) => {
  App.use(cors);
  App.use(response);
};

export default Middleware;
