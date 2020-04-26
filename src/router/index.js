import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Layout from "@/layout/index";

export const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index"),
    meta: { isPublic: true, hidden: true },
  },
  {
    path: "/404",
    name: "404page",
    component: () => import("@/views/error-page/404"),
    meta: { isPublic: true, hidden: true },
  },
  {
    path: "/",
    name: "Layout",
    component: Layout,
    meta: { isPublic: true },
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { isPublic: true, title: "Dashboard", icon: "dashboard" },
      },
    ],
  },
  {
    path: "/example",
    name: "Example",
    component: Layout,
    meta: { isPublic: true, title: "Example", icon: "example" },
    redirect: "/example/table",
    children: [
      {
        path: "table",
        name: "Table",
        component: () => import("@/views/example/table/index"),
        meta: { isPublic: true, title: "Table", icon: "table" },
      },
      {
        path: "tree",
        name: "Tree",
        component: () => import("@/views/example/tree/index"),
        meta: { isPublic: true, title: "Tree", icon: "tree" },
      },
    ],
  },
  {
    path: "/form",
    component: Layout,
    meta: { isPublic: true },
    redirect: "/form/index",
    children: [
      {
        path: "index",
        name: "Form",
        component: () => import("@/views/form/index"),
        meta: { isPublic: true, title: "Form", icon: "form" },
      },
    ],
  },

  {
    path: "/nested",
    name: "Nested",
    component: Layout,
    meta: { isPublic: true, title: "Nested", icon: "nested" },
    redirect: "/nested/menu1",
    children: [
      {
        path: "menu1",
        name: "Menu1",
        component: () => import("@/views/nested/menu1/index"),
        meta: { isPublic: true, title: "Menu1", icon: "menu" },
        redirect:"/nested/menu1/menu1-1",
        children: [
          {
            path: "menu1-1",
            name: "Menu1-1",
            component: () => import("@/views/nested/menu1/menu1-1/index"),
            meta: { isPublic: true, title: "Menu1-1", icon: "" },
          },
          {
            path: "menu1-2",
            name: "Menu1-2",
            component: () => import("@/views/nested/menu1/menu1-2/index"),
            meta: { isPublic: true, title: "Menu1-2", icon: "" },
            children: [
              {
                path: "menu1-2-1",
                name: "Menu1-2-1",
                component: () =>
                  import("@/views/nested/menu1/menu1-2/menu1-2-1/index"),
                meta: { isPublic: true, title: "Menu1-2-1", icon: "" },
              },
              {
                path: "menu1-2-2",
                name: "Menu1-2-2",
                component: () =>
                  import("@/views/nested/menu1/menu1-2/menu1-2-2/index"),
                meta: { isPublic: true, title: "Menu1-2-2", icon: "" },
              },
            ],
          },
          {
            path: "menu1-3",
            name: "Menu1-3",
            component: () => import("@/views/nested/menu1/menu1-3/index"),
            meta: { isPublic: true, title: "Menu1-3", icon: "" },
          },
        ],
      },
      {
        path: "menu2",
        name: "Menu2",
        component: () => import("@/views/nested/menu2/index"),
        meta: { isPublic: true, title: "Menu2", icon: "menu" },
      },
    ],
  },
  {
    path: "external-link",
    component: Layout,
    meta: { isPublic: true },
    children: [
      {
        path: "https://www.yuque.com/yeyuzhufeng/kb",
        meta: { isPublic: true, title: "External Link", icon: "link" },
      },
    ],
  },
  { path: '*', redirect: '/404', meta: { isPublic: true, hidden: true } }
];

const router = new Router({
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta.isPublic && !localStorage.token) {
    return next("/login");
  }else{
    next();
  }
});

export default router;
