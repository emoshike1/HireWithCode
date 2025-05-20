<template>
  <div class="success-notification" v-if="visible" :class="{ show: visible }">
    <div class="success-icon">
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
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    </div>
    <div class="success-content">
      <div class="success-title">{{ title }}</div>
      <div class="success-message">{{ message }}</div>
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
    default: "成功",
  },
  message: {
    type: String,
    default: "操作成功！",
  },
});

defineEmits(["close"]);
</script>

<style lang="scss" scoped>
.success-notification {
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
  border-left: 4px solid #10b981;

  &.show {
    transform: translateX(0);
  }

  .success-icon {
    color: #10b981;
    margin-right: 12px;
    flex-shrink: 0;
  }

  .success-content {
    flex-grow: 1;

    .success-title {
      font-weight: 600;
      margin-bottom: 4px;
      color: #111827;
    }

    .success-message {
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
