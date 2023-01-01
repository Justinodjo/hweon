<template>
    <main>
        <!-- =======================
Main banner START -->
        <section class="pt-0">
            <!-- Background and title -->
            <div class="container-fluid style_img_pro">
                <!-- Canvas 3D -->
                <div id="three-container" class="three-background"></div>
                <div class="row">
                    <!-- Title -->
                    <div class="col-md-6 mx-auto text-center pt-8 pb-9 mt-7">
                        <h1 class="text-white">Hotel, cab, flight & tour experience</h1>
                        <p class="lead text-white mb-0">Get the best prices on 2,000,000+ properties, worldwide</p>
                    </div>
                </div>
            </div>

            <!-- Search START -->
            <div class="container mt-n8">
                <div class="row">
                    <!-- Tabs START -->
                    <div class="col-11 col-lg-8 col-xl-6 mx-auto">
                        <ul
                            class="nav nav-tabs nav-bottom-line nav-justified nav-responsive bg-mode rounded-top z-index-9 position-relative pt-2 pb-0 px-2">
                            <li class="nav-item" v-for="(item, index) in services" :key="index"
                                @click="currentTab = item.id" :class="{ active: currentTab === item.id }">
                                <a class="nav-link mb-0" data-bs-toggle="tab" @click.prevent="currentTab = item.id">{{
                                    item.nomTypeBiensImmo }}</a>
                            </li>
                        </ul>
                    </div>

                    <!-- Tab content START -->
                    <div class="col-12">
                        <div class="tab-content" id="nav-tabContent">
                            <div class="tab-pane fade show active" v-for="(item, index) in services" :key="index"
                                v-show="currentTab === item.id">
                                <form class="card shadow p-0">
                                    <!-- Card header -->
                                    <div class="card-header p-4">
                                        <h5 class="mb-0">
                                            <i class="fa-solid fa-hotel fa-fw me-2"></i>{{ item.nomTypeBiensImmo }}
                                        </h5>
                                    </div>

                                    <!-- Card body -->
                                    <div class="card-body p-4 pt-0">
                                        <div class="row g-4">
                                            <!-- Recherche principale -->
                                            <div class="col-md-8">
                                                <div class="form-icon-input form-size-lg form-fs-lg">
                                                    <input type="text" class="form-control"
                                                        placeholder="Rechercher un bien..."
                                                        v-model="searchFilters.globalSearch" @input="debouncedSearch" />
                                                    <span class="form-icon"><i class="bi bi-search fs-5"></i></span>
                                                </div>
                                            </div>

                                            <!-- Bouton filtres avancés -->
                                            <div class="col-md-4">
                                                <button type="button" class="btn btn-primary w-100"
                                                    @click="showAdvancedFilters = !showAdvancedFilters">
                                                    <i class="bi bi-funnel me-2"></i>Filtres avancés
                                                </button>
                                            </div>

                                            <!-- NOUVEAUTÉ: Filtres avancés -->
                                            <div v-if="showAdvancedFilters" class="col-12">
                                                <div class="card border">
                                                    <div class="card-body">
                                                        <div class="row g-3">
                                                            <!-- Commune -->
                                                            <div class="col-md-4">
                                                                <label class="form-label">Commune</label>
                                                                <select v-model="searchFilters.commune"
                                                                    class="form-select">
                                                                    <option value="">Toutes les communes</option>
                                                                    <option value="Cotonou">Cotonou</option>
                                                                    <option value="Porto-Novo">Porto-Novo</option>
                                                                    <option value="Parakou">Parakou</option>
                                                                    <option value="Abomey-Calavi">Abomey-Calavi</option>
                                                                </select>
                                                            </div>

                                                            <!-- Statut -->
                                                            <div class="col-md-4">
                                                                <label class="form-label">Disponibilité</label>
                                                                <select v-model="searchFilters.status"
                                                                    class="form-select">
                                                                    <option :value="null">Tous</option>
                                                                    <option :value="true">Disponible</option>
                                                                    <option :value="false">Non disponible</option>
                                                                </select>
                                                            </div>

                                                            <!-- Prix min -->
                                                            <div class="col-md-4">
                                                                <label class="form-label">Prix minimum (XOF)</label>
                                                                <input type="number" v-model="searchFilters.minPrice"
                                                                    class="form-control" placeholder="0">
                                                            </div>

                                                            <!-- Prix max -->
                                                            <div class="col-md-4">
                                                                <label class="form-label">Prix maximum (XOF)</label>
                                                                <input type="number" v-model="searchFilters.maxPrice"
                                                                    class="form-control" placeholder="500000">
                                                            </div>

                                                            <!-- Date début -->
                                                            <div class="col-md-4">
                                                                <label class="form-label">Date début</label>
                                                                <input type="date" v-model="searchFilters.dateDebut"
                                                                    class="form-control">
                                                            </div>

                                                            <!-- Date fin -->
                                                            <div class="col-md-4">
                                                                <label class="form-label">Date fin</label>
                                                                <input type="date" v-model="searchFilters.dateFin"
                                                                    class="form-control">
                                                            </div>

                                                            <!-- Nombre d'occupants -->
                                                            <div class="col-md-4">
                                                                <label class="form-label">Nombre d'occupants</label>
                                                                <input type="number" v-model="searchFilters.occupants"
                                                                    class="form-control" min="0" placeholder="0">
                                                            </div>

                                                            <!-- Boutons d'action -->
                                                            <div class="col-12">
                                                                <button type="button" @click="applyAdvancedFilters"
                                                                    class="btn btn-success me-2">
                                                                    <i class="bi bi-check2 me-2"></i>Appliquer
                                                                </button>
                                                                <button type="button" @click="resetFilters"
                                                                    class="btn btn-secondary">
                                                                    <i class="bi bi-x-circle me-2"></i>Réinitialiser
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- NOUVEAUTÉ: Barre d'outils avec conversion de devises et favoris -->
        <section class="py-3 bg-light">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <div class="d-flex align-items-center gap-3">
                            <!-- Bouton conversion devise -->
                            <button @click="toggleCurrency" class="btn btn-sm btn-outline-primary">
                                <i class="bi bi-currency-exchange me-2"></i>
                                Convertir en {{ currentCurrency === 'XOF' ? 'USD' : 'XOF' }}
                            </button>

                            <!-- Affichage devise actuelle -->
                            <span class="badge bg-info">
                                Devise: {{ currentCurrency }}
                            </span>
                        </div>
                    </div>

                    <div class="col-md-6 text-end">
                        <!-- Authentification -->
                        <div v-if="!isAuthenticated">
                            <button @click="showLoginModal = true" class="btn btn-sm btn-primary">
                                <i class="bi bi-person me-2"></i>Se connecter
                            </button>
                        </div>
                        <div v-else class="d-flex align-items-center justify-content-end gap-3">
                            <span class="text-muted">Bonjour, {{ user.nom }}</span>
                            <button @click="showFavorites" class="btn btn-sm btn-outline-danger position-relative">
                                <i class="bi bi-heart-fill"></i>
                                <span v-if="favorites.length > 0"
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {{ favorites.length }}
                                </span>
                            </button>
                            <button @click="logout" class="btn btn-sm btn-outline-secondary">
                                <i class="bi bi-box-arrow-right me-2"></i>Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Modal Géolocalisation -->
        <el-dialog v-model="showGeoModal" title="Localisation du bien" width="80%">
            <div class="leaflet-container-wrapper">
                <div id="map" class="leaflet-container-map"></div>
            </div>
        </el-dialog>

        <!-- NOUVEAUTÉ: Modal de notation -->
        <el-dialog v-model="notationVisible" title="Noter ce bien" width="30%">
            <div class="text-center mb-4">
                <h5>{{ bienSelectionne ? bienSelectionne.nom : '' }}</h5>
            </div>

            <div class="d-flex justify-content-center mb-3">
                <div class="rating-stars">
                    <i v-for="n in 5" :key="n" @click="noteTemp = n" @mouseover="hoverRating = n"
                        @mouseleave="hoverRating = 0" class="bi fs-1 cursor-pointer"
                        :class="(hoverRating || noteTemp) >= n ? 'bi-star-fill text-warning' : 'bi-star text-muted'">
                    </i>
                </div>
            </div>

            <div class="text-center">
                <p class="text-muted">Note sélectionnée: {{ noteTemp }}/5</p>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <button @click="notationVisible = false" class="btn btn-secondary me-2">Annuler</button>
                    <button @click="envoyerNote" class="btn btn-primary">
                        <i class="bi bi-check2 me-2"></i>Valider
                    </button>
                </span>
            </template>
        </el-dialog>

        <!-- NOUVEAUTÉ: Modal 360° -->
        <el-dialog v-model="show360Modal" title="Vue 360° du bien" width="90%" fullscreen>
            <div class="ratio ratio-16x9" style="height: 80vh;">
                <iframe v-if="selected360Url" :src="selected360Url" allowfullscreen style="border: none;">
                </iframe>
                <div v-else class="d-flex align-items-center justify-content-center bg-light">
                    <p class="text-muted">Vue 360° non disponible pour ce bien</p>
                </div>
            </div>
        </el-dialog>

        <!-- NOUVEAUTÉ: Modal de contact/suggestion -->
        <el-dialog v-model="showContactModal" title="Nous contacter" width="50%">
            <form @submit.prevent="sendMessage">
                <div class="mb-3">
                    <label class="form-label">Nom complet *</label>
                    <input v-model="form.nom" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Email *</label>
                    <input v-model="form.email" type="email" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Téléphone</label>
                    <input v-model="form.telephone" type="tel" class="form-control">
                </div>
                <div class="mb-3">
                    <label class="form-label">Message *</label>
                    <textarea v-model="form.message" class="form-control" rows="5" required></textarea>
                </div>
                <div class="text-end">
                    <button type="button" @click="showContactModal = false" class="btn btn-secondary me-2">
                        Annuler
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-send me-2"></i>Envoyer
                    </button>
                </div>
            </form>
        </el-dialog>

        <!-- NOUVEAUTÉ: Modal de connexion simple -->
        <el-dialog v-model="showLoginModal" title="Connexion" width="400px">
            <form @submit.prevent="login">
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input v-model="loginForm.email" type="email" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Mot de passe</label>
                    <input v-model="loginForm.password" type="password" class="form-control" required>
                </div>
                <div class="text-end">
                    <button type="button" @click="showLoginModal = false" class="btn btn-secondary me-2">
                        Annuler
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-box-arrow-in-right me-2"></i>Se connecter
                    </button>
                </div>
            </form>
        </el-dialog>

        <!-- Liste des biens -->
        <section class="pt-0">
            <div class="container">
                <div class="row g-4">
                    <div v-if="biensImmobiliers.length === 0" class="text-center text-muted my-5">
                        Aucun bien immobilier trouvé.
                    </div>

                    <!-- Card item -->
                    <div v-else class="col-md-6 col-xl-4" v-for="(biens, index) in biensImmobiliers" :key="index">
                        <div class="card card-img-scale shadow p-2 pb-0 h-100">
                            <div class="card-img-scale-wrapper rounded-3">
                                <!-- Badge statut -->
                                <div class="position-absolute top-0 start-0 z-index-1 m-4">
                                    <div class="badge text-white" :class="{
                                        'bg-success': biens.status == true,
                                        'bg-danger': biens.status == false
                                    }">
                                        {{ biens.status == true ? 'Disponible' : 'Non disponible' }}
                                    </div>
                                </div>

                                <!-- NOUVEAUTÉ: Bouton favori -->
                                <div class="position-absolute top-0 end-0 z-index-1 m-4">
                                    <button @click="toggleFavorite(biens.id)"
                                        class="btn btn-sm btn-light rounded-circle p-2"
                                        :title="isFavorite(biens.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'">
                                        <i class="bi"
                                            :class="isFavorite(biens.id) ? 'bi-heart-fill text-danger' : 'bi-heart'"></i>
                                    </button>
                                </div>

                                <!-- Image -->
                                <img :src="getImageUrl(biens.fichier?.id)" class="card-img" alt="bien image">

                                <!-- Badge localisation -->
                                <div class="position-absolute bottom-0 start-0 p-3 d-flex align-items-center gap-2">
                                    <div class="badge text-bg-dark fs-6 rounded-pill" @click="onClickGeo(biens)"
                                        style="cursor: pointer;">
                                        <i class="bi bi-geo-alt me-2"
                                            :class="{ 'pulse-animation text-success': biens.status == true }"></i>
                                        {{ biens.commune.libelle }}
                                    </div>
                                </div>

                                <!-- NOUVEAUTÉ: Bouton 360 -->
                                <div v-if="biens.url360" class="position-absolute bottom-0 end-0 p-3">
                                    <button @click="show360View(biens)"
                                        class="btn btn-sm btn-primary rounded-circle p-2" title="Vue 360°">
                                        <i class="bi bi-badge-vr"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Card body -->
                            <div class="card-body px-3 pb-0">
                                <div class="d-flex justify-content-between mb-3">
                                    <a href="#" class="badge bg-dark text-white">
                                        <i class="bi fa-fw bi-star-fill me-2 text-warning"></i>
                                        {{ Math.floor(biens.note) }}
                                    </a>
                                    <button class="btn p-0 border-0 bg-transparent" @click="ouvrirNotation(biens)">
                                        <i class="bi fa-fw bi-bookmark h6 mb-0 z-index-2"></i>
                                    </button>
                                </div>

                                <h5 class="card-title">
                                    <a href="#">{{ biens.nom }}</a>
                                </h5>

                                <ul class="nav nav-divider mb-2 mb-sm-3">
                                    <li class="nav-item">{{ biens.typeBiensImmobiliere.nomTypeBiensImmo }}</li>
                                    <li class="nav-item">
                                        pièce{{ biens.detailsBiensImmobiliers.nombre > 1 ? 's' : '' }}:
                                        {{ biens.detailsBiensImmobiliers.nombre }}
                                    </li>
                                </ul>
                            </div>

                            <!-- Card footer -->
                            <div class="card-footer pt-0">
                                <div class="d-sm-flex justify-content-sm-between align-items-center">
                                    <div class="d-flex align-items-center">
                                        <div>
                                            <h5 class="fw-normal text-success mb-0 me-1">
                                                {{ formatCurrency(biens.prix) }}
                                            </h5>
                                            <!-- NOUVEAUTÉ: Prix converti -->
                                            <div v-if="biens.convertedPrice && currentCurrency === 'USD'"
                                                class="text-muted" style="font-size: 0.9rem;">
                                                (≈ ${{ biens.convertedPrice }})
                                            </div>
                                        </div>
                                        <span class="mb-0 me-2" style="text-transform: capitalize;">
                                            /{{ capitalize(biens.typeUnite) }}
                                        </span>
                                    </div>
                                    <div class="mt-2 mt-sm-0 z-index-2">
                                        <router-link :to="{ name: 'DirectoryDetails', params: { id: biens.id } }"
                                            class="btn btn-sm btn-primary-soft mb-0 w-100">
                                            Détails<i class="bi bi-arrow-right ms-2"></i>
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="showPagination()" class="row">
                    <div class="col-12">
                        <nav class="mt-4 d-flex justify-content-center" aria-label="navigation">
                            <ul class="pagination pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                                <li class="page-item mb-0" :class="{ disabled: currentPage === 1 }">
                                    <a class="page-link" href="#" @click.prevent="prevPage" tabindex="-1">
                                        <i class="fa-solid fa-angle-left"></i>
                                    </a>
                                </li>
                                <li class="page-item mb-0" v-for="(page, index) in getPaginationRange()" :key="index"
                                    :class="{ active: currentPage === page, disabled: page === '...' }">
                                    <a class="page-link" @click.prevent="goToPage(page)" href="#" v-if="page !== '...'">
                                        {{ page }}
                                    </a>
                                    <span v-else class="page-link">...</span>
                                </li>
                                <li class="page-item mb-0" :class="{ disabled: currentPage === totalPages }">
                                    <a class="page-link" href="#" @click.prevent="nextPage">
                                        <i class="fa-solid fa-angle-right"></i>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </section>

        <!-- Bouton contact flottant -->
        <button @click="showContactModal = true"
            class="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4"
            style="width: 60px; height: 60px; z-index: 1000;" title="Nous contacter">
            <i class="bi bi-chat-dots fs-4"></i>
        </button>

        <!-- Reste du contenu (slider, about, etc.) -->
        <section class="pt-0 pt-md-8">
            <div class="container">
                <div class="row g-4 align-items-center">
                    <div class="col-lg-12">
                        <div class="tiny-slider arrow-round arrow-blur arrow-hover">
                            <div class="tiny-slider-inner" v-if="items && items.length" ref="slider"
                                data-autoplay="true" data-arrow="true" data-edge="2" data-dots="false" data-items-xl="1"
                                data-items-lg="2" data-items-md="1">
                                <div v-for="(item, index) in items" :key="item.id" class="slider-item">
                                    <div class="card wide-card border rounded-3 overflow-hidden h-50">
                                        <div class="d-flex flex-column flex-sm-row h-50">
                                            <div class="w-100 w-sm-50" style="height: 200px;">
                                                <img class="w-100 h-100 object-fit-cover"
                                                    :src="item.image || '@/assets/images/placeholder.png'"
                                                    :alt="item.title">
                                            </div>
                                            <div class="col-sm-6">
                                                <div class="card-body px-3">
                                                    <h6 class="card-title">
                                                        <a href="offer-detail.html" class="stretched-link">
                                                            {{ item.title }}
                                                        </a>
                                                    </h6>
                                                    <p class="mb-0">{{ item.validate }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- About Section (inchangée) -->
        <section class="py-0 py-lg-7">
            <div class="container">
                <div class="row mb-4">
                    <div class="col-12">
                        <h2>Nous simplifions la gestion de vos biens immobiliers.</h2>
                        <p class="mb-0">Vous aider à gagner du temps, à maximiser vos revenus, et à garder l'esprit
                            serein face aux imprévus du quotidien.</p>
                        <p class="mb-0">Toujours là pour vous, avec réactivité et efficacité.</p>
                    </div>
                </div>

                <div class="row g-4">
                    <div class="col-xl-4">
                        <div
                            class="card card-body bg-primary bg-opacity-10 vstack gap-4 justify-content-center h-100 p-4">
                            <div class="d-flex justify-content-between align-items-center">
                                <h3 class="purecounter text-primary mb-0" data-purecounter-start="0"
                                    data-purecounter-end="10" data-purecounter-delay="200">0</h3>
                                <h6 class="fw-normal mb-0">Biens immobiliers enregistrés</h6>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex justify-content-center me-3">
                                    <h3 class="purecounter text-primary mb-0" data-purecounter-start="0"
                                        data-purecounter-end="200" data-purecounter-delay="300">0</h3>
                                    <span class="h3 text-primary mb-0">+</span>
                                </div>
                                <h6 class="fw-normal mb-0">Personnel associé</h6>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex justify-content-center me-3">
                                    <h3 class="purecounter text-primary mb-0" data-purecounter-start="0"
                                        data-purecounter-end="50" data-purecounter-delay="300">0</h3>
                                    <span class="h3 text-primary mb-0">+</span>
                                </div>
                                <h6 class="fw-normal mb-0">Services intelligents activés</h6>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 col-xl-4">
                        <div class="card overflow-hidden">
                            <img src="../assets/images/about/07.jpg" class="rounded-3" alt="">
                            <div class="w-100 h-100">
                                <button class="btn btn-dark position-absolute top-50 start-50 translate-middle mb-0"
                                    data-bs-toggle="modal" data-bs-target="#map360">
                                    <i class="bi bi-eye me-2"></i>View 360
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 col-xl-4">
                        <ul class="list-group list-group-borderless">
                            <li class="list-group-item py-3">
                                <h6 class="mb-0 fw-normal">
                                    <i class="bi bi-cash-coin fa-fw text-info me-2"></i>Meilleur tarif garanti
                                </h6>
                            </li>
                            <li class="list-group-item py-3">
                                <h6 class="mb-0 fw-normal">
                                    <i class="bi bi-credit-card-2-back fa-fw text-warning me-2"></i>Paiement flexible
                                </h6>
                            </li>
                            <li class="list-group-item py-3">
                                <h6 class="mb-0 fw-normal">
                                    <i class="bi bi-wallet fa-fw text-success me-2"></i>Récompenses pour les
                                    utilisateurs fidèles
                                </h6>
                            </li>
                            <li class="list-group-item py-3">
                                <h6 class="mb-0 fw-normal">
                                    <i class="bi bi-wifi fa-fw text-danger me-2"></i>Sécurité & transparence totales
                                </h6>
                            </li>
                            <li class="list-group-item pt-3 pb-0">
                                <h6 class="mb-0 fw-normal">
                                    <i class="bi bi-tags fa-fw text-orange me-2"></i>Zéro frais cachés, zéro surprise
                                </h6>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <SuggestionBox />
    </main>
</template>

<script>
import { tns } from 'tiny-slider';
import { ElMessage, ElMessageBox } from "element-plus";
import SuggestionBox from '@/components/card/SuggestionBox.vue';
import { API_URLS } from "@/config/api";
import { useLoading } from "vue-loading-overlay";
import L from 'leaflet';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass.js';
import 'leaflet/dist/leaflet.css';

let scene, camera, renderer, controls, composer;
let mapInstance = null;

export default {
    name: 'DirectoryListing',
    components: { SuggestionBox },

    props: {
        sliderMode: { type: String, default: 'carousel' },
        sliderAxis: { type: String, default: 'horizontal' },
        sliderSpace: { type: Number, default: 10 },
        sliderEdge: { type: Number, default: 0 },
        sliderSpeed: { type: Number, default: 300 },
        sliderAutoPlay: { type: Boolean, default: true },
        sliderAutoPlayTime: { type: Number, default: 3000 },
        sliderHoverPause: { type: Boolean, default: true },
        sliderArrow: { type: Boolean, default: true },
        sliderDots: { type: Boolean, default: false },
        sliderLoop: { type: Boolean, default: true },
        sliderRewind: { type: Boolean, default: false },
        sliderAutoHeight: { type: Boolean, default: false },
        sliderAutoWidth: { type: Boolean, default: false },
        sliderfixedWidth: { type: Number, default: 0 },
        sliderTouch: { type: Boolean, default: true },
        sliderDrag: { type: Boolean, default: true },
        sliderItems: { type: Number, default: 3 },
        sliderDirection: { type: String, default: 'ltr' },
        sliderNavContainer: { type: String, default: null },
        sliderItemsXs: { type: Number, default: 1 },
        sliderItemsSm: { type: Number, default: 2 },
        sliderItemsMd: { type: Number, default: 2 },
        sliderItemsLg: { type: Number, default: 3 },
        sliderItemsXl: { type: Number, default: 4 },
    },

    data() {
        return {
            // Données existantes
            items: [
                {
                    image: new URL('../assets/images/offer/01.jpg', import.meta.url).href,
                    title: "Daily 50 Lucky Winners get a Free Stay",
                    validate: "Valid till: 15 Nov",
                },
                {
                    image: new URL('../assets/images/offer/04.jpg', import.meta.url).href,
                    title: "Up to 60% OFF",
                    validate: "On Hotel Bookings Online",
                },
                {
                    image: new URL('../assets/images/offer/03.jpg', import.meta.url).href,
                    title: "Book & Enjoy",
                    validate: "20% Off on the best available room rate",
                },
                {
                    image: new URL('../assets/images/offer/02.jpg', import.meta.url).href,
                    title: "Hot Summer Nights",
                    validate: "Up to 3 nights free!",
                },
            ],
            services: [],
            biensImmobiliers: [],
            currentPage: 1,
            perPage: 15,
            totalPages: 0,
            currentTab: null,

            // Filtres de recherche COMPLÉTÉS
            searchFilters: {
                globalSearch: '',
                commune: '',
                type: '',
                dateDebut: '',
                dateFin: '',
                occupants: 0,
                minPrice: '',
                maxPrice: '',
                status: null
            },

            // NOUVEAUTÉ: État des modals
            showGeoModal: false,
            notationVisible: false,
            show360Modal: false,
            showContactModal: false,
            showLoginModal: false,
            showAdvancedFilters: false,

            // NOUVEAUTÉ: Sélections et états temporaires
            selectedLat: null,
            selectedLng: null,
            bienSelectionne: null,
            noteTemp: 0,
            hoverRating: 0,
            selected360Url: '',

            // NOUVEAUTÉ: Authentification
            isAuthenticated: false,
            user: null,
            loginForm: {
                email: '',
                password: ''
            },

            // NOUVEAUTÉ: Favoris
            favorites: [],

            // NOUVEAUTÉ: Conversion de devises
            currentCurrency: 'XOF',
            exchangeRates: {
                USD: 0.0016,
                EUR: 0.0015
            },

            // Formulaire de contact
            form: {
                nom: "",
                email: "",
                telephone: "",
                message: "",
            },

            errorMessage: null,
            searchDebounceTimer: null,
        };
    },

    computed: {
        totalBiens() {
            return this.$store.getters['biensImmobiliers/totalBiens'];
        }
    },

    watch: {
        currentTab() {
            this.currentPage = 1;
            this.searchBiens();
        },

        // NOUVEAUTÉ: Watch pour la modal géo
        showGeoModal(visible) {
            if (visible) {
                this.$nextTick(() => {
                    this.initMap();
                });
            }
        }
    },

    mounted() {
        this.$nextTick(() => {
            const images = Array.from(this.$refs.slider?.querySelectorAll('img') || []);
            Promise.all(images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => img.onload = resolve);
            })).then(() => {
                this.initTinySlider();
            });
            this.initThreeBackground();
        });

        this.initNavigationButtons();
        this.currentPage = 1;

        // Charger les favoris depuis localStorage
        this.loadFavoritesFromStorage();

        // Charger les services puis les biens
        this.loadService().then(() => {
            if (this.services && this.services.length > 0) {
                this.currentTab = this.services[0].id;
            }
            this.loadBiensImmobiliers();
        });
    },

    beforeDestroy() {
        // Nettoyage
        if (mapInstance) {
            mapInstance.remove();
            mapInstance = null;
        }
        if (this.searchDebounceTimer) {
            clearTimeout(this.searchDebounceTimer);
        }
    },

    methods: {
        // ========== MÉTHODES EXISTANTES ==========

        initTinySlider() {
            if (!this.$refs.slider) return;

            const tnsSlider = tns({
                container: this.$refs.slider,
                mode: this.sliderMode,
                axis: this.sliderAxis,
                gutter: this.sliderSpace,
                edgePadding: this.sliderEdge,
                speed: this.sliderSpeed,
                autoWidth: this.sliderAutoWidth,
                controls: this.sliderArrow,
                nav: this.sliderDots,
                autoplay: this.sliderAutoPlay,
                autoplayTimeout: this.sliderAutoPlayTime,
                autoplayHoverPause: this.sliderHoverPause,
                autoplayButton: false,
                autoplayButtonOutput: false,
                controlsPosition: 'top',
                navContainer: this.sliderNavContainer,
                navPosition: 'top',
                autoplayPosition: 'top',
                controlsText: [
                    '<i class="bi bi-arrow-left"></i>',
                    '<i class="bi bi-arrow-right"></i>',
                ],
                loop: this.sliderLoop,
                rewind: this.sliderRewind,
                autoHeight: this.sliderAutoHeight,
                fixedWidth: this.sliderfixedWidth,
                touch: this.sliderTouch,
                mouseDrag: this.sliderDrag,
                arrowKeys: true,
                items: this.sliderItems,
                textDirection: this.sliderDirection,
                responsive: {
                    0: { items: this.sliderItemsXs },
                    576: { items: this.sliderItemsSm },
                    768: { items: this.sliderItemsMd },
                    992: { items: this.sliderItemsLg },
                    1200: { items: this.sliderItemsXl },
                },
            });
        },

        formatCurrency(value) {
            if (!value) return '—';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: this.currentCurrency,
                minimumFractionDigits: 0,
            }).format(value);
        },

        capitalize(value) {
            if (!value) return '';
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        },

        async loadService() {
            try {
                const response = await this.$store.dispatch('typeBiens/getAll');
                this.services = response;
            } catch (error) {
                console.error('Erreur lors du chargement des services :', error);
                this.errorMessage = "Désolé, un problème est survenu lors du chargement des services.";
            }
        },

        async loadBiensImmobiliers() {
            const loader = this.$loading.show();
            try {
                const response = await this.$store.dispatch('biensImmobiliers/getAll', {
                    page: this.currentPage - 1,
                    size: this.perPage
                });

                this.currentPage = (response.number || 0) + 1;
                this.biensImmobiliers = response.content || [];
                this.totalPages = response.totalPages || 0;

                // Convertir les prix si nécessaire
                if (this.currentCurrency !== 'XOF') {
                    await this.convertAllPrices(this.currentCurrency);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des biens :', error);
                this.errorMessage = "Désolé, un problème est survenu lors du chargement des biens.";
                this.biensImmobiliers = [];
            } finally {
                loader.hide();
            }
        },

        getImageUrl(idfile) {
            return `${API_URLS.API_BASE}/fichier/download/${idfile}`;
        },

        // ========== NOUVEAUTÉS: RECHERCHE AVANCÉE ==========

        debouncedSearch() {
            if (this.searchDebounceTimer) {
                clearTimeout(this.searchDebounceTimer);
            }
            this.searchDebounceTimer = setTimeout(() => {
                this.searchBiens();
            }, 500);
        },

        async searchBiens() {
            const texte = this.searchFilters.globalSearch.trim();
            const type = this.currentTab;

            const loader = this.$loading.show();
            try {
                if (texte.length > 2 || type) {
                    const data = await this.$store.dispatch('biensImmobiliers/searchBiens', {
                        texte,
                        type
                    });
                    this.biensImmobiliers = data;
                    this.totalPages = 1;
                    this.currentPage = 1;
                } else if (!texte && !type) {
                    this.currentPage = 1;
                    await this.loadBiensImmobiliers();
                }
            } catch (error) {
                this.errorMessage = "Erreur lors de la recherche.";
                this.biensImmobiliers = [];
            } finally {
                loader.hide();
            }
        },

        async applyAdvancedFilters() {
            const loader = this.$loading.show();
            try {
                const filters = {
                    texte: this.searchFilters.globalSearch,
                    type: this.currentTab,
                    commune: this.searchFilters.commune,
                    status: this.searchFilters.status,
                    minPrice: this.searchFilters.minPrice,
                    maxPrice: this.searchFilters.maxPrice,
                    dateDebut: this.searchFilters.dateDebut,
                    dateFin: this.searchFilters.dateFin,
                    occupants: this.searchFilters.occupants
                };

                // Appel API avec filtres complets
                const data = await this.$store.dispatch('biensImmobiliers/searchWithFilters', filters);
                this.biensImmobiliers = data;
                this.totalPages = 1;
                this.currentPage = 1;
                this.showAdvancedFilters = false;

                ElMessage.success('Filtres appliqués avec succès');
            } catch (error) {
                ElMessage.error('Erreur lors de l\'application des filtres');
            } finally {
                loader.hide();
            }
        },

        resetFilters() {
            this.searchFilters = {
                globalSearch: '',
                commune: '',
                type: '',
                dateDebut: '',
                dateFin: '',
                occupants: 0,
                minPrice: '',
                maxPrice: '',
                status: null
            };
            this.currentPage = 1;
            this.loadBiensImmobiliers();
            ElMessage.info('Filtres réinitialisés');
        },

        showPagination() {
            return !this.searchFilters.globalSearch.trim();
        },

        // ========== NOUVEAUTÉS: CONVERSION DE DEVISES ==========

        async convertCurrency(amount, fromCurrency, toCurrency) {
            if (!amount) return null;
            if (fromCurrency === toCurrency) return amount;

            try {
                const url = `https://v6.exchangerate-api.com/v6/aea6e2851889287522f072cb/latest/${fromCurrency}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.result !== "success") {
                    throw new Error('Erreur API de conversion');
                }

                const rate = data.conversion_rates[toCurrency];
                if (!rate) throw new Error(`Taux pour ${toCurrency} non trouvé`);

                return (amount * rate).toFixed(2);
            } catch (error) {
                console.error('Erreur conversion devise:', error);
                // Fallback sur taux approximatif
                const rate = this.exchangeRates[toCurrency] || 1;
                return (amount * rate).toFixed(2);
            }
        },

        async updateConvertedPrice(bien, fromCurrency = 'XOF', toCurrency = 'USD') {
            const converted = await this.convertCurrency(bien.prix, fromCurrency, toCurrency);
            if (converted) {
                this.$set(bien, 'convertedPrice', converted);
            } else {
                this.$set(bien, 'convertedPrice', null);
            }
        },

        async convertAllPrices(toCurrency) {
            const fromCurrency = 'XOF';
            await Promise.all(
                this.biensImmobiliers.map(bien =>
                    this.updateConvertedPrice(bien, fromCurrency, toCurrency)
                )
            );
        },

        async toggleCurrency() {
            const loader = this.$loading.show();
            try {
                const newCurrency = this.currentCurrency === 'XOF' ? 'USD' : 'XOF';
                this.currentCurrency = newCurrency;

                if (newCurrency !== 'XOF') {
                    await this.convertAllPrices(newCurrency);
                }

                ElMessage.success(`Devise changée en ${newCurrency}`);
            } catch (error) {
                ElMessage.error('Erreur lors du changement de devise');
            } finally {
                loader.hide();
            }
        },

        // ========== NOUVEAUTÉS: SYSTÈME DE NOTATION ==========

        ouvrirNotation(bien) {
            if (!this.isAuthenticated) {
                ElMessage.warning('Veuillez vous connecter pour noter ce bien');
                this.showLoginModal = true;
                return;
            }
            this.bienSelectionne = bien;
            this.noteTemp = bien.note || 0;
            this.notationVisible = true;
        },

        async envoyerNote() {
            if (!this.bienSelectionne) return;

            const loader = this.$loading.show();
            try {
                await this.$store.dispatch('biensImmobiliers/noterBien', {
                    id: this.bienSelectionne.id,
                    note: this.noteTemp,
                });

                // Mettre à jour la note localement
                const index = this.biensImmobiliers.findIndex(b => b.id === this.bienSelectionne.id);
                if (index !== -1) {
                    this.$set(this.biensImmobiliers[index], 'note', this.noteTemp);
                }

                ElMessage.success("Merci pour votre note !");
                this.notationVisible = false;
                this.noteTemp = 0;
                this.hoverRating = 0;
            } catch (error) {
                ElMessage.error("Erreur lors de l'envoi de la note.");
            } finally {
                loader.hide();
            }
        },

        // ========== NOUVEAUTÉS: SYSTÈME DE FAVORIS ==========

        toggleFavorite(bienId) {
            if (!this.isAuthenticated) {
                ElMessage.warning('Veuillez vous connecter pour gérer vos favoris');
                this.showLoginModal = true;
                return;
            }

            const index = this.favorites.indexOf(bienId);
            if (index > -1) {
                this.favorites.splice(index, 1);
                ElMessage.info('Retiré des favoris');
            } else {
                this.favorites.push(bienId);
                ElMessage.success('Ajouté aux favoris');
            }

            // Sauvegarder dans localStorage
            this.saveFavoritesToStorage();
        },

        isFavorite(bienId) {
            return this.favorites.includes(bienId);
        },

        showFavorites() {
            const favoritesBiens = this.biensImmobiliers.filter(b => this.isFavorite(b.id));

            if (favoritesBiens.length === 0) {
                ElMessage.info('Vous n\'avez aucun favori pour le moment');
                return;
            }

            const message = favoritesBiens.map(b => b.nom).join('<br>');
            ElMessageBox.alert(
                `<div>${message}</div>`,
                `Mes ${favoritesBiens.length} favoris`,
                {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: 'OK'
                }
            );
        },

        saveFavoritesToStorage() {
            try {
                localStorage.setItem('immobilier_favorites', JSON.stringify(this.favorites));
            } catch (error) {
                console.error('Erreur sauvegarde favoris:', error);
            }
        },

        loadFavoritesFromStorage() {
            try {
                const stored = localStorage.getItem('immobilier_favorites');
                if (stored) {
                    this.favorites = JSON.parse(stored);
                }
            } catch (error) {
                console.error('Erreur chargement favoris:', error);
                this.favorites = [];
            }
        },

        // ========== NOUVEAUTÉS: AUTHENTIFICATION ==========

        async login() {
            const loader = this.$loading.show();
            try {
                // Simulation - Remplacer par vraie API
                if (this.loginForm.email && this.loginForm.password) {
                    // await this.$store.dispatch('auth/login', this.loginForm);

                    this.isAuthenticated = true;
                    this.user = {
                        nom: 'Utilisateur',
                        email: this.loginForm.email
                    };

                    ElMessage.success('Connexion réussie !');
                    this.showLoginModal = false;
                    this.loginForm = { email: '', password: '' };
                } else {
                    ElMessage.error('Veuillez remplir tous les champs');
                }
            } catch (error) {
                ElMessage.error('Erreur de connexion');
            } finally {
                loader.hide();
            }
        },

        logout() {
            ElMessageBox.confirm(
                'Êtes-vous sûr de vouloir vous déconnecter ?',
                'Déconnexion',
                {
                    confirmButtonText: 'Oui',
                    cancelButtonText: 'Non',
                    type: 'warning'
                }
            ).then(() => {
                this.isAuthenticated = false;
                this.user = null;
                this.favorites = [];
                localStorage.removeItem('immobilier_favorites');
                ElMessage.success('Déconnexion réussie');
            }).catch(() => { });
        },

        // ========== NOUVEAUTÉS: GÉOLOCALISATION ==========

        onClickGeo(bien) {
            this.selectedLat = bien.latitude;
            this.selectedLng = bien.longitude;
            this.bienSelectionne = bien;
            this.showGeoModal = true;
        },

        initMap() {
            if (mapInstance) {
                mapInstance.remove();
                mapInstance = null;
            }

            mapInstance = L.map('map', {
                center: [this.selectedLat, this.selectedLng],
                zoom: 15,
                zoomControl: true,
                attributionControl: true,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(mapInstance);

            L.marker([this.selectedLat, this.selectedLng])
                .addTo(mapInstance)
                .bindPopup(this.bienSelectionne?.nom || 'Localisation du bien')
                .openPopup();

            this.loadNearbyPOI(this.selectedLat, this.selectedLng);

            setTimeout(() => {
                mapInstance.invalidateSize();
            }, 100);
        },

        async loadNearbyPOI(lat, lng) {
            const delta = 0.01;
            const query = `
                [out:json];
                (
                  node["amenity"="school"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
                  node["amenity"="restaurant"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
                  node["amenity"="hospital"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
                );
                out;
            `;
            const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                data.elements.forEach(el => {
                    L.marker([el.lat, el.lon])
                        .addTo(mapInstance)
                        .bindPopup(el.tags.name || el.tags.amenity);
                });
            } catch (error) {
                console.error("Erreur chargement POIs:", error);
            }
        },

        // ========== NOUVEAUTÉS: VUE 360 ==========

        show360View(bien) {
            if (bien.url360) {
                this.selected360Url = bien.url360;
                this.show360Modal = true;
            } else {
                ElMessage.warning('Vue 360° non disponible pour ce bien');
            }
        },

        // ========== NOUVEAUTÉS: FORMULAIRE DE CONTACT ==========

        async sendMessage() {
            const loader = this.$loading.show();
            try {
                const payload = {
                    nom: this.form.nom,
                    email: this.form.email,
                    telephone: this.form.telephone,
                    message: this.form.message,
                };

                await this.$store.dispatch('contact/send', payload);

                ElMessage.success('Message envoyé avec succès !');
                this.showContactModal = false;
                this.form = {
                    nom: "",
                    email: "",
                    telephone: "",
                    message: "",
                };
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message:', error);
                ElMessage.error('Erreur lors de l\'envoi du message');
            } finally {
                loader.hide();
            }
        },

        // ========== PAGINATION ==========

        goToPage(page) {
            if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.loadBiensImmobiliers();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.loadBiensImmobiliers();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadBiensImmobiliers();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        getPaginationRange() {
            const total = this.totalPages;
            const current = this.currentPage;
            const delta = 1;
            const range = [];
            const rangeWithDots = [];
            let l;

            for (let i = 1; i <= total; i++) {
                if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
                    range.push(i);
                }
            }

            for (let i of range) {
                if (l) {
                    if (i - l === 2) {
                        rangeWithDots.push(l + 1);
                    } else if (i - l !== 1) {
                        rangeWithDots.push('...');
                    }
                }
                rangeWithDots.push(i);
                l = i;
            }

            return rangeWithDots;
        },

        // ========== THREE.JS ==========

        initThreeBackground() {
            const container = document.getElementById('three-container');
            if (!container) return;

            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(
                75,
                container.clientWidth / container.clientHeight,
                0.1,
                1000
            );
            camera.position.set(5, 3, 10);
            camera.lookAt(0, 1.6, 0);

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);

            const light = new THREE.DirectionalLight(0xffffff, 1.5);
            light.position.set(10, 10, 10);
            scene.add(light);
            scene.add(new THREE.AmbientLight(0xffffff, 1));

            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.autoRotate = false;
            controls.enablePan = true;
            controls.enableZoom = true;
            controls.autoRotateSpeed = 0.5;

            const loader = new THREE.CubeTextureLoader();
            const texture = loader.load([
                '/textures/skybox/px_light.jpg',
                '/textures/skybox/nx_light.jpg',
                '/textures/skybox/py_light.jpg',
                '/textures/skybox/ny_light.jpg',
                '/textures/skybox/pz_light.jpg',
                '/textures/skybox/nz_light.jpg'
            ]);
            scene.background = texture;

            const gltfLoader = new GLTFLoader();
            gltfLoader.load('/models/screen_space_reflection_demo_follmann_2.og.glb', (gltf) => {
                const building = gltf.scene;
                building.traverse((child) => {
                    if (child.isMesh) {
                        child.material.side = THREE.DoubleSide;
                    }
                });
                building.scale.set(1.5, 1.5, 1.5);
                building.position.y = -1;
                scene.add(building);
            });

            composer = new EffectComposer(renderer);
            const renderPass = new RenderPass(scene, camera);
            composer.addPass(renderPass);

            const ssrPass = new SSRPass({
                renderer,
                scene,
                camera,
                width: container.clientWidth,
                height: container.clientHeight,
                groundReflector: null,
                selects: [],
            });
            composer.addPass(ssrPass);

            let needsRender = true;
            controls.addEventListener('change', () => {
                needsRender = true;
            });

            const clock = new THREE.Clock();
            const animate = () => {
                requestAnimationFrame(animate);
                const delta = clock.getDelta();
                controls.update(delta);
                if (needsRender) {
                    composer.render();
                    needsRender = false;
                }
            };
            animate();

            window.addEventListener('resize', () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
                composer.setSize(container.clientWidth, container.clientHeight);
            });
        },

        initNavigationButtons() {
            window.moveForward = () => {
                camera.position.add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(0.5));
            };
            window.moveBackward = () => {
                camera.position.add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-0.5));
            };
            window.turnLeft = () => { camera.rotation.y += 0.1; };
            window.turnRight = () => { camera.rotation.y -= 0.1; };
            window.goOutside = () => { camera.position.set(0, 2, 5); };
            window.goInside = () => { camera.position.set(0, 1.6, 0); };
        },
    },
};
</script>

<style scoped>
.style_img_pro {
    width: 100%;
    height: 50em;
    position: relative;
    background-size: cover;
}

.three-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
    background-color: #ffffff !important;
}

#controls {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 10;
}

#controls button {
    padding: 8px 12px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.wide-card {
    min-width: 250px;
    max-height: 150px;
    max-width: 100%;
}

.pulse-animation {
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 0.8;
    }

    50% {
        transform: scale(1.3);
        opacity: 1;
    }

    100% {
        transform: scale(1);
        opacity: 0.8;
    }
}

#map {
    height: 400px;
    width: 100%;
    max-height: 60vh;
    border-radius: 10px;
    z-index: 1;
}

.leaflet-container-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.leaflet-container-map {
    width: 100%;
    height: 100%;
    min-height: 400px;
}

.bg-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
}

.card-img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 0.5rem;
}

.card {
    display: flex;
    flex-direction: column;
    height: 400px;
}

.card-img-scale-wrapper {
    flex-shrink: 0;
    position: relative;
}

.card-body {
    flex-grow: 1;
    overflow: hidden;
}

.card-footer {
    margin-top: auto;
    padding: 10px;
}

/* Styles pour les étoiles de notation */
.rating-stars i {
    cursor: pointer;
    transition: all 0.2s ease;
}

.rating-stars i:hover {
    transform: scale(1.2);
}

/* Animation pour bouton contact flottant */
@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

button[title="Nous contacter"] {
    animation: float 3s ease-in-out infinite;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

button[title="Nous contacter"]:hover {
    animation: none;
    transform: scale(1.1);
}

/* Styles pour les filtres avancés */
.form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #495057;
}

/* Badge personnalisé */
.badge {
    font-weight: 500;
    padding: 0.5rem 1rem;
}

/* Responsive */
@media (max-width: 768px) {
    .style_img_pro {
        height: 30em;
    }

    .card {
        height: auto;
        min-height: 350px;
    }

    #map {
        height: 300px;
    }
}

/* Amélioration de l'accessibilité */
button:focus,
a:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
}

/* Loading overlay custom */
.vld-overlay .vld-background {
    background: rgba(255, 255, 255, 0.9);
}

/* Transition douce pour les cartes */
.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Style pour le texte converti */
.text-muted {
    font-size: 0.85rem;
}

/* Animation pour favoris */
.bi-heart-fill {
    animation: heartBeat 0.5s ease;
}

@keyframes heartBeat {

    0%,
    100% {
        transform: scale(1);
    }

    25% {
        transform: scale(1.3);
    }

    50% {
        transform: scale(1.1);
    }
}
</style>