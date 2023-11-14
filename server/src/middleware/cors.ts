import * as KoaCors from 'koa2-cors';
const cors = KoaCors({
  origin: '*',
  maxAge: 5 * 24 * 60 * 60,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposeHeaders: ['www-authenticate', 'server-authorization'],
});
export default cors;
