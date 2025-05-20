<template>
  <div class="interview-container">
    <div class="interview-content">
      <div
        class="markdown-body"
        v-html="markdownContent"
        ref="markdownRef"
      ></div>
      <div class="navigation-buttons">
        <router-link to="/challenge" class="next-button">下一步</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import MarkdownIt from "markdown-it";
import { getInterviewGuideData } from "../api/interview";
import { showLoading, hideLoading, showError } from "../utils/uiState";

const md = new MarkdownIt();
const markdownContent = ref("");
const markdownRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  try {
    showLoading("加载面试引导内容...");
    // 从API获取面试引导内容
    const guideData = await getInterviewGuideData(1);
    markdownContent.value = md.render(guideData.guideMarkdown);
  } catch (err) {
    console.error("Failed to load markdown content:", err);
    showError("加载面试引导内容失败，将使用默认内容", "加载错误");

    // 使用默认Markdown内容
    markdownContent.value = md.render(defaultMarkdownText);
  } finally {
    hideLoading();
  }
});

// 面试引导页面的默认Markdown文本，仅当API请求失败时使用
const defaultMarkdownText = `# HireWithCode - 面试者挑战项目

欢迎来到 \`HireWithCode\` 项目！这是一个专为技术面试者设计的真实项目挑战。目前，这个仓库刚刚起步，没有任何代码——只有待实现的功能（TODOs）。你的任务是将这些TODOs转变为实际的代码，提交你的Pull Request（PR）就是你面试的一部分挑战。

## 产品功能 TODOs
产品是一个 Web 网站（PC端、移动端兼容），分为 4 个步骤的页面：
- [ ] **欢迎语**：Logo + 一句话欢迎语（垂直水平居中，2 秒后自动进入下一页 *面试引导*）\`欢迎来到 infist 线上面试环节，期待你的加入！\` [logo](./logo.png) 
- [ ] **面试引导**：介绍面试的流程和说明（Markdown 文案展示，需要渲染为富文本样式）[页面文案 markdown](https://raw.githubusercontent.com/InfiniteStatesInc/HireWithCode/refs/heads/main/README.md)
- [ ] **接受挑战**：表单，\`input\`(用户输入自己的 github id) 、\`input\`(邮箱)、\`submit button\`(接受挑战)
- [ ] **完成挑战**：表单，\`input\`(github 仓库 url)、\`input\`([Vercel](https://vercel.app/) 在线体验地址)、\`submit button\`(提交作品)

## 如何参与？

1. 克隆仓库到你的本地机器。
2. 按照你对这个产品的理解，自行开发 TODO
4. 确保你的代码是可以运行的
5. 完成挑战后，通过Pull Request将你的代码提交给我们。
6. 在PR中附上你的Vercel在线体验链接。

> 备注说明：
> 这个项目的步骤 3、4 是是需要服务端能力的（API + 数据库），如果你不具备全栈的经验，可以考虑使用 [supabase](https://supabase.com/) 作为本项目的服务端（或者仅仅实现前端静态网页）

我们会审查每一个PR，并以此作为面试的一部分。我们期待看到你的创意和技术实力！

祝你好运！`;
</script>

<style lang="scss" scoped>
.interview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4eaf0 100%);
  animation: fadeIn 1.2s;

  .interview-content {
    max-width: 840px;
    width: 100%;
    padding: 30px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    animation: fadeInUp 1.2s;
    border: 1px solid rgba(99, 102, 241, 0.1);
  }
  @media (max-width: 768px) {
    padding: 15px;

    .interview-content {
      padding: 25px 20px;
      border-radius: 10px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    }
  }

  @media (max-width: 480px) {
    padding: 10px;

    .interview-content {
      padding: 20px 15px;
      border-radius: 8px;
      margin-top: 10px;
      margin-bottom: 10px;

      /* 优化在小屏幕上的阅读体验 */
      font-size: 15px;
      line-height: 1.5;
    }
  }
}

.navigation-buttons {
  text-align: center;
  padding: 10px 0;
  position: relative;

  &::before {
    width: 60px;
    height: 3px;
  }

  @media (max-width: 768px) {
    padding: 15px 0 5px;
  }
}

