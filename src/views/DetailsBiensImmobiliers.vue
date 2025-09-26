<template>
    <!-- **************** MAIN CONTENT START **************** -->
    <main>

        <!-- =======================
Search START -->
        <section class="py-9 py-sm-10">
            <div class="container">
                <!-- Offcanvas button for search -->
                <button class="btn btn-primary d-sm-none w-100 mb-0" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasEditsearch" aria-controls="offcanvasEditsearch"><i
                        class="bi bi-pencil-square me-2"></i>Edit Search</button>

                <!-- Search with offcanvas START -->
                <div class="offcanvas-sm offcanvas-top" tabindex="-1" id="offcanvasEditsearch"
                    aria-labelledby="offcanvasEditsearchLabel">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title" id="offcanvasEditsearchLabel">Edit search</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"
                            data-bs-target="#offcanvasEditsearch" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body p-2">
                        <div class="bg-light p-4 rounded w-100">
                            <form class="row g-4">
                                <!-- Location -->
                                <div class="col-md-6 col-lg-4">
                                    <div class="form-size-lg form-fs-md">
                                        <!-- Select input -->
                                        <label class="form-label">Location</label>
                                        <select class="form-select js-choice" data-search-enabled="true">
                                            <option value="">Select location</option>
                                            <option selected>San Jacinto, USA</option>
                                            <option>North Dakota, Canada</option>
                                            <option>West Virginia, Paris</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Check in -->
                                <div class="col-md-6 col-lg-3">
                                    <!-- Date input -->
                                    <div class="form-fs-md">
                                        <label class="form-label">Check in - out</label>
                                        <input type="text" class="form-control form-control-lg flatpickr"
                                            data-mode="range" placeholder="Select date" value="19 Sep to 28 Sep">
                                    </div>
                                </div>

                                <!-- Guest -->
                                <div class="col-md-6 col-lg-3">
                                    <div class="form-fs-md">
                                        <!-- Dropdown input -->
                                        <div class="w-100">
                                            <label class="form-label">Guests & rooms</label>
                                            <div class="dropdown guest-selector me-2">
                                                <input type="text"
                                                    class="form-guest-selector form-control form-control-lg selection-result"
                                                    value="2 Guests 1 Room" id="dropdownguest"
                                                    data-bs-auto-close="outside" data-bs-toggle="dropdown">

                                                <!-- dropdown items -->
                                                <ul class="dropdown-menu guest-selector-dropdown"
                                                    aria-labelledby="dropdownguest">
                                                    <!-- Adult -->
                                                    <li class="d-flex justify-content-between">
                                                        <div>
                                                            <h6 class="mb-0">Adults</h6>
                                                            <small>Ages 13 or above</small>
                                                        </div>

                                                        <div class="hstack gap-1 align-items-center">
                                                            <button type="button"
                                                                class="btn btn-link adult-remove p-0 mb-0"><i
                                                                    class="bi bi-dash-circle fs-5 fa-fw"></i></button>
                                                            <h6 class="guest-selector-count mb-0 adults">2</h6>
                                                            <button type="button"
                                                                class="btn btn-link adult-add p-0 mb-0"><i
                                                                    class="bi bi-plus-circle fs-5 fa-fw"></i></button>
                                                        </div>
                                                    </li>

                                                    <!-- Divider -->
                                                    <li class="dropdown-divider"></li>

                                                    <!-- Child -->
                                                    <li class="d-flex justify-content-between">
                                                        <div>
                                                            <h6 class="mb-0">Child</h6>
                                                            <small>Ages 13 below</small>
                                                        </div>

                                                        <div class="hstack gap-1 align-items-center">
                                                            <button type="button"
                                                                class="btn btn-link child-remove p-0 mb-0"><i
                                                                    class="bi bi-dash-circle fs-5 fa-fw"></i></button>
                                                            <h6 class="guest-selector-count mb-0 child">0</h6>
                                                            <button type="button"
                                                                class="btn btn-link child-add p-0 mb-0"><i
                                                                    class="bi bi-plus-circle fs-5 fa-fw"></i></button>
                                                        </div>
                                                    </li>

                                                    <!-- Divider -->
                                                    <li class="dropdown-divider"></li>

                                                    <!-- Rooms -->
                                                    <li class="d-flex justify-content-between">
                                                        <div>
                                                            <h6 class="mb-0">Rooms</h6>
                                                            <small>Max room 8</small>
                                                        </div>

                                                        <div class="hstack gap-1 align-items-center">
                                                            <button type="button"
                                                                class="btn btn-link room-remove p-0 mb-0"><i
                                                                    class="bi bi-dash-circle fs-5 fa-fw"></i></button>
                                                            <h6 class="guest-selector-count mb-0 rooms">1</h6>
                                                            <button type="button"
                                                                class="btn btn-link room-add p-0 mb-0"><i
                                                                    class="bi bi-plus-circle fs-5 fa-fw"></i></button>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Button -->
                                <div class="col-md-6 col-lg-2 mt-md-auto">
                                    <a class="btn btn-lg btn-primary w-100 mb-0" href="hotel-detail.html#"><i
                                            class="bi bi-search fa-fw"></i>Search</a>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
                <!-- Search with offcanvas END -->
            </div>
        </section>
        <!-- =======================
