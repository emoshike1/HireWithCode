<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <div class="logo-container">
        <img :src="welcomeData.logoUrl" alt="infist Logo" class="logo" />
      </div>
      <h1 class="welcome-text">{{ welcomeData.welcomeText }}</h1>
      <div class="timer-container">
        <div class="timer-bar" ref="timerBarRef"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  onMounted,
  onBeforeUnmount,
  reactive,
  useTemplateRef,
  nextTick,
} from "vue";
import { useRouter } from "vue-router";
import { getWelcomeData } from "../api/interview";
import type { WelcomeResponse } from "../api/types";
import { showLoading, hideLoading, showError } from "../utils/uiState";

const router = useRouter();
const timerBarRef = useTemplateRef("timerBarRef");
let timeoutId: number | null = null;
const welcomeData = reactive<WelcomeResponse>({
  welcomeText: "",
  logoUrl: "/logo.png", // 默认值，如果API请求失败
});

// 清理函数
const cleanup = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  if (timerBarRef.value) {
    timerBarRef.value.removeEventListener("transitionend", handleTransitionEnd);
  }
};

// 处理过渡结束事件
const handleTransitionEnd = () => {
  router.push("/interview");
};

onMounted(async () => {
  try {
    // 显示全局加载状态
    showLoading("加载欢迎页面内容...");

    // 从API获取欢迎页数据
    const data = await getWelcomeData(1);
    welcomeData.welcomeText = data.welcomeText;
    welcomeData.logoUrl = data.logoUrl;
  } catch (error) {
    console.error("获取欢迎页数据失败:", error);
    // 使用默认值（在reactive创建时已设置）
    showError("获取欢迎页数据失败，将使用默认内容");
  } finally {
    // 隐藏全局加载状态
    hideLoading();

    // 数据加载后，启动计时器
    nextTick(() => {
      if (timerBarRef.value) {
        timerBarRef.value.addEventListener(
          "transitionend",
          handleTransitionEnd
        );

        // 延迟启动动画
        timeoutId = window.setTimeout(() => {
          if (timerBarRef.value) {
            timerBarRef.value.style.width = "100%";
          }
        }, 100);
      } else {
        // 备用跳转
        timeoutId = window.setTimeout(() => {
          router.push("/interview");
        }, 2000);
      }
    });
  }
});

// 组件销毁前清理事件和定时器
onBeforeUnmount(cleanup);
</script>

<style lang="scss" scoped>
/* 1. 主容器样式 */
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  text-align: center;
  background-color: #f8f9fa;

  /* 2. 内容卡片样式 */
  .welcome-content {
    max-width: 600px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    padding: 40px 30px 30px 30px;
    animation: popIn 0.8s;
    border: 1px solid rgba(255, 255, 255, 0.5);
    position: relative;

    /* 3. Logo相关样式 */
    .logo-container {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;

      .logo {
        max-width: 120px;
        animation: logoBounce 1.2s;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
      }
    }

    /* 4. 文本样式 */
    .welcome-text {
      font-size: 28px;
      color: #2c3e50;
      margin-top: 20px;
      letter-spacing: 1.2px;
      animation: fadeInUp 1.2s;
      font-weight: 600;
      line-height: 1.4;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    /* 5. 进度指示器样式 */
    .progress-indicator {
      display: flex;
      justify-content: center;
      margin-top: 30px;

      .progress-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        margin: 0 5px;
        transition: all 0.3s;

        &.active {
          background: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
          transform: scale(1.2);
        }
      }
    }

    /* 6. 计时器样式 */
    .timer-container {
      width: 80%;
      height: 4px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      margin: 20px auto 0;
      overflow: hidden;

      .timer-bar {
        height: 100%;
        width: 0%;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        border-radius: 2px;
        transition: width 2s linear;
      }
    }
  }
}

/* 7. 动画关键帧 */
@keyframes logoBounce {
  0% {
    transform: scale(0.7);
    opacity: 0;
  }
  60% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
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

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* 8. 加载状态样式 */
.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 200px;

  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(99, 102, 241, 0.2);
    border-radius: 50%;
    border-top-color: #6366f1;
    animation: spin 1s ease-in-out infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 9. 响应式适配 */
@media (max-width: 768px) {
  .welcome-container {
    .welcome-content {
      padding: 30px 20px 20px;
      width: 90%;

      .welcome-text {
        font-size: 22px;
      }

      .logo-container {
        .logo {
          max-width: 100px;
        }
      }

      .timer-container {
        width: 90%;
      }
    }
  }
}
</style>
