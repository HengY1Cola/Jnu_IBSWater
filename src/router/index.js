import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "home",
    component: () => import('../views/Home'),
  },
  {
    path: "/search",
    name: "search",
    component: () => import('../views/Search'),
  },
  {
    path: "/sms",
    name: "sms",
    component: () => import('../views/Sms'),
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: () => import('../views/Home'),
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
