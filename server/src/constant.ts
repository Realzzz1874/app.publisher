export const JWT_SECRET = 'app.publisher';
// JWT EXP_TIME
export const JWT_EXP_TIME = 1000 * 60 * 60;

// don't need auth url
export const NO_AUTH_URLS = [[/\/api\/login/, /^post$/i]];
