// ========================================
// 8. UTILISATION DANS LE LAYOUT PRINCIPAL
// ========================================
// layouts/MainLayout.vue
<template>
    <div class="main-layout">
        <DynamicSidebar />

        <main class="content">
            <router-view />
        </main>
    </div>
</template>

<script>
import DynamicSidebar from '@/components/sidebar/DynamicSidebar.vue';

export default {
    name: 'MainLayout',
    components: {
        DynamicSidebar
    }
};
</script>

<style scoped>
.main-layout {
    display: flex;
    min-height: 100vh;
}

.content {
    flex: 1;
    margin-left: 260px;
    /* Largeur de la sidebar */
}

@media (max-width: 768px) {
    .content {
        margin-left: 0;
    }
}
</style>