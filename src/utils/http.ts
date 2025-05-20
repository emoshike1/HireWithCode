import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { hideLoading, showError } from "./uiState";

// 请求配置类型扩展
interface RequestConfig extends AxiosRequestConfig {
  loading?: boolean;
  showError?: boolean;
}

// 响应数据接口
interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
}

/**
 * HTTP请求工具类
 */
class HttpRequest {
  // axios 实例
  private instance: AxiosInstance;
  // 默认配置
  private defaultConfig: RequestConfig = {
    // 从环境变量获取API基础URL
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 10000, // 请求超时时间: 10秒
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    // 是否显示加载状态
    loading: true,
    // 是否显示错误信息
    showError: true,
  };

  /**
   * 构造函数
   * @param config 自定义配置
   */
  constructor(config?: RequestConfig) {
    // 创建axios实例
    this.instance = axios.create({
      ...this.defaultConfig,
      ...config,
    });

    // 注册请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => this.requestInterceptor(config),
      (error) => this.requestErrorInterceptor(error)
    );

    // 注册响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => this.responseInterceptor(response),
      (error) => this.responseErrorInterceptor(error)
    );
  }
  /**
   * 请求拦截器
   */
  private requestInterceptor(
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    // 添加token等认证信息到请求头
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
  /**
   * 请求错误拦截器
   */
  private requestErrorInterceptor(error: any): Promise<any> {
    console.error("请求发送失败:", error);
    // 隐藏loading
    hideLoading();

    // 显示错误信息
    showError("请求发送失败，请检查网络连接");

    return Promise.reject(error);
  }
  /**
   * 响应拦截器
   */
  private responseInterceptor(response: AxiosResponse): any {
    // 从自定义配置中获取loading标志
    const config = response.config as RequestConfig;

    // 如果需要显示loading，则隐藏loading
    if (config.loading) {
      // 使用全局UI状态隐藏loading
      hideLoading();
    }

    // 处理响应数据
    const { data } = response;

    // 如果后端返回的是标准格式
    if (data && typeof data === "object" && "code" in data) {
      const responseData = data as ResponseData;

      // 根据状态码处理
      if (responseData.code === 200) {
        // 请求成功
        return responseData.data;
      } else {
        // 业务错误
        if (config.showError) {
          console.error("业务错误:", responseData.message);
          // 使用全局UI状态显示错误消息
          showError(responseData.message, "请求错误");
        }

        // 返回原始响应，让调用者处理
        return Promise.reject(responseData);
      }
    }

    // 直接返回数据
    return data;
  }
  /**
   * 响应错误拦截器
   */
  private responseErrorInterceptor(error: any): Promise<any> {
    // 隐藏loading
    hideLoading();

    if (error.config) {
      const config = error.config as RequestConfig;

      if (config.showError) {
        if (error.response) {
          // 请求已发送，但服务器响应状态码不在2xx范围内
          const { status } = error.response;
          let message = "";
          let title = "请求失败";

          switch (status) {
            case 400:
              message = "请求参数错误，请检查输入";
              break;
            case 401:
              message = "登录已过期，请重新登录";
              title = "未授权";
              // 这里可以添加重定向到登录页的代码
              break;
            case 403:
              message = "您没有权限访问该资源";
              title = "访问受限";
              break;
            case 404:
              message = "请求的资源不存在";
              title = "资源未找到";
              break;
            case 408:
              message = "服务器请求超时，请稍后重试";
              title = "请求超时";
              break;
            case 500:
              message = "服务器发生错误，请稍后重试";
              title = "服务器错误";
              break;
            case 501:
              message = "服务器不支持当前请求所需的功能";
              title = "服务未实现";
              break;
            case 502:
              message = "网关错误，请稍后重试";
              break;
            case 503:
              message = "服务暂时不可用，请稍后重试";
              title = "服务不可用";
              break;
            case 504:
              message = "网关超时，请稍后重试";
              break;
            case 505:
              message = "不支持的HTTP协议版本";
              break;
            default:
              message = `服务器返回未知错误(${status})，请联系管理员`;
          }

          console.error(`请求失败: ${message}`);
          // 使用全局UI状态显示错误消息
          showError(message, title);
        } else if (error.request) {
          // 请求已发送，但没有收到响应
          console.error("请求超时或网络错误");
          // 使用全局UI状态显示错误消息
          showError("请求超时或网络连接失败，请检查您的网络连接", "网络错误");
        } else {
          // 请求配置发生错误
          console.error("请求配置错误:", error.message);
          // 使用全局UI状态显示错误消息
          showError(error.message || "请求发送失败", "请求错误");
        }
      }
    }

    return Promise.reject(error);
  }

  /**
   * 发送GET请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 请求配置
   */
  public get<T = any>(
    url: string,
    params?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.instance.get(url, { params, ...config });
  }

  /**
   * 发送POST请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  public post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.instance.post(url, data, config);
  }

  /**
   * 发送PUT请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  public put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.instance.put(url, data, config);
  }

  /**
   * 发送DELETE请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 请求配置
   */
  public delete<T = any>(
    url: string,
    params?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.instance.delete(url, { params, ...config });
  }
}

// 创建默认实例
const http = new HttpRequest();

export default http;
export { HttpRequest, type ResponseData };
