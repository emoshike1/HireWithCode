<script setup lang="ts">
import { RouterView } from "vue-router";
import LoadingOverlay from "./components/LoadingOverlay.vue";
import ErrorNotification from "./components/ErrorNotification.vue";
import SuccessNotification from "./components/SuccessNotification.vue";
import {
  loading,
  error,
  success,
  hideError,
  hideSuccess,
} from "./utils/uiState";
</script>

<template>
  <div class="app-container">
    <RouterView />

    <!-- 全局加载组件 -->
    <LoadingOverlay :visible="loading.visible" :message="loading.message" />

    <!-- 全局错误提示组件 -->
    <ErrorNotification
      :visible="error.visible"
      :title="error.title"
      :message="error.message"
      @close="hideError"
    />

    <!-- 全局成功提示组件 -->
    <SuccessNotification
      :visible="success.visible"
      :title="success.title"
      :message="success.message"
      @close="hideSuccess"
    />
  </div>
</template>

<style>
/* 基本重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  /* 启用平滑滚动 */
  scroll-behavior: smooth;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  min-height: 100vh;
}

/* 应用级容器 */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* 设置为滚动容器 */
  max-height: 100vh;
  overflow-y: auto;
  position: relative;
  width: 100%;
}

/* 全局动画 */
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* 全局过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 为固定位置元素添加Z-index策略 */
.sticky-element {
  position: sticky;
  bottom: 0;
  z-index: 10;
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.95) 80%,
    rgba(255, 255, 255, 0.6) 100%
  );
  padding: 10px 0;
}

/* 辅助类 */
.responsive-container {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .responsive-container {
    padding: 0 15px;
  }
}

@media (max-width: 480px) {
  .responsive-container {
    padding: 0 10px;
  }
}

/* 响应式布局工具类 */
.row {
  display: flex;
  flex-wrap: wrap;
  margin: -10px;
}

.col {
  padding: 10px;
  flex: 1;
}

/* 不同尺寸的列 */
.col-12 {
  width: 100%;
}
.col-6 {
  width: 50%;
}
.col-4 {
  width: 33.333%;
}
.col-3 {
  width: 25%;
}

@media (max-width: 768px) {
  .col-md-12 {
    width: 100%;
  }
  .col-md-6 {
    width: 50%;
  }
  .col-md-4 {
    width: 33.333%;
  }
}

@media (max-width: 480px) {
  .col-sm-12 {
    width: 100%;
  }
  .col-sm-6 {
    width: 50%;
  }
}

/* 表单适应小屏幕 */
@media (max-width: 480px) {
  input[type="text"],
  input[type="email"],
  input[type="url"],
  input[type="password"],
  textarea,
  select,
  button[type="submit"] {
    font-size: 16px !important; /* 防止iOS缩放 */
    padding: 12px !important;
  }

  button[type="submit"] {
    width: 100%;
    padding: 14px !important;
  }

  label {
    font-size: 14px !important;
  }
}
.text-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #6366f1; /* 降级方案 */
}
</style>
