import * as Router from 'koa-router';
import { DefaultState } from 'koa';
import { Context } from '@/core/koa';
import jwtMiddleware from '../middleware/jwt';
const router = new Router<DefaultState, Context>();

import TestController from '../controller/test';
import AuthController from '../controller/auth';
import TeamController from '../controller/team';

router.prefix('/api');

// 注册地址 ---- start

// 不需要 token
// auth
router.get('/test', TestController.testGet);
router.post('/login', AuthController.login); // 登录
router.post('/register', AuthController.register); // 注册

// 需要 token
router.use(jwtMiddleware);
router.post('/test', TestController.testPost);

// team
router.post('/team', TeamController.createTeam); // 创建团队
router.put('/team', TeamController.updateTeamName); // 修改团队名称

// 注册地址 ---- end

export default router;
