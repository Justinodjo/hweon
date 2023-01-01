<template>
    <!-- **************** MAIN CONTENT START **************** -->
    <main>
        <!-- =======================
Main Title START -->
        <section class="py-0 pt-sm-0">
            <div class="container position-relative">
                <!-- Title and button START -->
                <div class="row mb-3">
                    <div class="col-12">
                        <!-- Meta -->
                        <div class="d-lg-flex justify-content-lg-between mb-1">
                            <!-- Title -->
                            <div class="mb-2 mb-lg-0">
                                <h1 class="fs-2">{{ this.biensImmobiliers?.nom }}</h1>
                                <!-- Location -->
                                <p class="fw-bold mb-0"><i class="bi bi-geo-alt me-2"></i>{{
                                    this.biensImmobiliers?.adresse }}
                                    <a class="ms-2 text-decoration-underline" @click="onClickGeo(biensImmobiliers)">
                                        <i class="bi bi-eye-fill me-1"></i>Voir sur la carte
                                    </a>
                                </p>
                            </div>
                            <!-- Modal ElDialog -->
                            <el-dialog v-model="showGeoModal" @open="initMap" title="Localisation du bien" width="80%">
                                <div class="leaflet-container-wrapper">
                                    <div id="map" class="leaflet-container-map"></div>
                                </div>
                            </el-dialog>
                            <div class="modal fade" id="mapmodal" tabindex="-1" aria-labelledby="mapModalLabel"
                                aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">

                                    </div>
                                </div>
                            </div>

                            <!-- Buttons -->
                            <ul class="list-inline text-end">
                                <!-- Heart icon -->
                                <li class="list-inline-item">
                                    <a href="#" :class="['fa-solid', isLiked ? 'fa-heart text-red-500' : 'fa-heart']"
                                        @click.prevent="incrementLike(biensImmobiliers?.id)"
                                        :title="!isAuthenticated ? 'Connectez-vous pour liker' : isLiked ? 'Vous avez déjà liké' : 'Cliquez pour liker'"
                                        :style="{ cursor: isAuthenticated && !isLiked ? 'pointer' : 'default' }">
                                        <span class="like-count">{{ " " + biensImmobiliers?.nombreJaime ?? 0 }}
                                        </span></a>
                                </li>
                                <!-- Share icon -->
                                <li class="list-inline-item dropdown">
                                    <a href="#" class="btn btn-sm btn-light px-2" role="button" id="dropdownShare"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa-solid fa-fw fa-share-alt"></i>
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-end min-w-auto shadow rounded"
                                        aria-labelledby="dropdownShare">
                                        <li><a class="dropdown-item" @click="shareOn('twitter')" href="#">
                                                <i class="fab fa-twitter-square me-2"></i>Twitter</a>
                                        </li>
                                        <li><a class="dropdown-item" @click="shareOn('facebook')" href="#">
                                                <i class="fab fa-facebook-square me-2"></i>Facebook</a>
                                        </li>
                                        <li><a class="dropdown-item" @click="shareOn('linkedin')" href="#">
                                                <i class="fab fa-linkedin me-2"></i>LinkedIn</a>
                                        </li>
                                        <li><a class="dropdown-item" @click="copyLink" href="#">
                                                <i class="fa-solid fa-copy me-2"></i>Copier le lien</a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!-- Title and button END -->

                <!-- Alert box START -->
                <div v-if="biensImmobiliers?.alerteContractuelle || showContractAlert"
                    class="alert alert-danger alert-dismissible d-flex justify-content-between align-items-center fade show mb-4 rounded-3 pe-2"
                    role="alert">
                    <div class="d-flex">
                        <span class="alert-heading h5 mb-0 me-2">
                            <i class="bi bi-exclamation-octagon-fill"></i>
                        </span>
                        <span>
                            <strong class="alert-heading me-2">
                                {{ biensImmobiliers?.alerteContractuelle?.titre ||
                                    'Politique Hweon' }}:
                            </strong>
                            {{
                                biensImmobiliers?.alerteContractuelle?.message ||
                                "Pour toutes annonces veuillez toujours demander " +
                                "les documents nécessaires pour un achat, vente ou location"
                            }}
                        </span>
                    </div>
                    <button type="button" class="btn btn-link text-primary-hover pb-0 text-end"
                        @click="showContractAlert = false" aria-label="Close">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <!-- Alert box END -->
            </div>
        </section>
        <!-- =======================
Main Title END -->

        <!-- =======================
