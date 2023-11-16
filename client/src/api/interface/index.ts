export interface HttpResult {
  message: string
  t: number
}
export interface HttpResultData<T = any> extends HttpResult {
  data: T
}

export interface ErrorResponse {
  message?: string
  t: number
}

export namespace Auth {
  export interface LoginDTO {
    username: string
    password: string
  }
  export interface LoginResDTO {
    token: string
  }
  export interface RegisterDTO {
    username: string
    password: string
    email: string
  }
  export interface ResetPasswordDTO {
    oldPassword: string
    newPassword: string
  }
}

export namespace User {
  export interface BaseInfo {
    username: string
    email: string
  }
}
