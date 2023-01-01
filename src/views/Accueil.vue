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
                </div> <!-- Row END -->
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
                    <!-- Tabs END -->

                    <!-- Tab content START -->
                    <div class="col-12">
                        <div class="tab-content" id="nav-tabContent">

                            <!-- Tab content item START -->
                            <div class="tab-pane fade show active" v-for="(item, index) in services" :key="index"
                                v-show="currentTab === item.id">
                                <form class="card shadow p-0">
                                    <!-- Card header -->
                                    <div class="card-header p-4">
                                        <h5 class="mb-0"><i class="fa-solid fa-hotel fa-fw me-2"></i>{{
                                            item.nomTypeBiensImmo }}</h5>
                                    </div>

                                    <!-- Card body -->
                                    <div class="card-body p-4 pt-0">
                                        <div class="row g-4">
                                            <!-- Location -->
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

                                        </div> <!-- Row END -->
                                    </div>
                                </form>
                            </div>
                            <!-- Tab content item END -->

                        </div>
                    </div>
                    <!-- Tab content END -->
                </div>
            </div>
            <!-- Search END -->
        </section>

        <!-- Modal ElDialog -->
        <el-dialog v-model="showGeoModal" title="Localisation du bien" width="80%">
            <div class="leaflet-container-wrapper">
                <div id="map" class="leaflet-container-map"></div>
            </div>
        </el-dialog>

        <el-dialog v-model="show360Modal" title="Vue 360° du bien" width="90%" fullscreen>
            <div class="ratio ratio-16x9" style="height: 80vh;">
                <iframe v-if="selected360Url" :src="selected360Url" allowfullscreen style="border: none;">
                </iframe>
                <div v-else class="d-flex align-items-center justify-content-center bg-light">
                    <p class="text-muted">Vue 360° non disponible pour ce bien</p>
                </div>
            </div>
        </el-dialog>
        <!-- =======================
Main banner START -->
        <!-- Hotel grid START -->
        <section class="pt-0">
            <div class="container">
                <div class="row g-4">

                    <div v-if="biensImmobiliers.length === 0" class="text-center text-muted my-5">
                        Aucun bien immobilier trouvé.
                    </div>
                    <!-- Card item START -->
                    <div v-else class="col-md-6 col-xl-4" v-for="(biens, index) in biensImmobiliers" :key="index">
                        <div class="card card-img-scale shadow p-2 pb-0 h-100">
                            <!-- Image -->
                            <!-- Image and overlay -->
                            <div class="card-img-scale-wrapper rounded-3">
                                <!-- Overlay item -->
                                <div class="position-absolute top-0 start-0 z-index-1 m-4">
                                    <!-- <i class="bi"
                                        :class="biens.status == true ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'"
                                        style="font-size: 1.2rem;"></i> -->
                                    <div class="badge text-white" :class="{
                                        'bg-success': biens.status == true, 'bg-danger': biens.status == false
                                    }">{{ biens.status == true ? 'Disponible' : 'Non disponible' }}</div>
                                </div>
                                <div class="position-absolute top-0 end-0 z-index-1 m-4">
                                    <button @click="toggleFavorite(biens.id)"
                                        class="btn btn-sm btn-light rounded-circle p-2"
                                        :title="isFavorite(biens.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'">
                                        <i class="bi"
                                            :class="isFavorite(biens.id) ? 'bi-heart-fill text-danger' : 'bi-heart'"></i>
                                    </button>
                                </div>
                                <!-- Image -->
                                <img :src="getImageUrl(biens.fichier?.id)" class="card-img" alt="hotel image">
                                <!-- Badge -->
                                <div class="position-absolute bottom-0 start-0 p-3 d-flex align-items-center gap-2">
                                    <div class="badge text-bg-dark fs-6 rounded-pill stretched-link"
                                        @click="onClickGeo(biens)">
                                        <i class="bi bi-geo-alt me-2"
                                            :class="{ 'pulse-animation text-success': biens.status == true }"></i>{{
                                                biens.commune.libelle }}
                                    </div>
                                </div>
                                <div v-if="biens.url360" class="position-absolute bottom-0 end-0 p-3">
                                    <button @click="show360View(biens)"
                                        class="btn btn-sm btn-primary rounded-circle p-2" title="Vue 360°">
                                        <i class="bi bi-badge-vr"></i>
                                    </button>
                                </div>
                            </div>
                            <!-- Card body START -->
                            <div class="card-body px-3 pb-0">
                                <!-- Rating and cart -->
                                <div class="d-flex justify-content-between mb-3">
                                    <a href="hotel-grid.html#" class="badge bg-dark text-white"><i
                                            class="bi fa-fw bi-star-fill me-2 text-warning"></i>{{
                                                Math.floor(biens.note) }} </a>
                                    <!-- Icône de notation -->
                                    <button class="btn p-0 border-0 bg-transparent" @click="ouvrirNotation(biens)">
                                        <i class="bi fa-fw bi-bookmark h6 mb-0 z-index-2"></i>
                                    </button>

                                    <!-- Modal de notation -->
                                    <!-- <el-dialog v-model="notationVisible" title="Noter ce bien" width="30%">
                                        <el-rate v-model="noteTemp" :max="5" show-text></el-rate>

                                        <template #footer>
                                            <span class="dialog-footer">
                                                <el-button @click="notationVisible = false">Annuler</el-button>
                                                <el-button type="primary" @click="envoyerNote">Valider</el-button>
                                            </span>
                                        </template>
