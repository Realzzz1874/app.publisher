import * as Koa from 'koa';
import * as Logger from 'koa-logger';
import * as bodyParser from 'koa-bodyparser';
import * as cors from 'koa2-cors';
import router from './routes';
import Middleware from './middleware';
import db from './database/mongodb';

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

    // 允许跨域
    this.app.use(cors({ credentials: true }));
    // 注册自定义中间件
    Middleware(this.app);
    // 连接 MongoDB
    db;

    // routes
    this.app.use(router.routes()).use(router.allowedMethods());
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
