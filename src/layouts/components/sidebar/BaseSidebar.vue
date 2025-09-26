<template>
    <nav class="navbar sidebar navbar-expand-xl navbar-light">
        <!-- Navbar brand -->
        <div class="d-flex align-items-center">
            <router-link class="navbar-brand" :to="dashboardRoute">
                <img class="light-mode-item navbar-brand-item" src="@/assets/images/logo.png" alt="logo">
                <img class="dark-mode-item navbar-brand-item" src="@/assets/images/logo-light.svg" alt="logo">
            </router-link>
        </div>

        <div class="offcanvas offcanvas-start flex-row custom-scrollbar h-100" data-bs-backdrop="true" tabindex="-1"
            id="offcanvasSidebar">
            <div class="offcanvas-body sidebar-content d-flex flex-column pt-4">
                <!-- Sidebar menu -->
                <ul class="navbar-nav flex-column" id="navbar-sidebar">
                    <!-- Dashboard Link -->
                    <li class="nav-item">
                        <router-link :to="dashboardRoute" class="nav-link"
                            :class="{ active: isActiveRoute(dashboardRoute) }">
                            {{ dashboardTitle }}
                        </router-link>
                    </li>

                    <!-- Dynamic Menu Items -->
                    <template v-for="section in menuSections" :key="section.title">
                        <li class="nav-item ms-2 my-2">{{ section.title }}</li>

                        <template v-for="item in section.items" :key="item.title">
                            <!-- Simple Menu Item -->
                            <li v-if="!item.children" class="nav-item">
                                <router-link :to="item.route" class="nav-link"
                                    :class="{ active: isActiveRoute(item.route) }">
                                    <i v-if="item.icon" :class="`${item.icon} me-2`"></i>
                                    {{ item.title }}
                                </router-link>
                            </li>

                            <!-- Collapsible Menu Item -->
                            <li v-else class="nav-item">
                                <a class="nav-link" data-bs-toggle="collapse" :href="`#collapse${item.id}`"
                                    role="button" aria-expanded="false" :aria-controls="`collapse${item.id}`"
                                    @click="toggleSubmenu(item.id)">
                                    <i v-if="item.icon" :class="`${item.icon} me-2`"></i>
                                    {{ item.title }}
                                </a>

                                <!-- Submenu -->
                                <ul class="nav collapse flex-column" :id="`collapse${item.id}`"
                                    data-bs-parent="#navbar-sidebar" :class="{ show: openSubmenus.includes(item.id) }">
                                    <li v-for="child in item.children" :key="child.title" class="nav-item">
                                        <router-link :to="child.route" class="nav-link"
                                            :class="{ active: isActiveRoute(child.route) }">
                                            {{ child.title }}
                                        </router-link>
                                    </li>
                                </ul>
                            </li>
                        </template>
                    </template>
                </ul>

                <!-- Sidebar footer -->
                <div class="d-flex align-items-center justify-content-between text-primary-hover mt-auto p-3">
                    <a class="h6 fw-light mb-0 text-body" href="#" @click="logout" data-bs-toggle="tooltip"
                        data-bs-placement="top" aria-label="Sign out">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i> Log out
                    </a>
                    <router-link :to="settingsRoute" class="h6 mb-0 text-body" data-bs-toggle="tooltip"
                        data-bs-placement="top" aria-label="Settings">
                        <i class="bi bi-gear-fill"></i>
                    </router-link>
                </div>
            </div>
        </div>
    </nav>

    <div class="page-content">
        <TopNavbar @logout="logout" />
    </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
export default {
    name: 'BaseSidebar',
    emits: ["logout"],
    props: {
        dashboardRoute: {
            type: String,
            required: true
        },
        dashboardTitle: {
            type: String,
            required: true
        },
        settingsRoute: {
            type: String,
            required: true
        },
        menuSections: {
            type: Array,
            required: true
        }
    },
    components: {
        TopNavbar
    },
    data() {
        return {
            openSubmenus: []
        }
    },
    methods: {
        isActiveRoute(route) {
            return this.$route.path === route || this.$route.path.startsWith(route + '/');
        },
        toggleSubmenu(submenuId) {
            const index = this.openSubmenus.indexOf(submenuId);
            if (index > -1) {
                this.openSubmenus.splice(index, 1);
            } else {
                this.openSubmenus.push(submenuId);
            }
        },
        logout() {
            this.$emit('logout');
        }
    },
    mounted() {
        // Auto-open submenu if current route is in it
        this.menuSections.forEach(section => {
            section.items.forEach(item => {
                if (item.children) {
                    const hasActiveChild = item.children.some(child =>
                        this.isActiveRoute(child.route)
                    );
                    if (hasActiveChild && !this.openSubmenus.includes(item.id)) {
                        this.openSubmenus.push(item.id);
                    }
                }
            });
        });
    }
}
</script>

<style scoped>
/* Ajoute tes styles ici */
</style>