</el-dialog> -->

                                </div>

                                <!-- Title -->
                                <h5 class="card-title"><a href="hotel-detail.html">{{ biens.nom }} </a>
                                </h5>

                                <!-- List -->
                                <ul class="nav nav-divider mb-2 mb-sm-3">
                                    <li class="nav-item">{{ biens.typeBiensImmobiliere.nomTypeBiensImmo }} </li>
                                    <li class="nav-item">pièce{{ biens.detailsBiensImmobiliers.nombre > 1 ? 's' : '' }}
                                        : {{ biens.detailsBiensImmobiliers.nombre }}</li>
                                </ul>
                            </div>
                            <!-- Card body END -->

                            <!-- Card footer START-->
                            <div class="card-footer pt-0">
                                <!-- Price and Button -->
                                <div class="d-sm-flex justify-content-sm-between align-items-center">
                                    <!-- Price -->
                                    <div class="d-flex align-items-center">
                                        <div>
                                            <h5 class="fw-normal text-success mb-0 me-1">{{ formatCurrency(biens.prix)
                                                }}</h5>
                                            <div v-if="biens.convertedPrice" class="text-muted"
                                                style="font-size: 0.9rem;">
                                                (~ XOF{{ biens.convertedPrice }})
                                            </div>
                                        </div>
                                        <span class="mb-0 me-2" style="text-transform: capitalize;">/{{
                                            capitalize(biens.typeUnite)
                                            }}</span>
                                    </div>
                                    <!-- Button -->
                                    <div class="mt-2 mt-sm-0 z-index-2">
                                        <router-link :to="{ name: 'DirectoryDetails', params: { id: biens.id } }"
                                            class="btn btn-sm btn-primary-soft mb-0 w-100">Details<i
                                                class="bi bi-arrow-right ms-2"></i></router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Card item END -->

                </div> <!-- Row END -->

                <!-- Pagination -->
                <div v-if="showPagination()" class="row">
                    <div class="col-12">
                        <nav class="mt-4 d-flex justify-content-center" aria-label="navigation">
                            <ul class="pagination pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                                <li class="page-item mb-0" :class="{ disabled: currentPage === 1 }"><a class="page-link"
                                        href="hotel-grid.html#" @click.prevent="prevPage" tabindex="-1"><i
                                            class="fa-solid fa-angle-left"></i></a>
                                </li>
                                <li class="page-item mb-0" v-for="(page, index) in getPaginationRange()" :key="index"
                                    :class="{ active: currentPage === page, disabled: page === '...' }"><a
                                        class="page-link" @click.prevent="goToPage(page)" href="#"
                                        v-if="page !== '...'">{{ page }} </a> <span v-else class="page-link">...</span>
                                </li>
                                <li class="page-item mb-0" :class="{ disabled: currentPage === totalPages }"><a
                                        class="page-link" href="#" @click.prevent="nextPage"><i
                                            class="fa-solid fa-angle-right"></i></a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </section>
        <!-- =======================
Hotel grid END -->

        <!-- =======================
Best deal START -->

        <!-- Remplacez la section "Best deal" par ce code amélioré -->
        <section class="pt-0 pt-md-8">
            <div class="container">
                <!-- En-tête de section -->
                <div class="row mb-4">
                    <div class="col-12 text-center">
                        <h2 class="mb-2">🎉 Offres Spéciales</h2>
                        <p class="lead text-muted">Profitez de nos meilleures offres du moment</p>
                    </div>
                </div>

                <!-- Slider des offres -->
                <div class="row g-4 align-items-center">
                    <div class="col-lg-12">
                        <div v-if="offres && offres.length > 0" class="tiny-slider arrow-round arrow-blur arrow-hover">
                            <div class="tiny-slider-inner" ref="slider" data-autoplay="true" data-arrow="true"
                                data-edge="2" data-dots="false" data-items-xl="3" data-items-lg="2" data-items-md="1">

                                <!-- Carte d'offre -->
                                <div v-for="offre in offres" :key="offre.id" class="slider-item px-2">
                                    <div class="card border rounded-3 overflow-hidden h-100 shadow-sm hover-shadow">
                                        <div class="position-relative">
                                            <!-- Image du bien -->
                                            <img class="card-img-top" style="height: 200px; object-fit: cover;"
                                                :src="getImageUrl(offre.bien?.fichier?.id)" :alt="offre.description">

                                            <!-- Badge type d'offre -->
                                            <div class="position-absolute top-0 start-0 m-3">
                                                <span class="badge bg-danger text-white px-3 py-2">
                                                    <i class="bi bi-tag-fill me-1"></i>
                                                    {{ offre.typeOffre }}
                                                </span>
                                            </div>

                                            <!-- Badge pourcentage de réduction -->
                                            <div v-if="offre.bien && offre.montantReduction"
                                                class="position-absolute top-0 end-0 m-3">
                                                <span class="badge bg-success text-white px-3 py-2 fs-6">
                                                    -{{ getPourcentageReduction(offre.bien.prix, offre.montantReduction)
                                                    }}%
                                                </span>
                                            </div>
                                        </div>

                                        <!-- Corps de la carte -->
                                        <div class="card-body">
                                            <!-- Titre de l'offre -->
                                            <h5 class="card-title mb-2">
                                                <router-link v-if="offre.bien"
                                                    :to="{ name: 'DirectoryDetails', params: { id: offre.bien.id } }"
                                                    class="text-decoration-none text-dark">
                                                    {{ offre.bien.nom }}
                                                </router-link>
                                                <span v-else>{{ offre.description }}</span>
                                            </h5>

                                            <!-- Description de l'offre -->
                                            <p class="text-muted small mb-3">{{ offre.description }}</p>

                                            <!-- Informations sur le bien -->
                                            <div v-if="offre.bien" class="mb-3">
                                                <div class="d-flex align-items-center mb-2">
                                                    <i class="bi bi-geo-alt text-primary me-2"></i>
                                                    <small class="text-muted">{{ offre.bien.commune?.libelle }}</small>
                                                </div>
                                                <div class="d-flex align-items-center">
                                                    <i class="bi bi-house text-primary me-2"></i>
                                                    <small class="text-muted">
                                                        {{ offre.bien.typeBiensImmobiliere?.nomTypeBiensImmo }}
                                                    </small>
                                                </div>
                                            </div>

                                            <!-- Prix -->
                                            <div v-if="offre.bien && offre.montantReduction"
                                                class="d-flex align-items-center justify-content-between mb-3">
                                                <div>
                                                    <div class="text-muted text-decoration-line-through small">
                                                        {{ formatCurrency(offre.bien.prix) }}
                                                    </div>
                                                    <h4 class="text-success mb-0">
                                                        {{ formatCurrency(getPrixAvecReduction(offre.bien,
                                                            offre.montantReduction)) }}
                                                    </h4>
                                                    <small class="text-muted">
                                                        Économisez {{ formatCurrency(offre.montantReduction) }}
                                                    </small>
                                                </div>
                                            </div>

                                            <!-- Date de validité -->
                                            <div class="alert alert-warning py-2 mb-3">
                                                <i class="bi bi-clock me-2"></i>
                                                <small>Valide jusqu'au {{ formatDate(offre.dateFin) }}</small>
                                            </div>

                                            <!-- Bouton d'action -->
                                            <router-link v-if="offre.bien"
                                                :to="{ name: 'DirectoryDetails', params: { id: offre.bien.id } }"
                                                class="btn btn-primary w-100">
                                                <i class="bi bi-eye me-2"></i>Voir l'offre
                                            </router-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Message si pas d'offres -->
                        <div v-else class="text-center py-5">
                            <i class="bi bi-tag fs-1 text-muted mb-3"></i>
                            <p class="text-muted">Aucune offre active pour le moment</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- =======================
