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
        ],
      },
      {
        path: "reservation",
        name: "reservation",
        component: () => import("@/views/Reservation.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "confirmation",
        name: "confirmation",
        component: () => import("@/views/Confirmation.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/details_menu/:id",
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
    path: "/directory/signup",
    name: "SignUp",
    component: () => import("@/views/SignUp.vue"),
  },
  {
    path: "/directory/forgot",
    name: "forgot",
    component: () => import("@/views/ForgotPassword.vue"),
  },
  // {
  //   path: "*",
  //   name: "NotFound",
  //   component: () => import("@/views/NotFound.vue"),
  // },
];

export default publicRoutes;
