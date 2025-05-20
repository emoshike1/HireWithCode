import { createApp } from "vue";
import "./style.css";
// 导入全局样式
import "./assets/global.css";
// 导入响应式工具类
import "./assets/responsive.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(router);
app.mount("#app");
