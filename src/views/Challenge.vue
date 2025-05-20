<template>
  <div class="challenge-container">
    <div class="form-wrapper">
      <h2>接受挑战</h2>
      <p v-if="validationError" class="error-message">{{ validationError }}</p>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="githubId">GitHub ID:</label>
          <input
            type="text"
            id="githubId"
            v-model="githubId"
            placeholder="例如: username"
            :disabled="isSubmitting"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">邮箱:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="例如: your.email@example.com"
            :disabled="isSubmitting"
            required
          />
        </div>

        <button type="submit" class="submit-button" :disabled="isSubmitting">
          <span v-if="isSubmitting">提交中...</span>
          <span v-else>接受挑战</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { submitUserInfo } from "../api/interview";
import {
  showLoading,
  hideLoading,
  showError,
  showSuccess,
  validator,
} from "../utils/uiState";

const router = useRouter();
const githubId = ref("");
const email = ref("");
const isSubmitting = ref(false);
const validationError = ref("");

// 表单验证函数
const validateForm = (): boolean => {
  validationError.value = "";

  if (validator.isEmpty(githubId.value)) {
    validationError.value = "GitHub ID 不能为空";
    return false;
  }

  if (validator.isEmpty(email.value)) {
    validationError.value = "邮箱不能为空";
    return false;
  }

  if (!validator.isValidEmail(email.value)) {
    validationError.value = "请输入有效的邮箱地址";
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
    showLoading("提交信息中...");

    // 调用API提交用户信息
    const response = await submitUserInfo({
      githubId: githubId.value,
      email: email.value,
      guideId: 1,
    });

    // 检查响应状态
    if (!response.success) {
      throw new Error(response.message || "提交失败，请稍后重试");
    }

    // 存储到localStorage
    localStorage.setItem("githubId", githubId.value);
    localStorage.setItem("email", email.value);

    console.log("接受挑战:", {
      githubId: githubId.value,
      email: email.value,
    });

    // 显示成功消息
    showSuccess("信息提交成功！即将进入下一步", "提交成功");

    // 延迟0.5秒后跳转，让用户看到成功提示
    setTimeout(() => {
      // 跳转到提交作品页面
      router.push("/submission");
    }, 500);
  } catch (e) {
    console.error("提交用户信息失败");
    showError("提交信息时出现网络问题，但您仍可继续", "提交警告");
  } finally {
    hideLoading();
    isSubmitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.challenge-container {
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
