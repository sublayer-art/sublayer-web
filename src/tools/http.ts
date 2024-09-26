import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export type PaginateData<T = unknown> = {
  records: Array<T>;
  total: number;
};

// 列表查询参数包装公共部分
export type ParamsForQueryList<P = unknown> = P & OrderParams & PaginateParams;

// 排序参数
export type OrderParams = {
  orderByColumn?: string;
  isAsc?: boolean;
};
// 分页参数
export type PaginateParams = {
  pageNum?: number;
  pageSize?: number;
};

export type ResponseData<T = unknown> = {
  code: number;
  msg?: string;
  data?: T;
};

// 创建一个Axios实例
const axiosInst = axios.create({
  baseURL: "/api", // 设置默认的请求URL
  timeout: 60000, // 请求超时时间（单位：毫秒）
});

// 请求拦截器
axiosInst.interceptors.request.use(function beforeRequest(config) {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers!["Sublayer-Nft-Token"] = token;
  }
  return config;
});

// 响应拦截器
axiosInst.interceptors.response.use(
  (response: AxiosResponse<ResponseData<any>>) => {
    // 配置里有customResponse，直接返回data给调用者自行处理
    // 用于处理特殊格式的响应体
    if (response.config.customResponse) {
      return response.data;
    }
    const { code, data, msg } = response.data;

    if (code === 200) {
      return data;
    } else {
      const errorMessage = msg || "业务异常，状态码:" + code;
      console.error(errorMessage);
      throw Error(errorMessage);
      // errorToast.toast({
      //   title: code,
      //   description: errorMessage,
      // });
    }
  },
  (error) => {
    // 处理响应错误

    console.error("http response interceptors:\n", error);
    // errorToast.toast({
    //   title: error.name,
    //   description: error.message,
    // });

    throw error;
  }
);

/**
 * 封装一层axios，以获得更好的ts类型推断
 *
 * 由于在axiosInstance中已经处理了AxiosResponse，所以这里就不需要这个类型了
 */
export default class Http {
  static request<T = any, D = any>(config: AxiosRequestConfig<D>): Promise<T> {
    return axiosInst.request(config);
  }

  static get<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<T> {
    return this.request({
      url,
      method: "GET",
      ...config,
    });
  }

  static post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T> {
    return this.request({
      url,
      method: "POST",
      data,
      ...config,
    });
  }
  static put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T> {
    return this.request({
      url,
      method: "PUT",
      data,
      ...config,
    });
  }

  static patch<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T> {
    return this.request({
      url,
      method: "PATCH",
      data,
      ...config,
    });
  }
  static delete<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T> {
    return this.request({
      url,
      method: "DELETE",
      data,
      ...config,
    });
  }
}
