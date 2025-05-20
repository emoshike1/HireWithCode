/**
 * API响应类型定义
 */

/**
 * HTTP状态码常量
 */
export const HttpStatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode =
  (typeof HttpStatusCode)[keyof typeof HttpStatusCode];

/**
 * 基础响应接口
 */
export interface ApiResponse<T = any> {
  /**
   * 响应状态
   */
  success: boolean;

  /**
   * 响应消息
   */
  message: string;

  /**
   * 响应数据
   */
  data?: T;

  /**
   * HTTP状态码
   */
  code?: HttpStatusCode;

  /**
   * 错误详情（仅在开发环境使用）
   */
  error?: string;
}

/**
 * 欢迎页数据响应
 */
export interface WelcomeResponse {
  welcomeText: string;
  logoUrl: string;
}

/**
 * 面试引导页响应
 */
export interface GuideResponse {
  guideMarkdown: string;
}

/**
 * 候选人信息
 */
export interface CandidateSubmission {
  /**
   * GitHub ID
   */
  githubId: string;

  /**
   * 邮箱
   */
  email: string;

  /**
   * GitHub 仓库URL
   */
  repoUrl?: string;

  /**
   * Vercel 部署URL
   */
  vercelUrl?: string;
}
