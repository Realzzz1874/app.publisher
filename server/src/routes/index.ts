import * as Router from 'koa-router';
import { DefaultState } from 'koa';
import { Context } from '@/core/koa';
import jwtMiddleware from '../middleware/jwt';
const router = new Router<DefaultState, Context>();

import TestController from '../controller/test';
import AuthController from '../controller/auth';

router.prefix('/api');

// 注册地址 ---- start

// 不需要 token
router.get('/test', TestController.testGet);
router.post('/login', AuthController.login);

// 需要 token
// router.use(jwtMiddleware);
router.post('/test', TestController.testPost);

// 注册地址 ---- end

export default router;