Image gallery START -->
        <section class="card-grid pt-0" v-if="biensImmobiliers">
            <div class="container">
                <div class="row g-2">
                    <!-- Image -->
                    <div class="col-md-6" v-if="biensImmobiliers.fichier">
                        <a data-glightbox data-gallery="gallery" :href="getImageUrl(biensImmobiliers.fichier.id)">
                            <div class="card card-grid-lg card-element-hover card-overlay-hover overflow-hidden"
                                :style="{ backgroundImage: `url(${getImageUrl(biensImmobiliers.fichier.id)})`, backgroundPosition: 'center left', backgroundSize: 'cover' }">
                                <!-- Card hover element -->
                                <div class="hover-element position-absolute w-100 h-100">
                                    <i
                                        class="bi bi-fullscreen fs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-1 p-2 lh-1"></i>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div class="col-md-6">
                        <!-- Card item START -->
                        <div class="row g-2">
                            <!-- Image -->
                            <div class="col-12" v-for="(file, index) in biensImmobiliers.fichiers"
                                :key="'fichier-' + index">
                                <a data-glightbox data-gallery="gallery" :href="getImageUrl(file.id)">
                                    <div class="card card-grid-sm card-element-hover card-overlay-hover overflow-hidden"
                                        :style="{ backgroundImage: `url(${getImageUrl(file.id)})`, backgroundPosition: 'center left', backgroundSize: 'cover' }">
                                        <!-- Card hover element -->
                                        <div class="hover-element position-absolute w-100 h-100">
                                            <i
                                                class="bi bi-fullscreen fs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-1 p-2 lh-1"></i>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <!-- Image -->
                            <div class="col-md-6"
                                v-for="(detail, index) in biensImmobiliers.detailsBiensImmobiliers || []"
                                :key="'detail-' + index" v-if="biensImmobiliers.detailsBiensImmobiliers?.fichier">
                                <a data-glightbox data-gallery="gallery" :href="getImageUrlSafe(detail.fichier)">
                                    <div class="card card-grid-sm card-element-hover card-overlay-hover overflow-hidden"
                                        :style="{ backgroundImage: `url(${getImageUrlSafe(detail.fichier)})`, backgroundPosition: 'center left', backgroundSize: 'cover' }">
                                        <!-- Card hover element -->
                                        <div class="hover-element position-absolute w-100 h-100">
                                            <i
                                                class="bi bi-fullscreen fs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-1 p-2 lh-1"></i>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <!-- Images -->
                            <div class="col-md-6" v-if="biensImmobiliers?.detailsBiensImmobiliers?.length">
                                <div class="card card-grid-sm overflow-hidden" :style="{
                                    backgroundImage: `url(${getImageUrl(biensImmobiliers?.detailsBiensImmobiliers[0]?.fichier?.id)})`,
                                    backgroundPosition: 'center left',
                                    backgroundSize: 'cover'
                                }">
                                    <!-- Background overlay -->
                                    <div class="bg-overlay bg-dark opacity-7"></div>

                                    <!-- Popup Images -->
                                    <a v-for="(detail, index) in biensImmobiliers?.detailsBiensImmobiliers"
                                        :key="'popup-' + index" data-glightbox data-gallery="gallery"
                                        :href="getImageUrl(detail?.fichier?.id)"
                                        :class="index === 0 ? 'stretched-link z-index-9' : ''"></a>

                                    <!-- Overlay text -->
                                    <div class="card-img-overlay d-flex h-100 w-100">
                                        <h6 class="card-title m-auto fw-light text-decoration-underline"><a
                                                href="hotel-detail.html#" class="text-white">Voir les {{
                                                    biensImmobiliers.detailsBiensImmobiliers.length }} images </a></h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Card item END -->
                    </div>
                </div>
            </div>
        </section>
        <!-- =======================
Image gallery END -->

        <!-- =======================
