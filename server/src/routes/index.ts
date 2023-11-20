import * as Router from 'koa-router';
import { DefaultState } from 'koa';
import { Context } from '@/core/koa';
import jwtMiddleware from '../middleware/jwt';
const router = new Router<DefaultState, Context>();

import TestController from '../controller/test';
import AuthController from '../controller/auth';
import TeamController from '../controller/team';
import UserController from '../controller/user';

router.prefix('/api');

// 注册地址 ---- start

// 不需要 token
router.get('/test', TestController.testGet);
// auth
router.post('/login', AuthController.login); // 登录
router.post('/register', AuthController.register); // 注册

// 需要 token
router.use(jwtMiddleware);
router.post('/test', TestController.testPost);

// team
router.post('/team', TeamController.createTeam); // 创建团队
router.put('/team/name', TeamController.updateTeamName); // 修改团队名称
router.get('/team/:teamId', TeamController.getTeamById); // 获取团队详情
router.delete('/team/:teamId', TeamController.dissolveTeam); // 解散团队
// user
router.get('/user', UserController.getUserByUserId); // 获取用户个人信息
router.put('/user/password', UserController.changePassword); // 修改密码
router.put('/user/username', UserController.updateUsername); // 修改用户名称

// 注册地址 ---- end

export default router;
