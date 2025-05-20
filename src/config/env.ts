/**
 * 环境配置
 */

// 开发环境
const devConfig = {
  apiBaseUrl: import.meta.env.VITE_APP_BASE_API || "/dev-api",
  defaultTimeout: 10000,
  mockEnabled: true,
};

// 生产环境
const prodConfig = {
  apiBaseUrl: import.meta.env.VITE_APP_BASE_API || "/prod-api",
  defaultTimeout: 15000,
  mockEnabled: false,
};

// 根据当前环境导出相应配置
export const config =
  import.meta.env.MODE === "production" ? prodConfig : devConfig;

// 判断是否为生产环境
export const isProd = import.meta.env.MODE === "production";

// 判断是否为开发环境
export const isDev = import.meta.env.MODE === "development";

// 判断是否启用Mock
export const isMockEnabled = config.mockEnabled;
