// import { ParameterizedContext } from 'koa';
declare module 'koa' {
  // interface ParameterizedContext {
  //   body: any;
  // }
  interface DefaultState {}
  interface DefaultContext {
    success: TSuccess;
    error: TError;
  }
}

// http status
export enum ResponseStatus {
  SUCCESS = 200,
  SYSTEM_ERROR = 500,
  // 参数不正确
  INVALID_PARAMS = 422,
  // 未授权
  UN_AUTH = 401,
  BAD_REQUEST = 400,
}

// system error message
export enum ErrorResponseMessage {
  SYSTEM_ERROR = '系统错误',
  INVALID_PARAMS_MESSAGE = '参数不正确',
}

// ctx.success()
export type TSuccess = (data?: any, status?: ResponseStatus) => void;
// ctx.error()
export type TError = (
  message: ErrorResponseMessage | string,
  status?: ResponseStatus,
  data?: any
) => void;