Best deal END -->

        <!-- =======================
About START -->
        <!-- Section 360° Interactive START -->
        <section class="py-5 bg-light position-relative overflow-hidden">
            <!-- Fond animé avec particules -->
            <div class="position-absolute top-0 start-0 w-100 h-100 opacity-10">
                <div class="particle-bg"></div>
            </div>

            <div class="container position-relative">
                <!-- En-tête avec animation -->
                <div class="row mb-5">
                    <div class="col-12 text-center">
                        <span class="badge bg-primary bg-opacity-10 text-primary px-4 py-2 mb-3">
                            <i class="bi bi-badge-vr me-2"></i>Technologie Immersive
                        </span>
                        <h2 class="display-5 fw-bold mb-3">
                            Explorez en <span class="text-primary">Réalité Virtuelle</span>
                        </h2>
                        <p class="lead text-muted mb-0">
                            Visitez nos biens comme si vous y étiez grâce à nos visites virtuelles 360°
                        </p>
                    </div>
                </div>

                <!-- Statistiques animées -->
                <div class="row g-4 mb-5">
                    <!-- Stat 1: Total biens -->
                    <div class="col-6 col-md-3">
                        <div class="card border-0 shadow-sm h-100 hover-lift">
                            <div class="card-body text-center py-4">
                                <div class="icon-box bg-primary bg-opacity-10 rounded-circle mx-auto mb-3"
                                    style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                                    <i class="bi bi-buildings text-primary fs-3"></i>
                                </div>
                                <h3 class="counter-value fw-bold text-primary mb-1" :data-target="stats.totalBiens">0
                                </h3>
                                <p class="small text-muted mb-0">Biens disponibles</p>
                            </div>
                        </div>
                    </div>

                    <!-- Stat 2: Biens avec 360 -->
                    <div class="col-6 col-md-3">
                        <div class="card border-0 shadow-sm h-100 hover-lift">
                            <div class="card-body text-center py-4">
                                <div class="icon-box bg-success bg-opacity-10 rounded-circle mx-auto mb-3"
                                    style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                                    <i class="bi bi-badge-vr text-success fs-3"></i>
                                </div>
                                <h3 class="counter-value fw-bold text-success mb-1" :data-target="stats.biensAvec360">0
                                </h3>
                                <p class="small text-muted mb-0">Visites 360° disponibles</p>
                                <div class="progress mt-2" style="height: 4px;">
                                    <div class="progress-bar bg-success" :style="{ width: percentage360 + '%' }"
                                        role="progressbar"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Stat 3: Total vues -->
                    <div class="col-6 col-md-3">
                        <div class="card border-0 shadow-sm h-100 hover-lift">
                            <div class="card-body text-center py-4">
                                <div class="icon-box bg-info bg-opacity-10 rounded-circle mx-auto mb-3"
                                    style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                                    <i class="bi bi-eye text-info fs-3"></i>
                                </div>
                                <h3 class="counter-value fw-bold text-info mb-1" :data-target="stats.vuesTotal">0</h3>
                                <p class="small text-muted mb-0">Visites effectuées</p>
                            </div>
                        </div>
                    </div>

                    <!-- Stat 4: Satisfaction -->
                    <div class="col-6 col-md-3">
                        <div class="card border-0 shadow-sm h-100 hover-lift">
                            <div class="card-body text-center py-4">
                                <div class="icon-box bg-warning bg-opacity-10 rounded-circle mx-auto mb-3"
                                    style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                                    <i class="bi bi-star-fill text-warning fs-3"></i>
                                </div>
                                <h3 class="counter-value fw-bold text-warning mb-1"
                                    :data-target="stats.satisfactionRate">0</h3>
                                <span class="small">%</span>
                                <p class="small text-muted mb-0">Satisfaction client</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Carousel des biens 360 -->
                <div v-if="biensWith360.length > 0" class="row">
                    <div class="col-12">
                        <div class="tiny-slider arrow-round arrow-blur">
                            <div class="tiny-slider-inner" ref="slider360">
                                <!-- Carte bien 360 -->
                                <div v-for="(bien, index) in biensWith360" :key="bien.id" class="px-2">
                                    <div class="card border-0 shadow-sm overflow-hidden hover-360">
                                        <div class="position-relative">
                                            <!-- Image du bien -->
                                            <img :src="getImageUrl(bien.fichier?.id)" class="card-img-top"
                                                style="height: 250px; object-fit: cover;" :alt="bien.nom">

                                            <!-- Overlay avec bouton 360 -->
                                            <div class="overlay-360">
                                                <button @click="open360Fullscreen(bien)"
                                                    class="btn btn-primary btn-lg rounded-circle pulse-360">
                                                    <i class="bi bi-badge-vr fs-3"></i>
                                                </button>
                                                <p class="text-white fw-bold mt-3 mb-0">
                                                    Visite Virtuelle 360°
                                                </p>
                                            </div>

                                            <!-- Badge disponibilité -->
                                            <div class="position-absolute top-0 start-0 m-3">
                                                <span class="badge bg-success">
                                                    <i class="bi bi-check-circle me-1"></i>Disponible
                                                </span>
                                            </div>

                                            <!-- Badge nombre de vues -->
                                            <div class="position-absolute top-0 end-0 m-3">
                                                <span class="badge bg-dark bg-opacity-75">
                                                    <i class="bi bi-eye me-1"></i>{{ bien.nombreVues || 0 }}
                                                </span>
                                            </div>
                                        </div>

                                        <!-- Corps de la carte -->
                                        <div class="card-body">
                                            <div class="d-flex align-items-start mb-2">
                                                <i class="bi bi-geo-alt text-primary me-2 mt-1"></i>
                                                <small class="text-muted">{{ bien.commune?.libelle }}</small>
                                            </div>

                                            <h5 class="card-title mb-2">
                                                <router-link :to="{ name: 'DirectoryDetails', params: { id: bien.id } }"
                                                    class="text-decoration-none text-dark">
                                                    {{ bien.nom }}
                                                </router-link>
                                            </h5>

                                            <p class="small text-muted mb-3">
                                                {{ bien.typeBiensImmobiliere?.nomTypeBiensImmo }}
                                            </p>

                                            <div class="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h5 class="text-success mb-0">
                                                        {{ formatCurrency(bien.prix) }}
                                                    </h5>
                                                    <small class="text-muted">/{{ capitalize(bien.typeUnite) }}</small>
                                                </div>

                                                <button @click="open360Fullscreen(bien)" class="btn btn-sm btn-primary">
                                                    <i class="bi bi-badge-vr me-1"></i>
                                                    Visiter
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Message si pas de biens 360 -->
                <div v-else class="row">
                    <div class="col-12 text-center py-5">
                        <i class="bi bi-badge-vr text-muted" style="font-size: 4rem;"></i>
                        <p class="text-muted mt-3">Aucune visite virtuelle disponible pour le moment</p>
                    </div>
                </div>

                <!-- Appel à l'action -->
                <div class="row mt-5">
                    <div class="col-12 text-center">
                        <div class="card border-0 shadow-sm bg-gradient-primary text-white p-5 rounded-4">
                            <div class="card-body">
                                <h3 class="mb-3">Prêt à explorer ?</h3>
                                <p class="lead mb-4">
                                    Découvrez nos biens en immersion totale avec nos visites virtuelles 360°
                                </p>
                                <button class="btn btn-light btn-lg px-5" @click="show360Modal = true">
                                    <i class="bi bi-badge-vr me-2"></i>
                                    Voir tous les biens 360°
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Modal 360 amélioré avec navigation -->
        <el-dialog v-model="show360Modal" :title="selected360Bien?.nom || 'Visite Virtuelle 360°'" width="95%"
            fullscreen class="modal-360-enhanced">

            <div class="position-relative" style="height: 85vh;">
                <!-- iframe 360 -->
                <iframe v-if="selected360Url" :src="selected360Url" allowfullscreen class="w-100 h-100 border-0">
                </iframe>

                <!-- Boutons de navigation -->
                <div class="position-absolute bottom-0 start-50 translate-middle-x mb-4">
                    <div class="btn-group shadow-lg" role="group">
                        <button v-if="prev360Bien" @click="open360Fullscreen(prev360Bien)" class="btn btn-dark">
                            <i class="bi bi-chevron-left"></i>
                            Précédent
                        </button>

                        <button class="btn btn-dark">
                            {{ current360Index + 1 }} / {{ biensWith360.length }}
                        </button>

                        <button v-if="next360Bien" @click="open360Fullscreen(next360Bien)" class="btn btn-dark">
                            Suivant
                            <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>

                <!-- Informations du bien -->
                <div class="position-absolute top-0 start-0 m-4">
                    <div class="card border-0 shadow" style="max-width: 300px;">
                        <div class="card-body">
                            <h6 class="mb-2">{{ selected360Bien?.nom }}</h6>
                            <p class="small text-muted mb-2">
                                <i class="bi bi-geo-alt me-1"></i>
                                {{ selected360Bien?.commune?.libelle }}
                            </p>
                            <h5 class="text-success mb-0">
                                {{ formatCurrency(selected360Bien?.prix) }}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>

        <!-- =======================
