/**
 * 面试相关API服务
 */
import http from "../utils/http";
import type {
  ApiResponse,
  WelcomeResponse,
  GuideResponse,
  CandidateSubmission,
} from "./types";

/**
 * 获取欢迎页数据
 * @param id 欢迎页ID
 * @returns 欢迎页数据
 */
export async function getWelcomeData(id: number = 1): Promise<WelcomeResponse> {
  try {
    const response = await http.get<WelcomeResponse>(
      `/interview/welcome/${id}`
    );
    return response;
  } catch (error) {
    console.error("API请求错误:", error);
    // 返回默认数据
    return {
      welcomeText: "欢迎来到 infist 线上面试环节，期待你的加入！",
      logoUrl: "/logo.png",
    };
  }
}

/**
 * 用户信息提交接口参数类型
 */
export interface UserInfoParams {
  githubId: string;
  email: string;
  guideId: number;
}

/**
 * 项目提交接口参数类型
 */
export interface ProjectSubmitParams extends UserInfoParams {
  repoUrl: string;
  vercelUrl: string;
}

/**
 * 接受挑战（提交用户信息）
 * @param data 用户信息
 * @returns API响应
 */
export async function submitUserInfo(
  data: UserInfoParams
): Promise<ApiResponse> {
  try {
    return await http.post<ApiResponse>("/interview/accept-challenge", data);
  } catch (error) {
    console.error("API请求错误:", error);
    // 返回一个统一格式的错误响应，方便上层处理
    return {
      success: false,
      message: error instanceof Error ? error.message : "提交用户信息失败",
    };
  }
}

/**
 * 提交作品信息
 * @param data 作品信息
 * @returns API响应
 */
export async function submitProject(
  data: ProjectSubmitParams
): Promise<ApiResponse> {
  try {
    return await http.post<ApiResponse>("/interview/submit-challenge", data);
  } catch (error) {
    console.error("API请求错误:", error);
    // 返回一个统一格式的错误响应，方便上层处理
    return {
      success: false,
      message: error instanceof Error ? error.message : "提交作品信息失败",
    };
  }
}

/**
 * 获取面试引导页Markdown内容
 * @param id 面试引导ID
 * @returns 面试引导页数据
 */
export async function getInterviewGuideData(
  id: number = 1
): Promise<GuideResponse> {
  try {
    const response = await http.get<GuideResponse>(`/interview/guide/${id}`);
    return response;
  } catch (error) {
    console.error("API请求错误:", error);
    // 返回默认数据
    return {
      guideMarkdown: `获取面试引导页数据失败，请稍后再试。`,
    };
  }
}
