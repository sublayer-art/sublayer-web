// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AxiosRequestConfig } from "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    // 用于处理特殊格式的响应体
    customResponse?: boolean; // 添加自定义字段
  }
}