About END -->
        <SuggestionBox />


    </main>
</template>

<script>

import { tns } from 'tiny-slider';
// import { mapActions, mapGetters } from "vuex";
import { ref, onMounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus";
import SuggestionBox from '@/components/card/SuggestionBox.vue'
import { API_URLS } from "@/config/api";
import { useStore } from 'vuex'
import { useLoading } from "vue-loading-overlay";
import L from 'leaflet';
import GLightbox from 'glightbox'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass.js';
import 'glightbox/dist/css/glightbox.min.css'
import 'leaflet/dist/leaflet.css'
let scene, camera, renderer, controls, composer;
export default {
    components: { SuggestionBox },
    data() {
        return {
            services: [],
            biensImmobiliers: [],
            offres: [],
            currentPage: 1,
            perPage: 15,
            totalPages: 0,
            tabs: [],
            currentTab: null,
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

            showGeoModal: false,
            notationVisible: false,
            show360Modal: false,
            showContactModal: false,
            showLoginModal: false,
            showAdvancedFilters: false,

            selectedLat: null,
            selectedLng: null,
            bienSelectionne: null,
            noteTemp: 0,
            hoverRating: 0,
            selected360Url: '',
            mapInstance: null, // Instance Leaflet

            favorites: [],
            currentCurrency: 'XOF',
            exchangeRates: {
                USD: 0.0016,
                EUR: 0.0015
            },
            form: {
                nom: "",
                email: "",
                telephone: "",
                message: "",
            },
            errorMessage: null,
            searchDebounceTimer: null,

            biensWith360: [],
            selected360Bien: null,
            stats: {
                totalBiens: 0,
                biensAvec360: 0,
                vuesTotal: 0,
                satisfactionRate: 95
            },

            show360ModalEnhanced: false,
            current360Index: 0,
        };
    },

    mounted() {

        this.$nextTick(() => {
            this.initThreeBackground();
            this.initNavigationButtons();
            this.currentPage = 1;
            this.loadFavoritesFromStorage();

            this.loadService().then(() => {
                if (this.services && this.services.length > 0) {
                    this.currentTab = this.services[0].id;
                }

                Promise.all([
                    this.loadBiensImmobiliers(),
                    this.loadStatistics(),
                    this.loadBiensWith360(),
                    this.loadOffresActives()
                ]).then(() => {
                    // Initialiser sliders après chargement données
                    setTimeout(() => {
                        this.initSliders();
                    }, 500);
                }).catch(err => {
                    console.error('Error loading data:', err);
                });
            });
        });
    },
    watch: {
        currentTab() {
            this.currentPage = 1;
            this.searchBiens();
        },
        showGeoModal(visible) {
            if (visible) {
                this.$nextTick(() => {
                    const mapContainer = document.getElementById('map');
                    if (!mapContainer) {
                        console.error('Map container #map not found');
                        return;
                    }

                    // Nettoyer ancienne instance
                    if (this.mapInstance) {
                        try {
                            this.mapInstance.remove();
                        } catch (e) {
                            console.warn('Error removing map:', e);
                        }
                        this.mapInstance = null;
                    }

                    // Vérifier coordonnées
                    if (!this.selectedLat || !this.selectedLng) {
                        console.error('Invalid coordinates');
                        ElMessage.error('Coordonnées invalides');
                        return;
                    }

                    try {
                        // Créer carte
                        this.mapInstance = L.map('map', {
                            center: [this.selectedLat, this.selectedLng],
                            zoom: 15,
                            zoomControl: true,
                            attributionControl: true,
                        });

                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '&copy; OpenStreetMap contributors',
                        }).addTo(this.mapInstance);

                        L.marker([this.selectedLat, this.selectedLng])
                            .addTo(this.mapInstance)
                            .bindPopup('Localisation du bien')
                            .openPopup();

                        this.loadNearbyPOI(this.selectedLat, this.selectedLng);

                        setTimeout(() => {
                            if (this.mapInstance) {
                                this.mapInstance.invalidateSize();
                            }
                        }, 200);
                    } catch (error) {
                        console.error('Error initializing map:', error);
                        ElMessage.error('Erreur lors de l\'initialisation de la carte');
                    }
                });
            }
        }
    },
    computed: {

        totalBiens() {
            return this.$store.getters['biensImmobiliers/totalBiens'];
        },

        percentage360() {
            if (this.stats.totalBiens === 0) return 0;
            return Math.round((this.stats.biensAvec360 / this.stats.totalBiens) * 100);
        },

        next360Bien() {
            if (this.biensWith360.length === 0) return null;
            const nextIndex = (this.current360Index + 1) % this.biensWith360.length;
            return this.biensWith360[nextIndex];
        },

        prev360Bien() {
            if (this.biensWith360.length === 0) return null;
            const prevIndex = (this.current360Index - 1 + this.biensWith360.length) % this.biensWith360.length;
            return this.biensWith360[prevIndex];
        }
    },
    beforeDestroy() {
        // Nettoyage carte
        if (this.mapInstance) {
            try {
                this.mapInstance.remove();
            } catch (e) {
                console.warn('Error destroying map:', e);
            }
            this.mapInstance = null;
        }

        // Nettoyage timers
        if (this.searchDebounceTimer) {
            clearTimeout(this.searchDebounceTimer);
            this.searchDebounceTimer = null;
        }

        // Nettoyage Three.js
        if (typeof renderer !== 'undefined' && renderer) {
            try {
                renderer.dispose();
            } catch (e) {
                console.warn('Error disposing renderer:', e);
            }
        }

        if (typeof composer !== 'undefined' && composer) {
            try {
                composer.dispose();
            } catch (e) {
                console.warn('Error disposing composer:', e);
            }
        }
    },
    methods: {

        // ===== SLIDERS =====
        initSliders() {
            this.initTinySlider();
            this.init360Slider();
        },

        initTinySlider() {
            if (!this.$refs.slider) {
                console.warn('Slider ref not found');
                return;
            }

            const sliderItems = this.$refs.slider.querySelectorAll('.slider-item');
            if (!sliderItems || sliderItems.length === 0) {
                console.warn('No slider items found');
                return;
            }

            try {
                tns({
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
                    navPosition: 'top',
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
            } catch (error) {
                console.error('Error initializing slider:', error);
            }
        },

        init360Slider() {
            if (!this.$refs.slider360 || this.biensWith360.length === 0) {
                return;
            }

            try {
                tns({
                    container: this.$refs.slider360,
                    mode: 'carousel',
                    items: 1,
                    slideBy: 1,
                    autoplay: true,
                    autoplayTimeout: 5000,
                    autoplayHoverPause: true,
                    controls: true,
                    nav: true,
                    navPosition: 'bottom',
                    speed: 600,
                    controlsText: [
                        '<i class="bi bi-chevron-left"></i>',
                        '<i class="bi bi-chevron-right"></i>'
                    ],
                    responsive: {
                        768: { items: 2, gutter: 20 },
                        1024: { items: 3, gutter: 30 }
                    }
                });
            } catch (error) {
                console.error('Error initializing 360 slider:', error);
            }
        },
        // ===== LEAFLET MAP =====
        onClickGeo(bien) {
            this.selectedLat = bien.latitude;
            this.selectedLng = bien.longitude;
            this.showGeoModal = true;
        },

        async loadNearbyPOI(lat, lng) {
            if (!this.mapInstance) return;

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

                if (data.elements) {
                    data.elements.forEach(el => {
                        L.marker([el.lat, el.lon])
                            .addTo(this.mapInstance)
                            .bindPopup(el.tags.name || el.tags.amenity);
                    });
                }
            } catch (error) {
                console.error("Erreur POIs:", error);
            }
        },
        // ===== NOTATION =====
        ouvrirNotation(bien) {
            this.bienSelectionne = bien;
            this.noteTemp = bien.note || 0;
            this.notationVisible = true;
        },

        async envoyerNote() {
            try {
                await this.$store.dispatch('biens/noterBien', {
                    id: this.bienSelectionne.id,
                    note: this.noteTemp,
                });
                ElMessage.success("Merci pour votre note !");
                this.notationVisible = false;
            } catch (e) {
                ElMessage.error("Erreur lors de l'envoi de la note.");
            }
        },
        async sendMessage() {
            const loader = loading.show();
            try {
                const payload = {
                    nom: this.form.nom,
                    email: this.form.email,
                    telephone: this.form.telephone,
                    message: this.form.message,
                }
                const response = await store.dispatch('typeBiens/send', payload)
                ElMessage({
                    showClose: true,
                    message: 'Element ajouté avec success.',
                    type: "success",
                });
            } catch (error) {
                console.error('Erreur lors de la création de la catégorie:', error)
            } finally {
                this.loadService();
                loader.hide();
            }
        },
        formatCurrency(value) {
            if (!value) return '—';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
            }).format(value);
        },

        // NOUVELLE MÉTHODE: Charger les offres actives
        async loadOffresActives() {
            try {
                const response = await this.$store.dispatch('offres/getOffresActives', {
                    page: 0,
                    size: 6
                });
                this.offres = response.content || [];

                // Transformer les offres pour correspondre au format items existant
                this.items = this.offres.map(offre => ({
                    id: offre.id,
                    image: this.getImageUrl(offre.bien?.fichier?.id),
                    title: offre.description || 'Offre spéciale',
                    validate: `Valide jusqu'au: ${this.formatDate(offre.dateFin)}`,
                    typeOffre: offre.typeOffre,
                    montantReduction: offre.montantReduction,
                    bien: offre.bien
                }));
            } catch (error) {
                console.error('Erreur lors du chargement des offres:', error);
                // Garder les offres par défaut en cas d'erreur
            }
        },

        // NOUVELLE MÉTHODE: Formater la date
        formatDate(date) {
            if (!date) return '';
            const d = new Date(date);
            return d.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        },

        // NOUVELLE MÉTHODE: Calculer le prix avec réduction
        getPrixAvecReduction(bien, montantReduction) {
            if (!bien || !bien.prix || !montantReduction) return null;
            return bien.prix - montantReduction;
        },

        // NOUVELLE MÉTHODE: Formater le pourcentage de réduction
        getPourcentageReduction(prixOriginal, montantReduction) {
            if (!prixOriginal || !montantReduction) return 0;
            return Math.round((montantReduction / prixOriginal) * 100);
        },
        async convertCurrency(amount, fromCurrency, toCurrency) {
            if (!amount) return null;
            if (fromCurrency === toCurrency) return amount;
            try {
                const url = `https://v6.exchangerate-api.com/v6/aea6e2851889287522f072cb/latest/${fromCurrency}`;
                const response = await request.get(url);

                if (response.data.result !== "success") {
                    throw new Error('Erreur API de conversion');
                }

                const rate = response.data.conversion_rates[toCurrency];
                if (!rate) throw new Error(`Taux pour ${toCurrency} non trouvé`);

                return (amount * rate).toFixed(2);
            } catch (error) {
                console.error('Erreur conversion devise:', error);
                return null;
            }
        },
        async searchBiens() {
            const texte = this.searchFilters.globalSearch.trim();
            const type = this.currentTab;
            let status = null;

            // Détection du mot "disponible" ou "non disponible"
            if (/^disponible$/i.test(texte)) {
                status = true;
            } else if (/^non disponible$/i.test(texte)) {
                status = false;
            }
            const loader = this.$loading.show();
            try {
                if (texte.length > 5 || type) {
                    // Recherche avec texte (au moins 2 caractères) ou type (ou les deux)
                    const data = await this.$store.dispatch('biensImmobiliers/searchBiens', { texte, type });
                    this.biensImmobiliers = data;
                    this.totalPages = 1;
                    this.currentPage = 1;
                } else if (!texte && !type) {
                    // Aucun filtre, on recharge tout paginé
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
        show360View(bien) {
            if (bien.url360) {
                this.selected360Url = bien.url360;
                this.show360Modal = true;
            } else {
                ElMessage.warning('Vue 360° non disponible pour ce bien');
            }
        },
        // ✅ NOUVELLE: Charger les statistiques pour le compteur
        async loadStatistics() {
            try {
                // Récupérer le nombre total de biens avec vue 360
                const allBiens = await this.$store.dispatch('biensImmobiliers/getAll', {
                    page: 0,
                    size: 1000 // Récupérer tous les biens
                });

                const biensWith360 = allBiens.content.filter(bien => bien.url360);
                this.stats = {
                    totalBiens: allBiens.totalElements || 0,
                    biensAvec360: biensWith360.length,
                    vuesTotal: this.calculateTotalViews(allBiens.content),
                    satisfactionRate: 95 // Pourcentage fixe ou calculé selon vos données
                };

                // Animer les compteurs
                this.animateCounters();
            } catch (error) {
                console.error('Erreur chargement statistiques:', error);
            }
        },
        // ✅ NOUVELLE: Calculer le total des vues
        calculateTotalViews(biens) {
            return biens.reduce((total, bien) => total + (bien.nombreVues || 0), 0);
        },
        // ✅ NOUVELLE: Animation des compteurs avec effet de décompte
        animateCounters() {
            this.$nextTick(() => {
                const counters = document.querySelectorAll('.counter-value');

                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000; // 2 secondes
                    const increment = target / (duration / 16); // 60 FPS
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current).toLocaleString('fr-FR');
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target.toLocaleString('fr-FR');
                        }
                    };

                    updateCounter();
                });
            });
        },
        // ✅ NOUVELLE: Charger les biens avec vue 360 pour le carousel
        async loadBiensWith360() {
            try {
                const response = await this.$store.dispatch('biensImmobiliers/getAll', {
                    page: 0,
                    size: 100
                });

                this.biensWith360 = response.content.filter(bien => bien.url360);

                // Initialiser le slider après chargement
                this.$nextTick(() => {
                    this.init360Slider();
                });
            } catch (error) {
                console.error('Erreur chargement biens 360:', error);
            }
        },
        // ✅ NOUVELLE: Initialiser le slider des vues 360
        init360Slider() {
            if (this.$refs.slider360 && this.biensWith360.length > 0) {
                tns({
                    container: this.$refs.slider360,
                    mode: 'carousel',
                    items: 1,
                    slideBy: 1,
                    autoplay: true,
                    autoplayTimeout: 5000,
                    autoplayHoverPause: true,
                    controls: true,
                    nav: true,
                    navPosition: 'bottom',
                    speed: 600,
                    controlsText: [
                        '<i class="bi bi-chevron-left"></i>',
                        '<i class="bi bi-chevron-right"></i>'
                    ],
                    responsive: {
                        768: {
                            items: 2,
                            gutter: 20
                        },
                        1024: {
                            items: 3,
                            gutter: 30
                        }
                    }
                });
            }
        },
        // ✅ NOUVELLE: Ouvrir la vue 360 en plein écran
        open360Fullscreen(bien) {
            this.selected360Url = bien.url360;
            this.selected360Bien = bien;
            this.show360Modal = true;

            // Incrémenter le compteur de vues
            this.incrementView360(bien.id);
        },

        // ✅ NOUVELLE: Incrémenter le compteur de vues 360
        async incrementView360(bienId) {
            try {
                await this.$store.dispatch('biensImmobiliers/incrementerVue', bienId);
            } catch (error) {
                console.error('Erreur incrémentation vue:', error);
            }
        },
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
        showPagination() {
            return !this.searchFilters.globalSearch.trim();
        },
        // Exemple de méthode pour convertir un prix de bien et le stocker
        async updateConvertedPrice(bien, fromCurrency = 'XOF', toCurrency = 'USD') {
            const converted = await this.convertCurrency(bien.prix, fromCurrency, toCurrency);
            if (converted) {
                bien.convertedPrice = converted;  // tu peux stocker dans une propriété du bien
            } else {
                bien.convertedPrice = null;
            }
        },

        // Si tu veux convertir tous les biens affichés d’un coup :
        async convertAllPrices(toCurrency) {
            const fromCurrency = 'XOF'; // ou dynamique selon ton besoin
            await Promise.all(
                this.biensImmobiliers.map(bien =>
                    this.updateConvertedPrice(bien, fromCurrency, toCurrency)
                )
            );
        },
        capitalize(value) {
            if (!value) return ''
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
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
        onTypeChange() {
            this.searchFilters.globalSearch = '';
        },
        async loadBiensImmobiliers() {
            const loader = this.$loading.show(); // ✅
            try {
                console.log('Chargement des biens - page:', this.currentPage);
                const response = await this.$store.dispatch('biensImmobiliers/getAll', {
                    page: this.currentPage - 1, // Spring Data commence à 0
                    size: this.perPage
                });
                // console.log('Réponse reçue :', response);
                // console.log("Réponse du backend (number):", response.number);
                this.currentPage = (response.number || 0) + 1;
                this.biensImmobiliers = response.content || [];
                this.totalPages = response.totalPages || 0;
                if (this.currentCurrency !== 'XOF') {
                    await this.convertAllPrices(this.currentCurrency);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des services :', error);
                this.errorMessage = "Désolé, un problème est survenu lors du chargement des biens.";
                this.biensImmobiliers = []; // éviter undefined
            } finally {
                loader.hide();
            }
        },
        getImageUrl(idfile) {

            // return `https://93.115.20.172:8081/fichier/download/${idfile}`;
            return `${API_URLS.API_BASE}/fichier/download/${idfile}`;

        },
        debouncedSearch() {
            if (this.searchDebounceTimer) {
                clearTimeout(this.searchDebounceTimer);
            }
            this.searchDebounceTimer = setTimeout(() => {
                this.searchBiens();
            }, 500);
        },
        goToPage(page) {
            if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.loadBiensImmobiliers();
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;


                this.loadBiensImmobiliers();

            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadBiensImmobiliers();
            }
        },
        getPaginationRange() {
            const total = this.totalPages;
            const current = this.currentPage;
            const delta = 1; // nombre de pages autour de la page courante
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
        initThreeBackground() {
            const container = document.getElementById('three-container');
            scene = new THREE.Scene();

            // Caméra
            camera = new THREE.PerspectiveCamera(
                75,
                container.clientWidth / container.clientHeight,
                0.1,
                1000
            );
            camera.position.set(5, 3, 10); // reculé et un peu en hauteur
            camera.lookAt(0, 1.6, 0);     // regarder le centre du bâtiment

            // Rendu
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);

            // Ajout d'un fond opaque avec un plan géométrique
            // const backgroundGeometry = new THREE.PlaneGeometry(1000, 1000);  // Grand plan pour couvrir toute la scène
            // const backgroundMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, opacity: 1, transparent: false });
            // const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
            // background.position.z = -300; // Le mettre bien en arrière pour ne pas interférer avec les objets visibles
            // scene.add(background);
            // Lumières
            const light = new THREE.DirectionalLight(0xffffff, 1.5);
            light.position.set(10, 10, 10);
            scene.add(light);
            scene.add(new THREE.AmbientLight(0xffffff, 1)); // lumière douce pour l'intérieur

            // Controls Orbit
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.autoRotate = false;
            controls.enablePan = true;
            controls.enableZoom = true;
            controls.autoRotateSpeed = 0.5;


            // Charger ton modèle GLB (exemple : building.glb)
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
            // Charger ton modèle GLB (exemple : building.glb)
            const gltfLoader = new GLTFLoader();
            gltfLoader.load('/models/screen_space_reflection_demo_follmann_2.og.glb', (gltf) => {
                const building = gltf.scene;
                building.traverse((child) => {
                    if (child.isMesh) {

                        child.material.side = THREE.DoubleSide; // voir l'intérieur
                        // Ajouter contour (wireframe)
                        // const wireframe = new THREE.WireframeGeometry(child.geometry);
                        // const line = new THREE.LineSegments(wireframe);
                        // line.material.depthTest = false;
                        // line.material.opacity = 0.25;
                        // line.material.transparent = true;
                        // child.add(line);
                    }
                });
                building.scale.set(1.5, 1.5, 1.5);
                building.position.y = -1;
                scene.add(building);
            });

            // --- Post-processing avec SSR ---
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

            // Animation
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

            // Redimensionnement
            window.addEventListener('resize', () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
                composer.setSize(container.clientWidth, container.clientHeight);
            });
        },
        // --- Fonctions pour les boutons ---
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

