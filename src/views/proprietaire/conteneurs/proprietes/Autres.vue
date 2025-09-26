<template>
    <main>
        <!-- =======================
    Content START -->
        <section class="pt-0">
            <div class="container vstack gap-4">
                <!-- Title START -->
                <div class="row">
                    <div class="col-12">
                        <h1 class="fs-4 mb-0">
                            <i class="bi bi-journals fa-fw me-1"></i>Mes Biens Immobiliers
                        </h1>
                    </div>
                </div>
                <!-- Title END -->

                <!-- Listing table START -->
                <div class="row">
                    <div class="col-12">
                        <div class="card border">
                            <!-- Card header -->
                            <div class="card-header border-bottom">
                                <h5 class="card-header-title">
                                    Mes Listings
                                    <span
                                        class="badge bg-primary bg-opacity-10 text-primary ms-2">{{ biensImmobiliers.length
                                        }} Items</span>
                                </h5>
                            </div>

                            <!-- Card body START -->
                            <div class="card-body vstack gap-3">
                                <div class="card border p-2" v-for="(bien, index) in biensImmobiliers" :key="bien.id">
                                    <div class="row g-4">
                                        <!-- Card img -->
                                        <div class="col-md-3 col-lg-2">
                                            <img :src="getImageUrl(bien?.fichier.id)" class="card-img rounded-2"
                                                alt="Image du bien" />
                                        </div>

                                        <!-- Card body -->
                                        <div class="col-md-9 col-lg-10">
                                            <div class="card-body position-relative d-flex flex-column p-0 h-100">
                                                <!-- Buttons -->
                                                <div class="list-inline-item dropdown position-absolute top-0 end-0">
                                                    <a href="#" class="btn btn-sm btn-round btn-light" role="button"
                                                        :id="'dropdownAction' + index" data-bs-toggle="dropdown"
                                                        aria-expanded="false">
                                                        <i class="bi bi-three-dots-vertical"></i>
                                                    </a>
                                                    <ul class="dropdown-menu dropdown-menu-end min-w-auto shadow rounded"
                                                        :aria-labelledby="'dropdownAction' + index">
                                                        <li>
                                                            <a class="dropdown-item" href="#"><i
                                                                    class="bi bi-info-circle me-1"></i>Report</a>
                                                        </li>
                                                        <li>
                                                            <a class="dropdown-item" href="#"><i
                                                                    class="bi bi-slash-circle me-1"></i>Disable</a>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <!-- Title -->
                                                <h5 class="card-title mb-0 me-5">
                                                    <a href="#">{{ bien.nom }}</a>
                                                </h5>
                                                <small><i class="bi bi-geo-alt me-2"></i>{{ bien.adresse }}</small>

                                                <!-- Price and Buttons -->
                                                <div
                                                    class="d-sm-flex justify-content-sm-between align-items-center mt-3 mt-md-auto">
                                                    <div class="d-flex align-items-center">
                                                        <h5 class="fw-bold mb-0 me-1">{{ formatCurrency(bien.prix) }}
                                                        </h5>
                                                        <span class="mb-0 me-2">/jour</span>
                                                    </div>
                                                    <div class="hstack gap-2 mt-3 mt-sm-0">
                                                        <a href="#" class="btn btn-sm btn-primary mb-0">
                                                            <i class="bi bi-pencil-square fa-fw me-1"></i>Modifier
                                                        </a>
                                                        <a href="#" class="btn btn-sm btn-danger mb-0">
                                                            <i class="bi bi-trash3 fa-fw me-1"></i>Supprimer
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Card body END -->
                        </div>
                    </div>
                </div>
                <!-- Listing table END -->
            </div>
        </section>
        <!-- =======================
    Content END -->
    </main>
</template>