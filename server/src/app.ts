import * as Koa from 'koa';
import * as Logger from 'koa-logger';
import * as bodyParser from 'koa-bodyparser';
import { Context } from '@/core/koa';
import Middleware from './middleware';
import * as cors from 'koa2-cors';
import router from './routes';
import connectToMongoDB from './database/mongodb';

const __DEV__ = process.env.NODE_ENV === 'dev';

class Application {
  private app: Koa;
  constructor() {
    this.app = new Koa();
    this.init();
  }

  private init() {
    if (__DEV__) {
      this.app.use(Logger());
    }

    this.app.use(bodyParser());

    // 注册中间件
    Middleware(this.app);
    // 允许跨域
    this.app.use(cors({ credentials: true }));
    // 连接 MongoDB
    connectToMongoDB();

    // routes
    this.app.use(router.routes()).use(router.allowedMethods());

    this.app.use(async (ctx: Context, next: () => Promise<any>) => {
      const path = ctx.request.path;
      console.log(`path====>: ${path}`);
      if (path === '/') {
        ctx.success('Hello World!');
      }
      await next();
    });
  }

  public start(port: number) {
    this.app.listen(port, (): void => {
      console.log(
        `====> server has started, running at: http://127.0.0.1:${port}`
      );
    });
  }
}

export default new Application();