Search END -->

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
                                    <!-- Share button -->
                                    <a href="hotel-detail.html#" class="btn btn-sm btn-light px-2" role="button"
                                        id="dropdownShare" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa-solid fa-fw fa-share-alt"></i>
                                    </a>
                                    <!-- dropdown button -->
                                    <ul class="dropdown-menu dropdown-menu-end min-w-auto shadow rounded"
                                        aria-labelledby="dropdownShare">
                                        <li><a class="dropdown-item" href="hotel-detail.html#"><i
                                                    class="fab fa-twitter-square me-2"></i>Twitter</a></li>
                                        <li><a class="dropdown-item" href="hotel-detail.html#"><i
                                                    class="fab fa-facebook-square me-2"></i>Facebook</a></li>
                                        <li><a class="dropdown-item" href="hotel-detail.html#"><i
                                                    class="fab fa-linkedin me-2"></i>LinkedIn</a></li>
                                        <li><a class="dropdown-item" href="hotel-detail.html#"><i
                                                    class="fa-solid fa-copy me-2"></i>Copy link</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!-- Title and button END -->

                <!-- Alert box START -->
                <div class="alert alert-danger alert-dismissible d-flex justify-content-between align-items-center fade show mb-4 rounded-3 pe-2"
                    role="alert">
                    <div class="d-flex">
                        <span class="alert-heading h5 mb-0 me-2"><i class="bi bi-exclamation-octagon-fill"></i></span>
                        <span><strong class="alert-heading me-2">Covid Policy:</strong>You may require to present an
                            RT-PCR negative test report at the hotel</span>
                    </div>
                    <button type="button" class="btn btn-link text-primary-hover pb-0 text-end" data-bs-dismiss="alert"
                        aria-label="Close"><i class="bi bi-x-lg"></i></button>
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
                                v-for="(detail, index) in biensImmobiliers?.detailsBiensImmobiliers || []"
                                :key="'detail-' + index" v-if="detail?.fichier">
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
                                    backgroundImage: `url(${getImageUrl(biensImmobiliers.detailsBiensImmobiliers[0]?.fichier?.id)})`,
                                    backgroundPosition: 'center left',
                                    backgroundSize: 'cover'
                                }">
                                    <!-- Background overlay -->
                                    <div class="bg-overlay bg-dark opacity-7"></div>

                                    <!-- Popup Images -->
                                    <a v-for="(detail, index) in biensImmobiliers.detailsBiensImmobiliers"
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
                            <span>Price Start at</span>
                            <h4 class="card-title mb-0">{{ this.biensImmobiliers?.prix }}</h4>
                        </div>
                        <div>
                            <h6 class="fw-normal mb-0">1 room per night</h6>
                            <small>+ $285 taxes & fees</small>
                        </div>
                    </div>

                    <!-- Rating -->
                    <ul class="list-inline mb-2">
                        <li class="list-inline-item me-1 h6 fw-light mb-0"><i class="bi bi-arrow-right me-2"></i>4.5
                        </li>
                        <li class="list-inline-item me-0 small"><i class="fa-solid fa-star text-warning"></i></li>
                        <li class="list-inline-item me-0 small"><i class="fa-solid fa-star text-warning"></i></li>
                        <li class="list-inline-item me-0 small"><i class="fa-solid fa-star text-warning"></i></li>
                        <li class="list-inline-item me-0 small"><i class="fa-solid fa-star text-warning"></i></li>
                        <li class="list-inline-item me-0 small"><i class="fa-solid fa-star-half-alt text-warning"></i>
                        </li>
                    </ul>

                    <p class="h6 fw-light mb-4"><i class="bi bi-arrow-right me-2"></i>Free breakfast
                        available</p>

                    <!-- Button -->
                    <div class="d-grid">
                        <a href="hotel-detail.html#room-options" class="btn btn-lg btn-primary-soft mb-0">View 10 Rooms
                            Options</a>
                    </div>
                </div>
                <!-- Book now END -->
                <div class="row g-4 g-xl-5">
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
                                        <div class="icon-lg bg-light h5 rounded-2" data-bs-toggle="tooltip"
                                            data-bs-placement="top" title="Free wifi">
                                            <i class="fa-solid fa-wifi"></i>
                                        </div>
                                        <div class="icon-lg bg-light h5 rounded-2" data-bs-toggle="tooltip"
                                            data-bs-placement="top" title="Swimming Pool">
                                            <i class="fa-solid fa-swimming-pool"></i>
                                        </div>
                                        <div class="icon-lg bg-light h5 rounded-2" data-bs-toggle="tooltip"
                                            data-bs-placement="top" title="Central AC">
                                            <i class="fa-solid fa-snowflake"></i>
                                        </div>
                                        <div class="icon-lg bg-light h5 rounded-2" data-bs-toggle="tooltip"
                                            data-bs-placement="top" title="Free Service">
                                            <i class="fa-solid fa-concierge-bell"></i>
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
                                                class="bi bi-patch-check-fill text-success me-2"></i>📌 En un clic : vos
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
                                                        <i class="bi bi-patch-check-fill text-success me-2"></i> la fin
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
                                                        <i class="bi bi-patch-check-fill text-success me-2"></i> l’envoi
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
                                        <h3 class="mb-2 mb-sm-0">Room Options</h3>

                                        <div class="col-sm-4">
                                            <form class="form-control-bg-light">
                                                <select class="form-select form-select-sm js-choice border-0">
                                                    <option value="">Select Option</option>
                                                    <option>Recently search</option>
                                                    <option>Most popular</option>
                                                    <option>Top rated</option>
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
                                            <room-slider v-for="room in biensImmobiliers?.detailsBiensImmobiliers"
                                                :key="room.id" :room="room" @room-selected="toggleRoomSelection" />
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
                                    <h3 class="mb-0">Hotel Policies</h3>
                                </div>

                                <!-- Card body START -->
                                <div class="card-body pt-4 p-0">
                                    <!-- List -->
                                    <ul class="list-group list-group-borderless mb-2">
                                        <li class="list-group-item d-flex">
                                            <i class="bi bi-check-circle-fill me-2"></i>This is a family farmhouse,
                                            hence we request you to not indulge.
                                        </li>
                                        <li class="list-group-item d-flex">
                                            <i class="bi bi-check-circle-fill me-2"></i>Drinking and smoking within
                                            controlled limits are permitted at the farmhouse but please do not create a
                                            mess or ruckus at the house.
                                        </li>
                                        <li class="list-group-item d-flex">
                                            <i class="bi bi-check-circle-fill me-2"></i>Drugs and intoxicating illegal
                                            products are banned and not to be brought to the house or consumed.
                                        </li>
                                        <li class="list-group-item d-flex">
                                            <i class="bi bi-x-circle-fill me-2"></i>For any update, the customer shall
                                            pay applicable cancellation/modification charges.
                                        </li>
                                    </ul>

                                    <!-- List -->
                                    <ul class="list-group list-group-borderless mb-2">
                                        <li class="list-group-item h6 fw-light d-flex mb-0">
                                            <i class="bi bi-arrow-right me-2"></i>Check-in: 1:00 pm - 9:00 pm
                                        </li>
                                        <li class="list-group-item h6 fw-light d-flex mb-0">
                                            <i class="bi bi-arrow-right me-2"></i>Check out: 11:00 am
                                        </li>
                                        <li class="list-group-item h6 fw-light d-flex mb-0">
                                            <i class="bi bi-arrow-right me-2"></i>Self-check-in with building staff
                                        </li>
                                        <li class="list-group-item h6 fw-light d-flex mb-0">
                                            <i class="bi bi-arrow-right me-2"></i>No pets
                                        </li>
                                        <li class="list-group-item h6 fw-light d-flex mb-0">
                                            <i class="bi bi-arrow-right me-2"></i>No parties or events
                                        </li>
                                        <li class="list-group-item h6 fw-light d-flex mb-0">
                                            <i class="bi bi-arrow-right me-2"></i>Smoking is allowed
                                        </li>
                                    </ul>

                                    <!-- Important note -->
                                    <div class="bg-danger bg-opacity-10 rounded-2 p-3 mb-3">
                                        <p class="mb-0 text-danger">During the COVID-19 pandemic, all hosts and guests
                                            must review and follow Booking social distancing and other COVID-19-related
                                            guidelines.</p>
                                    </div>
                                    <div class="bg-danger bg-opacity-10 rounded-2 p-3">
                                        <p class="mb-0 text-danger">Smoke alarm not reported — The host hasn't reported
                                            a smoke alarm on the property. We suggest bringing a portable detector for
                                            your trip.</p>
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
                            <div class="mt-4 d-none d-xl-block">
                                <h4>Today's Best Deal</h4>

                                <div class="card shadow rounded-3 overflow-hidden">
                                    <div class="row g-0 align-items-center">
                                        <!-- Image -->
                                        <div class="col-sm-6 col-md-12 col-lg-6">
                                            <img src="../assets/images/offer/04.jpg" class="card-img rounded-0" alt="">
                                        </div>

                                        <!-- Title and content -->
                                        <div class="col-sm-6 col-md-12 col-lg-6">
                                            <div class="card-body p-3">
                                                <h6 class="card-title"><a href="offer-detail.html"
                                                        class="stretched-link">Travel Plan</a></h6>
                                                <p class="mb-0">Get up to $10,000 for lifetime limits</p>
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

    </main>
    <!-- **************** MAIN CONTENT END **************** -->
</template>

<script>

import { tns } from 'tiny-slider';
// import { mapActions, mapGetters } from "vuex";
import { ref, onMounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus";
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
            biensId: this.$route.params.id,
            biensImmobiliers: null,
            isLiked: false,
            form: {
                nom: "",
                email: "",
                telephone: "",
                message: "",
            },
            errorMessage: null,
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
        'Avis': Avis
    },
    methods: {
        async handleTabClick(tab) {
            this.currentTab = tab.id;
            await this.loadSousService(tab.id);
        },
        openModal() {
            const modal = new bootstrap.Modal(document.getElementById('mapmodal'));
            modal.show();
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
            const index = this.selectedRooms.findIndex(r => r.id === room.id);
            if (index !== -1) {
                // Déjà sélectionné, on retire
                this.selectedRooms.splice(index, 1);
                this.totalPrice -= (room.prix || 0) * (room.nombre || 1);
            } else {
                // Nouvelle sélection
                this.selectedRooms.push(room);
                this.totalPrice += (room.prix || 0) * (room.nombre || 1);
            }
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
        async updateConvertedPrice(bien, fromCurrency = 'EUR', toCurrency = 'USD') {
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
            const fromCurrency = 'EUR'; // ou dynamique selon ton besoin
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
</style>
