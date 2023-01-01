import WebsiteLayout from "@/layouts/Website.vue";
import SecondWebsiteLayout from "@/layouts/SecondWebsite.vue";
import store from "@/store/index";
const publicRoutes = [
  {
    path: "/home",
    component: WebsiteLayout,
    children: [
      {
        path: "/home",
        name: "Accueil",
        component: () => import("@/views/Accueil.vue"),
      },
    ],
  },
  {
    path: "/directory",
    component: SecondWebsiteLayout,
    children: [
      {
        path: "directory/details/:id",
        name: "DirectoryDetails",
        component: () => import("@/views/DetailsBiensImmobiliers.vue"),
      },
      {
        path: "profils",
        name: "Profils",
        component: () => import("@/views/UserProfils.vue"),
        meta: { requiresAuth: true },
        children: [
          {
            path: "delete_account",
            name: "DeleteAccount",
            component: () => import("@/views/DeleteAccount.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "details_profil",
            name: "details_profil",
            component: () => import("@/views/ProfilsDetails.vue"),
            meta: { requiresAuth: true },
            props: true,
          },
          {
            path: "reservations_details",
            name: "ReservationsDetails",
            component: () => import("@/views/ReservationsDetails.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "terms",
            name: "TermOfService",
            component: () => import("@/views/TermOfService.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "/liste-biens-360",
            name: "liste-biens-360",
            component: () => import("@/views/Visite360.vue"),
            // meta: { requiresAuth: true },
          },
        ],
      },

      {
        path: "confirmation",
        name: "confirmation",
        component: () => import("@/views/Confirmation.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "details_menu/:id",
        name: "DirectoryDetailsMenu",
        component: () => import("@/views/DetailsBiensImmobiliersMenu.vue"),
        props: true,
      },
    ],
  },
  // En dehors du layout
  // { path: "/timeOutError", name: "timeOutError", component: TimeOutError },
  // { path: "/passwordReset", name: "passwordReset", component: PasswordReset },
  {
    path: "/directory/unauthorized",
    name: "Unauthorized",
    component: () => import("@/views/Unauthorized.vue"),
  },

  {
    path: "/directory/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/login/oauth2/success",
    name: "OAuth2Success",
    component: () => import("@/views/OAuth2Redirect.vue"),
  },
  {
    path: "/directory/signup",
    name: "SignUp",
    component: () => import("@/views/SignUp.vue"),
  },
  {
    path: "/directory/forgot",
    name: "forgot",
    component: () => import("@/views/ForgotPassword.vue"),
  },
  {
    path: "/directory/verify", // /password-reset/verify
    name: "PasswordResetVerify",
    component: () => import("@/views/PasswordResetVerify.vue"),
  },
  {
    path: "/directory/confirm", // /password-reset/confirm
    name: "PasswordResetConfirm",
    component: () => import("@/views/PasswordResetConfirm.vue"),
  },
  {
    path: "/select-role",
    name: "SelectRole",
    component: () => import("@/components/input/select-role.vue"),
    meta: { requiresAuth: false },
  },

  // {
  //   path: "*",
  //   name: "NotFound",
  //   component: () => import("@/views/NotFound.vue"),
  // },
];

export default publicRoutes;