/* Effet hover sur les cartes d'offres */
.hover-shadow {
    transition: all 0.3s ease;
}

.hover-shadow:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
}

/* Animation pour le badge de réduction */
.badge {
    animation: pulse-badge 2s infinite;
}

@keyframes pulse-badge {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }
}

/* Style pour le prix barré */
.text-decoration-line-through {
    text-decoration: line-through;
    opacity: 0.7;
}

/* Animations pour les cartes de stats */
.hover-lift {
    transition: all 0.3s ease;
}

.hover-lift:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15) !important;
}

/* Animation des compteurs */
.counter-value {
    display: inline-block;
    transition: all 0.3s ease;
}

/* Overlay pour les cartes 360 */
.overlay-360 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(13, 110, 253, 0.9), rgba(111, 66, 193, 0.9));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.4s ease;
}

.hover-360:hover .overlay-360 {
    opacity: 1;
}

/* Animation du bouton 360 */
.pulse-360 {
    width: 80px;
    height: 80px;
    animation: pulse-360 2s infinite;
}

@keyframes pulse-360 {

    0%,
    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.7);
    }

    50% {
        transform: scale(1.1);
        box-shadow: 0 0 0 20px rgba(13, 110, 253, 0);
    }
}

/* Fond dégradé pour CTA */
.bg-gradient-primary {
    background: linear-gradient(135deg, --bs-primary 0%, --bs-secondary 100%);
}

