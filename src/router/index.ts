import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Welcome",
    component: () => import("../views/Welcome.vue"),
  },
  {
    path: "/interview",
    name: "Interview",
    component: () => import("../views/Interview.vue"),
  },
  {
    path: "/challenge",
    name: "Challenge",
    component: () => import("../views/Challenge.vue"),
  },
  {
    path: "/submission",
    name: "Submission",
    component: () => import("../views/Submission.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
