import axios, {
  type AxiosInstance,
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse
} from 'axios'

import { createDiscreteApi } from 'naive-ui'

import { useRouter } from 'vue-router'

import { UserStore } from '@/store/module/user'
import { type HttpResultData, type ErrorResponse } from '../interface'

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  loading?: boolean
  // silence 为 true 时，调用者自己处理接口的 error
  silence?: boolean
}

const config = {
  baseURL: 'http://127.0.0.1:3000/api',
  timeout: 5000,
  withCredentials: true,
  crossOriginIsolated: true
}

class Request {
  service!: AxiosInstance
  public constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config)
    // 请求拦截
    this.service.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        const userStore = UserStore()
        if (config.headers && typeof config.headers.set === 'function') {
          config.headers.set('authorization', `Auth: ${userStore.token}`)
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response
        return data
      },
      (error: AxiosError) => {
        const { response } = error
        const config = error.config as CustomAxiosRequestConfig
        if (response) {
          if (config?.silence) {
            return Promise.reject(error)
          }
          const userStore = UserStore()
          const data = response.data as ErrorResponse
          const router = useRouter()
          const { message } = createDiscreteApi(['message'])
          switch (response.status) {
            case 401:
              userStore.setToken('')
              router.push('/auth')
              break
            case 400:
              message.error(data.message || '请求失败, 请稍后重试')
              break
            default:
              message.error('请求失败, 请稍后重试')
              break
          }
        } else {
          return Promise.reject(error)
        }
      }
    )
  }

  // 请求方法封装
  get<T>(url: string, params?: object, _object = {}): Promise<HttpResultData<T>> {
    return this.service.get(url, { params, ..._object })
  }
  post<T>(url: string, params?: object | string, _object = {}): Promise<HttpResultData<T>> {
    return this.service.post(url, params, _object)
  }
  put<T>(url: string, params?: object, _object = {}): Promise<HttpResultData<T>> {
    return this.service.put(url, params, _object)
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<HttpResultData<T>> {
    return this.service.delete(url, { params, ..._object })
  }
}

export default new Request(config)