/* Particules en arrière-plan */
.particle-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle at 20% 50%, rgba(13, 110, 253, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(111, 66, 193, 0.1) 0%, transparent 50%);
    animation: float-particles 20s ease-in-out infinite;
}

@keyframes float-particles {

    0%,
    100% {
        transform: translate(0, 0);
    }

    25% {
        transform: translate(10px, -10px);
    }

    50% {
        transform: translate(-10px, 10px);
    }

    75% {
        transform: translate(10px, 10px);
    }
}

/* Progress bar animée */
.progress-bar {
    transition: width 2s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
    .pulse-360 {
        width: 60px;
        height: 60px;
    }

    .display-5 {
        font-size: 2rem;
    }
}

/* =======================
   Section 360° - Styles avancés
   ======================= */

/* Container principal avec effet de profondeur */
.section-360-container {
    position: relative;
    background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
}

/* Animation d'entrée pour les statistiques */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.hover-lift {
    animation: fadeInUp 0.6s ease-out;
    animation-fill-mode: backwards;
}

.hover-lift:nth-child(1) {
    animation-delay: 0.1s;
}

.hover-lift:nth-child(2) {
    animation-delay: 0.2s;
}

.hover-lift:nth-child(3) {
    animation-delay: 0.3s;
}

.hover-lift:nth-child(4) {
    animation-delay: 0.4s;
}