.next-button {
  display: inline-block;
  padding: 12px 36px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  transition: all 0.3s;
  animation: fadeInUp 1.2s;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 14px 0;
    display: block;
    text-align: center;
    min-height: 50px;
    font-size: 16px; // 稍微增大移动设备上的字体尺寸以提高点击率
  }

  @media (max-width: 480px) {
    border-radius: 6px;
    padding: 15px 0;
    font-size: 16px;
    margin-top: 10px; // 增加与上方内容的间距
    box-shadow: 0 4px 10px rgba(99, 102, 241, 0.25);
    font-weight: 700; // 更加突出按钮文字

    /* 添加轻微的脉冲动画引导用户点击 */
    animation: pulseButton 2s infinite;

    &:active {
      background: linear-gradient(135deg, #5255e8 0%, #7a48e3 100%);
    }
  }
}

/* 添加脉冲动画 */
@keyframes pulseButton {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 10px rgba(99, 102, 241, 0.25);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 10px rgba(99, 102, 241, 0.25);
  }
}
</style>

<style>
/* 为Markdown添加样式 - 只对h1使用渐变 */
.markdown-body h1 {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #6366f1; /* 降级方案 */
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 16px;
}

/* h2和h3使用普通颜色 */
.markdown-body h2,
.markdown-body h3 {
  color: #4a5568;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 16px;
}

.markdown-body {
  padding: 0px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.markdown-body ol,
.markdown-body ul {
  padding-left: 20px;
}

.markdown-body li {
  margin: 8px 0;
}

/* 代码样式 */
.markdown-body code {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  color: #333;
  padding: 2px 6px;
  font-family: Consolas, Monaco, "Andale Mono", monospace;
  word-break: break-word;
  white-space: pre-wrap;
  font-size: 0.9em;
}

.markdown-body pre {
  overflow-x: auto;
  padding: 16px;
  background-color: #f8f9fc;
  border-radius: 6px;
  margin: 16px 0;
  border: 1px solid #e9ecef;
}

.markdown-body pre code {
  white-space: pre;
  background-color: transparent;
  padding: 0;
  border: none;
}

/* 默认样式 */
.markdown-body strong {
  color: inherit;
  font-weight: 600;
}

.markdown-body blockquote {
  border-left: 4px solid #ddd;
  padding: 12px 16px;
  margin-left: 0;
  margin-right: 0;
  background-color: rgba(0, 0, 0, 0.03);
  color: #555;
  border-radius: 0 4px 4px 0;
}

/* 图片和表格 */
.markdown-body img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  display: block;
  margin: 16px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  overflow-x: auto;
  display: block;
}

.markdown-body table th,
.markdown-body table td {
  border: 1px solid #eaeaea;
  padding: 8px 12px;
}

.markdown-body table th {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 小屏幕设备进一步优化 */
@media (max-width: 480px) {
  .markdown-body {
    padding: 5px 0;
    font-size: 15px; /* 略微增大字体以提高可读性 */
    line-height: 1.5; /* 更紧凑的行高 */
    word-break: break-word; /* 确保长单词可以正确换行 */
    overflow-wrap: break-word; /* 支持更多浏览器 */
  }

  .markdown-body h1 {
    font-size: 1.7rem !important;
    margin-top: 16px;
    margin-bottom: 14px;
    line-height: 1.3;
  }

  .markdown-body h2 {
    font-size: 1.4rem !important;
    margin-top: 18px;
    margin-bottom: 10px;
  }

  .markdown-body h3 {
    font-size: 1.2rem !important;
  }

  /* 优化列表显示 */
  .markdown-body ul,
  .markdown-body ol {
    padding-left: 18px;
  }

  .markdown-body li {
    margin: 6px 0;
  }

  /* 优化代码块 */
  .markdown-body pre {
    padding: 12px 10px;
    margin: 14px 0;
    border-radius: 6px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; /* iOS滚动优化 */
  }

  .markdown-body code {
    font-size: 0.9em;
    padding: 2px 4px;
  }

  /* 表格响应式 */
  .markdown-body table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; /* iOS滚动优化 */
  }

  .markdown-body table th,
  .markdown-body table td {
    padding: 8px 10px;
    min-width: 80px; /* 确保单元格有最小宽度 */
  }

  .markdown-body blockquote {
    padding: 10px 12px;
    margin: 16px 0;
    border-left: 3px solid #ddd; /* 稍细的左边框 */
  }

  /* 确保图片不超出容器 */
  .markdown-body img {
    max-width: 100%;
    height: auto;
    margin: 14px auto;
  }

  /* 优化链接样式，增大点击区域 */
  .markdown-body a {
    padding: 2px 0;
    display: inline-block;
  }
}
</style>