About hotel START -->
        <section class="pt-0">
            <div class="container" data-sticky-container>
                <!-- Book now START -->
                <div class="card card-body border">

                    <!-- Title -->
                    <div class="d-sm-flex justify-content-sm-between align-items-center mb-3">

                        <div>
                            <span>Prix à partir de</span>
                            <h4 class="card-title mb-0">
                                {{ formatCurrency(biensImmobiliers?.prixMin || biensImmobiliers?.prix) }}
                            </h4>
                        </div>
                        <div>
                            <h6 class="fw-normal mb-0">
                                {{ biensImmobiliers?.detailsBiensImmobiliers?.length || 0 }} Appartements</h6>
                            <small>{{ formatDate(biensImmobiliers?.createdAt) }}</small>
                        </div>
                    </div>

                    <!-- Rating -->
                    <ul class="list-inline mb-2">
                        <li class="list-inline-item me-1 h6 fw-light mb-0">
                            <i class="bi bi-arrow-right me-2"></i>{{ biensImmobiliers?.noteGlobale || 0 }}
                        </li>
                        <li v-for="n in 5" :key="n" class="list-inline-item me-0 small">
                            <i :class="[
                                'fa-solid',
                                n <= Math.floor(biensImmobiliers?.noteGlobale || 0) ? 'fa-star text-warning' :
                                    n - 0.5 === (biensImmobiliers?.noteGlobale || 0) ? 'fa-star-half-alt text-warning' :
                                        'fa-star text-muted'
                            ]"></i>
                        </li>
                        <li class="list-inline-item ms-2 small text-muted">
                            ({{ biensImmobiliers?.nombreAvis || 0 }} avis)
                        </li>
                    </ul>

                    <!-- Avantages dynamiques -->
                    <div v-if="biensImmobiliers?.avantagesPrincipaux?.length">
                        <p v-for="(avantage, index) in biensImmobiliers.avantagesPrincipaux.slice(0, 2)" :key="index"
                            class="h6 fw-light mb-2">
                            <i class="bi bi-arrow-right me-2"></i>{{ avantage }}
                        </p>
                    </div>

                    <!-- 🆕 BOUTON POUR SÉLECTIONNER LE BIEN PRINCIPAL -->
                    <div class="d-grid mt-3">
                        <button type="button" class="btn btn-lg mb-2"
                            :class="isBienSelected ? 'btn-success' : 'btn-primary'" @click="toggleBienSelection">
                            <i :class="['bi', isBienSelected ? 'bi-check-circle-fill' : 'bi-building']"
                                class="me-2"></i>
                            {{ isBienSelected ? 'Bien sélectionné' : 'Sélectionner ce bien immobilier' }}
                        </button>
                    </div>

                    <!-- Bouton Appartements -->
                    <div class="d-grid mt-2">
                        <input type="checkbox" class="btn-check" id="btn-check-soft">
                        <label class="btn btn-primary-soft btn-primary-check mb-0" for="btn-check-soft"
                            data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-controls="collapseExample">
                            <i class="bi fa-fe bi-sliders me-2"></i>
                            {{ biensImmobiliers?.detailsBiensImmobiliers?.length || 0 }} Appartements disponibles
                        </label>
                    </div>
                </div>
                <!-- Book now END -->
                <div class="row g-4 g-xl-5 mt-4 collapse" id="collapseExample">
                    <!-- Content START -->
                    <div class="col-xl-7 order-1">
                        <div class="vstack gap-5">

                            <!-- About hotel START -->
                            <div class="card bg-transparent">
                                <!-- Card header -->
                                <div class="card-header border-bottom bg-transparent px-0 pt-0">
                                    <h3 class="mb-0">Bien immobilier de type
                                        {{ this.biensImmobiliers?.typeBiensImmobiliere?.nomTypeBiensImmo }}
                                    </h3>
                                </div>

                                <!-- Card body START -->
                                <div class="card-body pt-4 p-0">
                                    <h5 class="fw-light mb-4">Principaux points forts</h5>

                                    <!-- Highlights Icons -->
                                    <div class="hstack gap-3 mb-3">
                                        <div v-for="(highlight, index) in getHighlights()" :key="index"
                                            class="icon-lg bg-light h5 rounded-2" data-bs-toggle="tooltip"
                                            data-bs-placement="top" :title="highlight.label">
                                            <i :class="highlight.icon"></i>
                                        </div>
                                    </div>

                                    <p class="mb-3">{{ shortDescription }}</p>
                                    <div class="collapse" id="collapseContent">
                                        <p class="my-3">{{ longDescription }}</p>
                                    </div>
                                    <a class="p-0 mb-4 mt-2 btn-more d-flex align-items-center collapsed"
                                        data-bs-toggle="collapse" href="hotel-detail.html#collapseContent" role="button"
                                        aria-expanded="false" aria-controls="collapseContent">
                                        voir <span class="see-more ms-1">plus</span><span
                                            class="see-less ms-1">moins</span><i
                                            class="fa-solid fa-angle-down ms-2"></i>
                                    </a>

                                    <!-- List -->
                                    <h3 class="fw-light mb-2"><strong>Avantages</strong></h3>
                                    <div v-if="biensImmobiliers?.avantagesApplication?.length">
                                        <div v-for="(categorie, catIndex) in biensImmobiliers.avantagesApplication"
                                            :key="'cat-' + catIndex" class="mb-3">
                                            <strong>{{ categorie.titre }}</strong>
                                            <ul class="list-group list-group-borderless mb-0">
                                                <li v-for="(avantage, avIndex) in categorie.items"
                                                    :key="'av-' + avIndex"
                                                    class="list-group-item h6 fw-light d-flex mb-0">
                                                    <i class="bi bi-patch-check-fill text-success me-2"></i>
                                                    {{ avantage }}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <!-- Fallback si pas de données dynamiques -->
                                    <div v-else>
                                        <strong>
                                            Gain de temps considérable</strong>
                                        <ul class="list-group list-group-borderless mb-0">
                                            <li class="list-group-item h6 fw-light d-flex mb-0"><i
                                                    class="bi bi-patch-check-fill text-success me-2"></i>Automatisez vos
                                                quittances, relances, révisions de loyers...</li>
                                            <li class="list-group-item h6 fw-light d-flex mb-0"><i
                                                    class="bi bi-patch-check-fill text-success me-2"></i>Dites adieu aux
                                                tableurs complexes et aux papiers perdus.</li>
                                            <li class="list-group-item h6 fw-light d-flex mb-0"><i
                                                    class="bi bi-patch-check-fill text-success me-2"></i>📌 En un clic :
                                                vos
                                                documents sont générés et vos données centralisées.</li>
                                        </ul>

                                        <!-- List -->

                                        <strong>
                                            Suivi facilité de ses biens</strong>
                                        <ul class="list-group list-group-borderless mb-0">
                                            <li class="list-group-item h6 fw-light d-flex mb-0"><i
                                                    class="bi bi-patch-check-fill text-success me-2"></i>Visualisez vos
                                                loyers, retards, rendements, taux d’occupation.</li>
                                            <li class="list-group-item h6 fw-light d-flex mb-0"><i
                                                    class="bi bi-patch-check-fill text-success me-2"></i>Analysez la
                                                performance de chaque bien.</li>
                                            <li class="list-group-item h6 fw-light d-flex mb-0"><i
                                                    class="bi bi-patch-check-fill text-success me-2"></i>📊 Vous savez
                                                instantanément ce qui rapporte et ce qui coûte..</li>
                                        </ul>


                                        <strong>
                                            Zéro oubli administratif</strong>
                                        <ul class="list-group list-group-borderless mb-0">
                                            <li class="list-group-item h6 fw-light d-flex align-items-start mb-0">
                                                <i class="bi bi-patch-check-fill text-success me-2 mt-1"></i>
                                                <div>
                                                    <strong>Alertes pour :</strong>
                                                    <ul class="list-unstyled ms-4 mt-1">
                                                        <li class="d-flex mb-1">
                                                            <i class="bi bi-patch-check-fill text-success me-2"></i> la
                                                            fin
                                                            des baux
                                                        </li>
                                                        <li class="d-flex mb-1">
                                                            <i class="bi bi-patch-check-fill text-success me-2"></i> les
                                                            révisions de loyers
                                                        </li>
                                                        <li class="d-flex mb-1">
                                                            <i class="bi bi-patch-check-fill text-success me-2"></i> les
                                                            diagnostics à renouveler (DPE, électricité)
                                                        </li>
                                                        <li class="d-flex mb-1">
                                                            <i class="bi bi-patch-check-fill text-success me-2"></i>
                                                            l’envoi
                                                            automatique des quittances, messages et documents
                                                        </li>
                                                        <li class="d-flex">
                                                            <i class="bi bi-patch-check-fill text-success me-2"></i> les
                                                            assurances ou taxes à payer
                                                        </li>
                                                    </ul>
                                                </div>
                                            </li>
                                            <li class="list-group-item h6 fw-light d-flex mb-0"><i
                                                    class="bi bi-patch-check-fill text-success me-2"></i>🔔 Vous restez
                                                toujours en conformité et en avance.</li>
                                        </ul>
                                    </div>

                                </div>
                                <!-- Card body END -->
                            </div>
                            <!-- About hotel START -->

                            <!-- Équipements START -->
                            <div class="card bg-transparent">
                                <!-- Card header -->
                                <div class="card-header border-bottom bg-transparent px-0 pt-0">
                                    <h3 class="card-title mb-0">Équipements</h3>
                                </div>

                                <!-- Card body START -->
                                <div class="card-body pt-4 p-0">
                                    <div class="row g-4">
                                        <!-- Activities -->
                                        <div class="col-sm-6">
                                            <h6><i class="fa-solid fa-biking me-2"></i>Activités</h6>
                                            <!-- List -->
                                            <ul class="list-group list-group-borderless mt-2 mb-0">
                                                <li v-for="(activite, index) in biensImmobiliers?.equipements?.activites"
                                                    :key="'lang' + index" class="list-group-item pb-0">
                                                    <i class="fa-solid fa-check-circle text-success me-2"></i>{{
                                                        formatEnum(activite) }}
                                                </li>
                                            </ul>
                                        </div>

                                        <!-- Payment Method -->
                                        <div class="col-sm-6">
                                            <h6><i class="fa-solid fa-credit-card me-2"></i>Mode de paiement</h6>
                                            <!-- List -->
                                            <ul class="list-group list-group-borderless mt-2 mb-0">
                                                <li v-for="(paiement, index) in biensImmobiliers?.equipements?.modesPaiement"
                                                    :key="'p' + index" class="list-group-item pb-0">
                                                    <i class="fa-solid fa-check-circle text-success me-2"></i>{{
                                                        formatEnum(paiement) }}
                                                </li>
                                            </ul>
                                        </div>

                                        <!-- Services -->
                                        <div class="col-sm-6">
                                            <h6><i class="fa-solid fa-concierge-bell me-2"></i>Services</h6>
                                            <!-- List -->
                                            <ul class="list-group list-group-borderless mt-2 mb-0">
                                                <li v-for="(service, index) in biensImmobiliers?.equipements?.services"
                                                    :key="'s' + index" class="list-group-item pb-0">
                                                    <i class="fa-solid fa-check-circle text-success me-2"></i>{{
                                                        formatEnum(service) }}
                                                </li>
                                            </ul>
                                        </div>

                                        <!-- Safety & Security -->
                                        <div class="col-sm-6">
                                            <h6><i class="bi bi-shield-fill-check me-2"></i>Sécurité et sûreté</h6>
                                            <!-- List -->
                                            <ul class="list-group list-group-borderless mt-2 mb-4 mb-sm-5">
                                                <li v-for="(item, index) in biensImmobiliers?.equipements?.securite"
                                                    :key="'sec' + index" class="list-group-item pb-0">
                                                    <i class="fa-solid fa-check-circle text-success me-2"></i>{{
                                                        formatEnum(item) }}
                                                </li>
                                            </ul>

                                            <h6><i class="fa-solid fa-volume-up me-2"></i>Langue du personnel</h6>
                                            <!-- List -->
                                            <ul class="list-group list-group-borderless mt-2 mb-0">
                                                <li v-for="(langue, index) in biensImmobiliers?.equipements?.languesPersonnel"
                                                    :key="'lang' + index" class="list-group-item pb-0">
                                                    <i class="fa-solid fa-check-circle text-success me-2"></i>{{
                                                        formatEnum(langue) }}
                                                </li>
                                            </ul>
                                        </div>

                                    </div>
                                </div>
                                <!-- Card body END -->
                            </div>
                            <!-- Amenities END -->

                            <!-- Room START -->
                            <div class="card bg-transparent" id="room-options">
                                <!-- Card header -->
                                <div class="card-header border-bottom bg-transparent px-0 pt-0">
                                    <div class="d-sm-flex justify-content-sm-between align-items-center">
                                        <h3 class="mb-2 mb-sm-0">Appartements</h3>

                                        <!-- DROPDOWN DE TRI DYNAMIQUE -->
                                        <div class="col-sm-4">
                                            <form class="form-control-bg-light">
                                                <select v-model="sortOption" @change="sortRooms"
                                                    class="form-select form-select-sm border-0">
                                                    <option value="">Trier par</option>
                                                    <option value="recent">Récemment ajouté</option>
                                                    <option value="popular">Les plus populaires</option>
                                                    <option value="price_asc">Prix croissant</option>
                                                    <option value="price_desc">Prix décroissant</option>
                                                    <option value="rating">Mieux notés</option>
                                                </select>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                <!-- Card body START -->
                                <div class="card-body pt-4 p-0">
                                    <div class="vstack gap-4">

                                        <!-- Room item START -->
                                        <div
                                            v-if="biensImmobiliers && biensImmobiliers?.detailsBiensImmobiliers?.length">
                                            <room-slider v-for="room in biensImmobiliers.detailsBiensImmobiliers"
                                                :key="room.id" :room="room" @room-selected="toggleRoomSelection"
                                                :biensId="Number($route.params.id)" />
                                        </div>
                                        <!-- Room item END -->
                                    </div>
                                </div>
                                <!-- Card body END -->
                            </div>
                            <!-- Room END -->

                            <!-- Customer Review START -->

                            <Avis :biensId="Number($route.params.id)" />
                            <!-- Customer Review END -->

                            <!-- Hotel Policies START -->
                            <div class="card bg-transparent">
                                <!-- Card header -->
                                <div class="card-header border-bottom bg-transparent px-0 pt-0">
                                    <h3 class="mb-0">Politique Générale</h3>
                                </div>

                                <!-- Card body START -->
                                <div class="card-body pt-4 p-0">
                                    <!-- List -->
                                    <ul class="list-group list-group-borderless mb-2">
                                        <li class="list-group-item d-flex">
                                            <i class="bi bi-check-circle-fill me-2"></i> <strong>Responsabilités et
                                                Engagements
                                                de toutes les Parties</strong>
                                        </li>
                                        <li class="list-group-item d-flex">
                                            <i class="bi bi-check-circle-fill me-2"></i>Respect des Engagements : Chaque
                                            partie (acheteur, vendeur, locataire, administrateur, gestionnaire) s'engage
                                            à respecter les termes du contrat signé et à agir avec transparence,
                                            professionnalisme et respect envers les autres parties.
                                        </li>
                                        <li class="list-group-item d-flex">
                                            <i class="bi bi-check-circle-fill me-2"></i>Communication Claire : Toutes
                                            les parties doivent maintenir une communication ouverte et respectueuse,
                                            informant immédiatement les autres parties de tout changement ou problème
                                            majeur pouvant affecter le bon déroulement des transactions ou de la gestion
                                            des biens.
                                        </li>
                                        <li class="list-group-item d-flex">
                                            <i class="bi bi-check-circle-fill me-2"></i>Protection des Informations
                                            Personnelles : Toutes les parties, y compris les gestionnaires, doivent
                                            garantir la confidentialité des informations personnelles et financières des
                                            clients (acheteurs, locataires, etc.) conformément à la législation en
                                            vigueur sur la protection des données personnelles.
                                        </li>
                                        <li class="list-group-item d-flex">
                                            <i class="bi bi-x-circle-fill me-2"></i>Accès aux Dossiers : Seules les
                                            parties autorisées doivent avoir accès aux documents liés à la gestion des
                                            biens, y compris les contrats, les paiements, et les informations
                                            personnelles. Toute consultation ou modification doit être documentée.
                                        </li>
                                    </ul>

                                    <!-- List -->
                                    <!-- Check-in/out DYNAMIQUES -->
                                    <ul class="list-group list-group-borderless mb-2">
                                        <li class="list-group-item h6 fw-light d-flex mb-0">
                                            <i class="bi bi-arrow-right me-2"></i>
                                            Check-in: {{ biensImmobiliers?.heureCheckIn || '14:00' }}
                                        </li>
                                        <li class="list-group-item h6 fw-light d-flex mb-0">
                                            <i class="bi bi-arrow-right me-2"></i>
                                            Check-out: {{ biensImmobiliers?.heureCheckOut || '11:00' }}
                                        </li>
                                        <li v-if="biensImmobiliers?.autoCheckIn"
                                            class="list-group-item h6 fw-light d-flex mb-0">
                                            <i class="bi bi-arrow-right me-2"></i>
                                            {{ biensImmobiliers.autoCheckInDescription || 'Self-check-in disponible' }}
                                        </li>
                                        <li class="list-group-item h6 fw-light d-flex mb-0">
                                            <i :class="['bi', biensImmobiliers?.animauxAcceptes ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger']"
                                                class="me-2"></i>
                                            {{ biensImmobiliers?.animauxAcceptes ? 'Animaux acceptés' : 'Pas d\'animaux'
                                            }}
                                        </li>
                                        <li class="list-group-item h6 fw-light d-flex mb-0">
                                            <i :class="['bi', biensImmobiliers?.evenementsAutorises ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger']"
                                                class="me-2"></i>
                                            {{ biensImmobiliers?.evenementsAutorises ? 'Événements autorisés' :
                                                'Pas d\'événements' }}
                                        </li>
                                        <li class="list-group-item h6 fw-light d-flex mb-0">
                                            <i :class="['bi', biensImmobiliers?.fumeurAutorise ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger']"
                                                class="me-2">
                                            </i> {{ biensImmobiliers?.fumeurAutorise ? 'Fumeur autorisé' :
                                                'Non-fumeur uniquement' }}
                                        </li>
                                    </ul>

                                    <!-- Alertes COVID/SÉCURITÉ DYNAMIQUES -->
                                    <div v-if="biensImmobiliers?.alertes?.length" class="mt-3">
                                        <div v-for="(alerte, index) in biensImmobiliers.alertes" :key="'alert-' + index"
                                            :class="['rounded-2 p-3 mb-3', getAlertClass(alerte.type)]">
                                            <p class="mb-0" :class="getAlertTextClass(alerte.type)">
                                                <i :class="['bi', getAlertIcon(alerte.type), 'me-2']"></i>
                                                {{ alerte.message }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <!-- Card body END -->
                            </div>
                            <!-- Hotel Policies START -->
                        </div>
                    </div>
                    <!-- Content END -->

                    <!-- Right side content START -->
                    <aside class="col-xl-5 order-xl-2">
                        <div data-sticky data-margin-top="100" data-sticky-for="1199">


                            <!-- Best deal START -->
                            <!-- Best deal START - DYNAMIQUE -->
                            <div v-if="biensImmobiliers?.offreSpeciale" class="mt-4">
                                <h4>{{ biensImmobiliers.offreSpeciale.titre || "Offre du jour" }}</h4>

                                <div class="card shadow rounded-3 overflow-hidden">
                                    <div class="row g-0 align-items-center">
                                        <div class="col-sm-6 col-md-12 col-lg-6"
                                            v-if="biensImmobiliers.offreSpeciale.image">
                                            <img :src="getImageUrl(biensImmobiliers.offreSpeciale.image.id)"
                                                class="card-img rounded-0" :alt="biensImmobiliers.offreSpeciale.titre">
                                        </div>

                                        <div class="col-sm-6 col-md-12 col-lg-6">
                                            <div class="card-body p-3">
                                                <h6 class="card-title">
                                                    <a :href="biensImmobiliers.offreSpeciale.lien || '#'"
                                                        class="stretched-link">
                                                        {{ biensImmobiliers.offreSpeciale.titre }}
                                                    </a>
                                                </h6>
                                                <p class="mb-0">{{ biensImmobiliers.offreSpeciale.description }}</p>
                                                <span v-if="biensImmobiliers.offreSpeciale.reduction"
                                                    class="badge bg-success mt-2">
                                                    -{{ biensImmobiliers.offreSpeciale.reduction }}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Best deal END -->
                        </div>
                    </aside>
                    <!-- Right side content END -->
                </div> <!-- Row END -->
            </div>
        </section>
        <!-- =======================
About hotel END -->
        <FloatingCart />



    </main>
    <!-- **************** MAIN CONTENT END **************** -->
</template>

<script>

import { tns } from 'tiny-slider';
// import { mapActions, mapGetters } from "vuex";
import { ref, onMounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus";
import FloatingCart from "@/components/card/FloatingCart.vue";

import { API_URLS } from "@/config/api";
import { useStore } from 'vuex'
import { useLoading } from "vue-loading-overlay";
import L from 'leaflet';
import GLightbox from 'glightbox'
import 'glightbox/dist/css/glightbox.min.css'
import 'leaflet/dist/leaflet.css'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import roomSlider from "@/components/card/room-slider.vue";
import Avis from "@/components/card/Avis.vue";
export default {
    setup() {
        const store = useStore();
        const loading = useLoading();
        const showGeoModal = ref(false)
        const selectedLat = ref(null)
        const selectedLng = ref(null)
        let mapInstance = null;
        function onClickGeo(biensImmobiliers) {
            if (!biensImmobiliers?.latitude || !biensImmobiliers?.longitude) {
                console.warn("Coordonnées manquantes");
                return;
            }
            selectedLat.value = biensImmobiliers.latitude
            selectedLng.value = biensImmobiliers.longitude
            showGeoModal.value = true
        }
        const notationVisible = ref(false)
        const noteTemp = ref(0)
        const bienSelectionne = ref(null)

        const loadNearbyPOI = async (lat, lng) => {
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
                    // Créer un élément DOM personnalisé si besoin (sinon un marker simple)
                    const popup = new maplibregl.Popup({ offset: 25 }).setText(el.tags.name || el.tags.amenity);

                    new maplibregl.Marker()
                        .setLngLat([el.lon, el.lat])
                        .setPopup(popup)
                        .addTo(mapInstance);
                });
            } catch (error) {
                console.error("Erreur chargement POIs : ", error);
            }
        };


        const initMap = () => {
            nextTick(() => {
                const mapElement = document.getElementById('map');
                if (!mapElement) {
                    console.error("Le conteneur #map n'existe pas dans le DOM !");
                    return;
                }

                if (mapInstance) {
                    mapInstance.remove(); // MapLibre ne supporte pas remove(), donc re-créer l’élément si nécessaire
                    mapElement.innerHTML = '';
                }

                mapInstance = new maplibregl.Map({
                    container: 'map',
                    style: 'https://demotiles.maplibre.org/style.json', // ou ton propre style personnalisé
                    center: [selectedLng.value, selectedLat.value],
                    zoom: 18,
                });

                new maplibregl.Marker()
                    .setLngLat([selectedLng.value, selectedLat.value])
                    .setPopup(new maplibregl.Popup().setText("Localisation du bien"))
                    .addTo(mapInstance);

                mapInstance.on('load', () => {
                    loadNearbyPOI(selectedLat.value, selectedLng.value);
                });

                setTimeout(() => {
                    mapInstance.resize(); // Remplace `invalidateSize` de Leaflet
                }, 300);
            });
        };






        const ouvrirNotation = (bien) => {
            bienSelectionne.value = bien
            noteTemp.value = bien.note || 0
            notationVisible.value = true
        }

        const envoyerNote = async () => {
            try {
                // Exemple d'appel à l'API de notation
                await store.dispatch('biens/noterBien', {
                    id: bienSelectionne.value.id,
                    note: noteTemp.value,
                })

                ElMessage.success("Merci pour votre note !")
                notationVisible.value = false
            } catch (e) {
                ElMessage.error("Erreur lors de l'envoi de la note.")
            }
        }
        return {
            store,
            loading,
            showGeoModal,
            selectedLat,
            selectedLng,
            initMap,
            onClickGeo,
            ouvrirNotation,
            envoyerNote,
            notationVisible,
            noteTemp,
            bienSelectionne,
        }
    },
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
            services: [],
            tabs: [],
            currentTab: null,
            showContractAlert: false,
            biensId: this.$route.params.id,
            biensImmobiliers: null,
            selectedRooms: [],
            isLiked: false,
            isBienSelected: false,
            totalPrice: 0,
            form: {
                nom: "",
                email: "",
                telephone: "",
                message: "",
            },
            errorMessage: null,
            sortOption: '',
            sortedRooms: []
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.initTinySlider();
        });
        this.loadService().then(() => {
            if (this.services && this.services.length > 0) {
                this.currentTab = this.services[0].id;
            }
        });

        this.loadBiensImmobiliersOne();
        // Surveiller les changements du bien dans le store pour garder l'affichage à jour
        this.unwatchBien = this.$store.watch(
            (state) => state.biensImmobiliers.one,
            (newVal) => {
                if (newVal && Number(this.biensId) === Number(newVal.id)) {
                    this.biensImmobiliers = { ...newVal };
                    // garantir que detailsBiensImmobiliers est toujours un tableau
                    const d = this.biensImmobiliers.detailsBiensImmobiliers;
                    if (!Array.isArray(d)) {
                        this.biensImmobiliers.detailsBiensImmobiliers = d ? [d] : [];
                    }
                }
            }
        );
        GLightbox({
            selector: '.glightbox',
            loop: true,
            zoomable: true,
            draggable: true,
            autoplayVideos: true,
            openEffect: 'zoom',
            closeEffect: 'zoom',
            slideEffect: 'slide',
            touchNavigation: true,
            afterSlideLoad: (slide) => {
                console.log('Slide loaded:', slide);
            },
            afterOpen: () => {
                console.log('Lightbox opened');
            },
            afterClose: () => {
                console.log('Lightbox closed');
            },
        });

        const liked = localStorage.getItem(`liked_bien_${this.biensImmobiliers?.id}`);
        if (liked === 'true') this.isLiked = true;
        // 🆕 Vérifier si le bien est déjà sélectionné dans le panier
        this.checkBienSelection();
    },
    computed: {
        shortDescription() {
            if (!this.biensImmobiliers?.description) return '';
            // Extraire les deux premières phrases
            const sentences = this.biensImmobiliers.description.match(/[^\.!\?]+[\.!\?]+/g) || [];
            return sentences.slice(0, 2).join(' ').trim();
        },
        longDescription() {
            if (!this.biensImmobiliers?.description) return '';
            const sentences = this.biensImmobiliers.description.match(/[^\.!\?]+[\.!\?]+/g) || [];
            return sentences.slice(2).join(' ').trim();
        },
        isAuthenticated() {
            return this.$store.getters['auth/isAuthenticated']; // adapte selon ton store
        },
    },
    components: {
        'room-slider': roomSlider,
        'Avis': Avis,
        FloatingCart,
    },
    beforeUnmount() {
        if (this.unwatchBien) this.unwatchBien();
    },
    methods: {
        checkBienSelection() {
            const selectedBiens = this.$store.state.contrats?.selectedBiens || [];
            this.isBienSelected = selectedBiens.some(b => b.id === Number(this.biensId));
        },
        toggleBienSelection() {
            if (!this.isAuthenticated) {
                ElMessage.warning("Vous devez être connecté pour sélectionner un bien.");
                return;
            }

            if (this.isBienSelected) {
                // Retirer du panier
                this.$store.dispatch("contrats/removeFromCart", {
                    id: Number(this.biensId),
                    type: "bien"
                });
                this.isBienSelected = false;
                ElMessage.success("Bien retiré de votre sélection");
            } else {
                // Ajouter au panier
                this.$store.dispatch("contrats/addToCart", {
                    item: this.biensImmobiliers,
                    type: "bien"
                });
                this.isBienSelected = true;
                ElMessage.success("Bien ajouté à votre sélection");
            }
        },
        shareOn(platform) {
            const url = window.location.href;
            const title = this.biensImmobiliers?.nom || 'Bien immobilier';
            let shareUrl = '';

            switch (platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                    break;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        },
        async copyLink() {
            try {
                await navigator.clipboard.writeText(window.location.href);
                ElMessage.success("Lien copié dans le presse-papier !");
            } catch (err) {
                ElMessage.error("Impossible de copier le lien");
            }
        },
        isSelectableRoom(room) {
            if (!room) return false;
            if (typeof room.status === "boolean") return room.status === true;
            if (room.disponible === false || room.available === false || room.isAvailable === false) return false;
            if (typeof room.status === "string") {
                const s = room.status.toLowerCase();
                if (s.includes("en_cours") || s.includes("encours") || s.includes("occupe") || s.includes("occup")) return false;
            }
            return true;
        },
        async handleTabClick(tab) {
            this.currentTab = tab.id;
            await this.loadSousService(tab.id);
        },
        openModal() {
            const modal = new bootstrap.Modal(document.getElementById('mapmodal'));
            modal.show();
        },
        getHighlights() {
            const highlights = [];
            const equipements = this.biensImmobiliers?.equipements;

            if (equipements?.wifi) {
                highlights.push({ icon: 'fa-solid fa-wifi', label: 'WiFi gratuit' });
            }
            if (equipements?.piscine) {
                highlights.push({ icon: 'fa-solid fa-swimming-pool', label: 'Piscine' });
            }
            if (equipements?.climatisation) {
                highlights.push({ icon: 'fa-solid fa-snowflake', label: 'Climatisation' });
            }
            if (equipements?.service24h) {
                highlights.push({ icon: 'fa-solid fa-concierge-bell', label: 'Service 24h/24' });
            }
            if (equipements?.parking) {
                highlights.push({ icon: 'fa-solid fa-square-parking', label: 'Parking' });
            }
            if (equipements?.restaurant) {
                highlights.push({ icon: 'fa-solid fa-utensils', label: 'Restaurant' });
            }

            return highlights;
        },
        async incrementLike(id) {
            // 1. Vérifier si connecté
            if (!this.$store.getters['auth/isAuthenticated']) {
                ElMessage.warning("Vous devez être connecté pour liker.");
                return;
            }
            // 2. Si déjà liké, on bloque
            if (this.isLiked) {
                ElMessage.info("Vous avez déjà liké ce bien.");
                return;
            }
            localStorage.setItem(`liked_bien_${id}`, 'true');
            try {
                // 3. Mettre isLiked à true (pour affichage immédiat)
                this.isLiked = true;

                // 4. Appel API via Vuex
                const data = await this.$store.dispatch("biensImmobiliers/likeBien", id);

                // 5. Mettre à jour le compteur en local
                if (this.biensImmobiliers && this.biensImmobiliers.id === id) {
                    this.biensImmobiliers.nombreJaime = data.likes;
                }

                // 6. Ne PAS remettre isLiked à false ici pour garder le cœur rouge

            } catch (err) {
                console.error("Erreur lors du like :", err);
                ElMessage.error("Impossible de liker pour le moment");
                this.isLiked = false; // rollback si erreur
            }
        },

        async loadBiensImmobiliersOne() {
            try {
                this.biensImmobiliers = await this.$store.dispatch('biensImmobiliers/getOne', this.biensId);
                console.log("Voici le bien immobilier", this.biensImmobiliers);

                // 🔧 Force le champ en tableau s'il est null ou un objet
                if (this.biensImmobiliers) {
                    const d = this.biensImmobiliers.detailsBiensImmobiliers;
                    if (!Array.isArray(d)) {
                        this.biensImmobiliers.detailsBiensImmobiliers = d ? [d] : [];
                    }
                }

            } catch (error) {
                console.error("Erreur lors de la récupération du bien immobilier", error);
            }
        },
        toggleRoomSelection(room) {
            // sécurité côté parent : si la méthode enfant existe on prévient aussi, sinon on fait une vérification locale
            if (typeof this.isSelectableRoom !== 'function' || !this.isSelectableRoom(room)) {
                ElMessage.warning("Impossible de sélectionner : logement occupé ou lié à un contrat actif.");
                return;
            }
            this.showContractAlert = true;
            if (!Array.isArray(this.selectedRooms)) {
                this.selectedRooms = []
            }
            const index = this.selectedRooms.findIndex(r => r.id === room.id);
            if (index !== -1) {
                // Déjà sélectionné, on retire
                this.selectedRooms.splice(index, 1);
                this.totalPrice -= (room.prix || 0) * (room.nombre || 1);
            } else {
                // Nouvelle sélection
                this.selectedRooms.push(room);
                this.totalPrice += (room.prix || 0) * (room.id || 1);
            }
        },
        isSelectableRoom(room) {
            if (!room) return false;
            if (typeof room.status === "boolean") return room.status === true;
            if (room.disponible === false || room.available === false || room.isAvailable === false) return false;
            if (typeof room.status === "string") {
                const s = room.status.toLowerCase();
                if (s.includes("en_cours") || s.includes("encours") || s.includes("occupe") || s.includes("occup")) return false;
            }
            return true;
        },
        initTinySlider() {
            const sliderContainer = document.querySelector('.tiny-slider-inner');
            if (!sliderContainer) return;
            const tnsSlider = tns({
                container: sliderContainer,
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
                autoWidth: this.sliderAutoWidth,
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
                loader.hide();
                this.loadService();
            }
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
        async loadSousService(categoryId) {
            const typeService = ref([]);
            const selectedTypeService = ref(null);
            try {
                const response = await this.$store.dispatch('biensImmobiliers/getAllSousService', categoryId);
                typeService.value = response;
            } catch (error) {
                console.error("Erreur lors du chargement des sous-services :", error);
            }
        },
        formatEnum(value) {
            // Convertit EXEMPLE_ENUM → Exemple Enum
            return value
                .toLowerCase()
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        },
        async loadProduit(item) {
            try {
                const response = await this.$store.dispatch('sousService/getAllProduit', item?.id);
                produits.value = response;
                selectedTypeService.value = item;
                openModalSuivi();
            } catch (error) {
                console.error("Erreur lors du chargement des produits :", error);
            }
        },
        formatCurrency(value) {
            if (!value) return '—';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
            }).format(value);
        },

        async convertCurrency(amount, fromCurrency, toCurrency) {
            if (!amount) return null;
            try {
                const url = `https://v6.exchangerate-api.com/v6/aea6e2851889287522f072cb/latest/${fromCurrency}`;
                const response = await axios.get(url);

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

        // Exemple de méthode pour convertir un prix de bien et le stocker
        async updateConvertedPrice(bien, fromCurrency = 'XOF', toCurrency = 'EUR') {
            const converted = await this.convertCurrency(bien.prix, fromCurrency, toCurrency);
            if (converted) {
                bien.convertedPrice = converted;  // tu peux stocker dans une propriété du bien
            } else {
                bien.convertedPrice = null;
            }
        },
        getImageUrlSafe(fichier) {
            return fichier ? getImageUrl(fichier.id) : '';
        },
        // Si tu veux convertir tous les biens affichés d’un coup :
        async convertAllPrices(toCurrency) {
            const fromCurrency = 'XOF'; // ou dynamique selon ton besoin
            for (const bien of this.biensImmobiliers) {
                await this.updateConvertedPrice(bien, fromCurrency, toCurrency);
            }
        },
        capitalize(value) {
            if (!value) return ''
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        },
        openModalSuivi() {
            const modal = new bootstrap.Modal(document.getElementById('detailModal'));
            modal.show();
        },
        getImageUrl(idfile) {

            // return `https://93.115.20.172:8081/fichier/download/${idfile}`;
            return `${API_URLS.API_BASE}/fichier/download/${idfile}`;

        },
        getAlertClass(type) {
            const classes = {
                danger: 'bg-danger bg-opacity-10',
                warning: 'bg-warning bg-opacity-10',
                info: 'bg-info bg-opacity-10',
                success: 'bg-success bg-opacity-10'
            };
            return classes[type] || 'bg-secondary bg-opacity-10';
        },

        getAlertTextClass(type) {
            const classes = {
                danger: 'text-danger',
                warning: 'text-warning',
                info: 'text-info',
                success: 'text-success'
            };
            return classes[type] || 'text-dark';
        },

        getAlertIcon(type) {
            const icons = {
                danger: 'bi-exclamation-triangle-fill',
                warning: 'bi-exclamation-circle-fill',
                info: 'bi-info-circle-fill',
                success: 'bi-check-circle-fill'
            };
            return icons[type] || 'bi-info-circle';
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }).format(date);
        },
        sortRooms() {
            if (!this.biensImmobiliers?.detailsBiensImmobiliers) return;

            const rooms = [...this.biensImmobiliers.detailsBiensImmobiliers];

            switch (this.sortOption) {
                case 'recent':
                    rooms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                case 'popular':
                    rooms.sort((a, b) => (b.vues || 0) - (a.vues || 0));
                    break;
                case 'price_asc':
                    rooms.sort((a, b) => (a.prix || 0) - (b.prix || 0));
                    break;
                case 'price_desc':
                    rooms.sort((a, b) => (b.prix || 0) - (a.prix || 0));
                    break;
                case 'rating':
                    rooms.sort((a, b) => (b.note || 0) - (a.note || 0));
                    break;
            }

            this.biensImmobiliers.detailsBiensImmobiliers = rooms;
        }

    },
};
</script>
<style scoped>
.room-options-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    /* espace entre les cartes */
    justify-content: center;
    /* centrer les cartes */
}

.leaflet-container-map {
    height: 600px;
    /* ou 100%, selon besoin */
    width: 100%;
}

.wide-card {
    min-width: 250px;
    max-height: 150px;
    /* ou 450px, 500px selon votre besoin */
    max-width: 100%;
    /* Empêche de dépasser le conteneur */
}

.room-card {
    flex: 1 1 calc(33.333% - 40px);
    /* 3 cartes par ligne avec marge */
    max-width: 400px;
    background-color: #1e1e1e;
    border-radius: 12px;
    padding: 16px;
    color: white;
}

.like-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    transition: background-color 0.3s ease;
}

.like-btn .fa-heart {
    transition: transform 0.3s ease, color 0.3s ease;
}

.like-btn.clicked .fa-heart {
    transform: scale(1.3);
    color: red;
}

.like-count {
    transition: all 0.3s ease;
}

.z-3 {
    z-index: 1145;
    /* supérieur à Bootstrap modals */
}
</style>