/* Effet de glow sur les icônes */
.icon-box {
    transition: all 0.3s ease;
}

.hover-lift:hover .icon-box {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(13, 110, 253, 0.3);
}

/* Animation du compteur avec effet de brillance */
.counter-value {
    position: relative;
    display: inline-block;
}

.counter-value::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent);
    animation: shine 3s infinite;
}

@keyframes shine {
    0% {
        left: -100%;
    }

    50%,
    100% {
        left: 100%;
    }
}

/* Carte 360 avec effet de profondeur */
.hover-360 {
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    transform-style: preserve-3d;
}

.hover-360:hover {
    transform: translateY(-15px) scale(1.02);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15),
        0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Overlay avec effet de dégradé animé */
.overlay-360 {
    background: linear-gradient(135deg,
            rgba(13, 110, 253, 0.95) 0%,
            rgba(111, 66, 193, 0.95) 100%);
    backdrop-filter: blur(5px);
}

.overlay-360::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent);
    animation: slide 3s infinite;
}

@keyframes slide {
    0% {
        left: -100%;
    }

    100% {
        left: 100%;
    }
}

/* Bouton 360 avec effet de pulsation avancé */
.pulse-360 {
    position: relative;
    overflow: hidden;
}

.pulse-360::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.pulse-360:hover::before {
    width: 300px;
    height: 300px;
}

