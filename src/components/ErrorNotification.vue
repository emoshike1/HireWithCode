<template>
  <div class="error-notification" v-if="visible" :class="{ show: visible }">
    <div class="error-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    </div>
    <div class="error-content">
      <div class="error-title">{{ title }}</div>
      <div class="error-message">{{ message }}</div>
    </div>
    <button class="close-button" @click="$emit('close')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "错误",
  },
  message: {
    type: String,
    default: "发生未知错误，请重试",
  },
});

defineEmits(["close"]);
</script>

<style lang="scss" scoped>
.error-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 320px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  padding: 16px;
  transform: translateX(120%);
  transition: transform 0.3s ease;
  z-index: 10000;
  border-left: 4px solid #ef4444;

  &.show {
    transform: translateX(0);
  }

  .error-icon {
    color: #ef4444;
    margin-right: 12px;
    flex-shrink: 0;
  }

  .error-content {
    flex-grow: 1;

    .error-title {
      font-weight: 600;
      margin-bottom: 4px;
      color: #111827;
    }

    .error-message {
      font-size: 14px;
      color: #4b5563;
    }
  }

  .close-button {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 0;
    margin-left: 8px;
    flex-shrink: 0;

    &:hover {
      color: #4b5563;
    }
  }
}
</style>
