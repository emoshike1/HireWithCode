<template>
  <div class="loading-overlay" v-if="visible">
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: "加载中...",
  },
});
</script>

<style lang="scss" scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(99, 102, 241, 0.2);
      border-radius: 50%;
      border-top-color: #6366f1;
      animation: spin 1s ease-in-out infinite;
    }

    p {
      margin-top: 16px;
      font-size: 14px;
      color: #4b5563;
      font-weight: 500;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