/* Progress bar avec animation de remplissage */
.progress {
    background-color: rgba(0, 0, 0, 0.05);
    overflow: visible;
}

.progress-bar {
    position: relative;
    overflow: visible;
}

.progress-bar::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 4px;
    height: 100%;
    background: white;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    animation: blink 1s infinite;
}

@keyframes blink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.3;
    }
}

/* Badge avec animation */
.badge {
    transition: all 0.3s ease;
}

.badge:hover {
    transform: scale(1.1);
}

/* CTA Card avec effet de vague */
.bg-gradient-primary {
    position: relative;
    overflow: hidden;
}

.bg-gradient-primary::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 60%);
    animation: wave 15s infinite linear;
}

@keyframes wave {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Modal 360 amélioré */
.modal-360-enhanced .el-dialog__body {
    padding: 0 !important;
}

.modal-360-enhanced iframe {
    border-radius: 10px;
}

/* Navigation du modal avec effet glassmorphism */
.btn-group.shadow-lg {
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.7);
    border-radius: 50px;
    overflow: hidden;
}

.btn-group .btn-dark {
    background: transparent;
    border: none;
    color: white;
    transition: all 0.3s ease;
}

.btn-group .btn-dark:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
}

/* Effet de scintillement sur les étoiles */
@keyframes twinkle {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.3;
    }
}

.bi-star-fill {
    animation: twinkle 2s infinite;
}

/* Responsive - Optimisation mobile */
@media (max-width: 768px) {
    .hover-360:hover {
        transform: translateY(-10px) scale(1.01);
    }

    .pulse-360 {
        width: 60px;
        height: 60px;
    }

    .overlay-360 {
        padding: 20px;
    }

    .btn-group {
        font-size: 0.875rem;
    }
}

@media (max-width: 576px) {
    .card-body .icon-box {
        width: 50px;
        height: 50px;
    }

    .counter-value {
        font-size: 1.5rem;
    }

    .display-5 {
        font-size: 1.75rem;
    }
}

/* Animation de chargement */
@keyframes skeleton-loading {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

.skeleton {
    background: linear-gradient(90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
}

/* Effet de parallaxe léger sur le scroll */
@media (prefers-reduced-motion: no-preference) {
    .section-360-container {
        transform-style: preserve-3d;
    }

    .section-360-container>* {
        transform: translateZ(0);
        will-change: transform;
    }
}

/* Accessibilité - Focus visible */
.btn:focus,
.card:focus {
    outline: 3px solid rgba(13, 110, 253, 0.5);
    outline-offset: 3px;
}

/* Print styles */
@media print {

    .overlay-360,
    .pulse-360,
    .particle-bg {
        display: none;
    }
}
</style>
