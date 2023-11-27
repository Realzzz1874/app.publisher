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
    _id: string
  }
  export interface InfoWithTeams extends BaseInfo {
    teams?: Array<{
      _id: string
      name: string
      role: string
    }>
  }
  export interface ChangePasswordDTO {
    oldPassword: string
    newPassword: string
  }
}

export namespace Team {
  export interface Member {
    _id: string
    username: string
    email: string
    role: string
  }
  export interface TeamDetail {
    _id: string
    name: string
    creatorId: string
    createAt: string
    members: Array<Member>
  }

  export interface UpdateTeamNameDTO {
    teamId: string
    name: string
  }
}

export namespace Message {
  export interface MessageItem {
    category: string
    content: string
    senderId: string
    receiverId: string
    sendAt: Date
    status: string
    _id: string
  }
  export interface ReadMessages {
    list: Array<MessageItem>
    total: number
  }
}
