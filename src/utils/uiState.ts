/**
 * 全局UI状态管理
 */
import { reactive } from "vue";

// 全局加载状态
export const loading = reactive({
  visible: false,
  message: "加载中...",
  counter: 0, // 加载计数器，处理多个并发请求的情况
});

/**
 * 显示全局加载状态
 * @param message 加载提示信息
 */
export function showLoading(message: string = "加载中...") {
  loading.counter++;
  loading.visible = true;
  loading.message = message;
}

/**
 * 隐藏全局加载状态
 */
export function hideLoading() {
  loading.counter--;
  // 只有当计数器为0时，才真正隐藏loading
  if (loading.counter <= 0) {
    loading.counter = 0; // 确保不会变成负数
    loading.visible = false;
  }
}

// 全局错误状态
export const error = reactive({
  visible: false,
  title: "错误",
  message: "发生未知错误，请重试",
});

/**
 * 显示全局错误提示
 * @param message 错误信息
 * @param title 错误标题
 */
export function showError(message: string, title: string = "错误") {
  error.visible = true;
  error.title = title;
  error.message = message;

  // 自动关闭错误提示
  setTimeout(() => {
    hideError();
  }, 5000);
}

/**
 * 隐藏全局错误提示
 */
export function hideError() {
  error.visible = false;
}

// 全局成功状态
export const success = reactive({
  visible: false,
  title: "成功",
  message: "操作成功",
});

/**
 * 显示全局成功提示
 * @param message 成功信息
 * @param title 成功标题
 */
export function showSuccess(message: string, title: string = "成功") {
  success.visible = true;
  success.title = title;
  success.message = message;

  // 自动关闭成功提示
  setTimeout(() => {
    hideSuccess();
  }, 3000);
}

/**
 * 隐藏全局成功提示
 */
export function hideSuccess() {
  success.visible = false;
}

/**
 * 表单验证工具
 */
export const validator = {
  /**
   * 验证邮箱
   * @param email 邮箱地址
   * @returns 是否有效
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * 验证URL
   * @param url URL地址
   * @returns 是否有效
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * 检查字符串是否为空
   * @param value 要检查的值
   * @returns 是否为空
   */
  isEmpty(value: string | null | undefined): boolean {
    return value === null || value === undefined || value.trim() === "";
  },
};

// 导出全局UI状态服务
export const uiState = {
  loading,
  showLoading,
  hideLoading,
  error,
  showError,
  hideError,
  success,
  showSuccess,
  hideSuccess,
  validator,
};
