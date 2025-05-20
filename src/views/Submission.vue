<template>
  <div class="submission-container">
    <div class="form-wrapper">
      <h2>完成挑战</h2>
      <div v-if="validationError" class="error-message">
        {{ validationError }}
      </div>

      <div v-if="successMessage" class="success-message">
        <div class="success-icon">✓</div>
        <p>{{ successMessage }}</p>
      </div>

      <form v-if="!successMessage" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="repoUrl">GitHub 仓库 URL:</label>
          <input
            type="url"
            id="repoUrl"
            v-model="repoUrl"
            placeholder="例如: https://github.com/username/repo"
            :disabled="isSubmitting"
            required
          />
        </div>

        <div class="form-group">
          <label for="vercelUrl">Vercel 在线体验地址:</label>
          <input
            type="url"
            id="vercelUrl"
            v-model="vercelUrl"
            placeholder="例如: https://your-project.vercel.app"
            :disabled="isSubmitting"
            required
          />
        </div>

        <button type="submit" class="submit-button" :disabled="isSubmitting">
          <span v-if="isSubmitting">提交中...</span>
          <span v-else>提交作品</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { submitProject } from "../api/interview";
import {
  showLoading,
  hideLoading,
  showError,
  showSuccess,
  validator,
} from "../utils/uiState";

const repoUrl = ref("");
const vercelUrl = ref("");
const githubId = ref("");
const email = ref("");
const isSubmitting = ref(false);
const validationError = ref("");
const successMessage = ref("");

onMounted(() => {
  // 从localStorage获取之前保存的数据
  githubId.value = localStorage.getItem("githubId") || "";
  email.value = localStorage.getItem("email") || "";
});

// 表单验证函数
const validateForm = (): boolean => {
  validationError.value = "";
  successMessage.value = "";

  // 检查上一步数据
  if (validator.isEmpty(githubId.value) || validator.isEmpty(email.value)) {
    validationError.value = "缺少GitHub ID或邮箱信息，请返回上一步重新填写";
    return false;
  }

  // 检查当前表单数据
  if (validator.isEmpty(repoUrl.value)) {
    validationError.value = "GitHub 仓库URL不能为空";
    return false;
  }

  if (validator.isEmpty(vercelUrl.value)) {
    validationError.value = "Vercel在线体验地址不能为空";
    return false;
  }

  // URL格式验证
  if (!validator.isValidUrl(repoUrl.value)) {
    validationError.value = "请输入有效的GitHub仓库URL";
    return false;
  }

  if (!validator.isValidUrl(vercelUrl.value)) {
    validationError.value = "请输入有效的Vercel地址";
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  // 表单验证
  if (!validateForm()) return;

  try {
    isSubmitting.value = true;
    showLoading("提交作品中...");

    // 调用API提交作品信息
    const response = await submitProject({
      githubId: githubId.value,
      email: email.value,
      repoUrl: repoUrl.value,
      vercelUrl: vercelUrl.value,
      guideId: 1,
    });

    // 检查响应状态
    if (!response.success) {
      throw new Error(response.message || "提交失败，请稍后重试");
    }

    console.log("提交作品:", {
      githubId: githubId.value,
      email: email.value,
      repoUrl: repoUrl.value,
      vercelUrl: vercelUrl.value,
    });

    // 显示成功提交信息
    successMessage.value =
      response.message || "作品提交成功！感谢您参与infist线上面试。";
    showSuccess("作品提交成功！", "提交成功");
  } catch (e) {
    console.error("提交作品失败:", e);
    showError("提交作品时出现问题，请稍后重试", "提交错误");
  } finally {
    hideLoading();
    isSubmitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.submission-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: #f8f9fa;
  animation: fadeIn 1.2s;
}

.form-wrapper {
  width: 100%;
  max-width: 420px;
  padding: 36px 28px 28px 28px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  animation: popIn 0.8s;

  h2 {
    margin-bottom: 25px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: #6366f1; /* 降级方案 */
    text-align: center;
    letter-spacing: 1px;
  }
}

.form-group {
  margin-bottom: 22px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
  }

  input {
    width: 100%;
    padding: 8px 12px;
    border: 1.5px solid #e0eafc;
    border-radius: 5px;
    font-size: 16px;
    transition: border-color 0.3s, box-shadow 0.3s;
    background: #f8fafc;

    &:focus {
      outline: none;
      border-color: #5b86e5;
      box-shadow: 0 0 0 2px #e0eafc;
    }
  }
}

.error-message {
  padding: 10px;
  margin-bottom: 15px;
  background-color: rgba(254, 226, 226, 0.8);
  border-left: 4px solid #ef4444;
  color: #b91c1c;
  font-size: 14px;
  border-radius: 4px;
}

.success-message {
  padding: 20px;
  background-color: rgba(220, 252, 231, 0.8);
  border-radius: 8px;
  text-align: center;
  animation: fadeInUp 0.8s;

  .success-icon {
    font-size: 48px;
    color: #10b981;
    margin-bottom: 15px;
  }

  p {
    color: #047857;
    font-size: 16px;
    line-height: 1.5;
  }
}

.submit-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(91, 134, 229, 0.08);
  margin-top: 8px;
  animation: fadeInUp 1.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.03);
  }

  &:disabled {
    background: linear-gradient(135deg, #a5a6f6 0%, #c0b6f2 100%);
    cursor: not-allowed;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes popIn {
  0% {
    transform: scale(0.92);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
