<template>
    <main class="py-5">
        <div class="container">
            <!-- Écran 1: Vue d'ensemble du patrimoine -->
            <div class="screen">
                <!-- Header -->
                <div class="screen-header text-center p-4">
                    <h2 class="screen-title">🏢 Vue d'Ensemble du Patrimoine</h2>
                    <p class="screen-subtitle">Tableau de bord central pour tous vos biens immobiliers</p>
                </div>

                <!-- Statistiques -->
                <div class="row row-cols-1 row-cols-md-4 g-4 mb-5">
                    <div class="col">
                        <div class="stat-card p-4 text-center">
                            <div class="stat-number">24</div>
                            <div>Propriétés</div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="stat-card p-4 text-center">
                            <div class="stat-number">892K€</div>
                            <div>Valeur totale</div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="stat-card p-4 text-center">
                            <div class="stat-number">95%</div>
                            <div>Taux d'occupation</div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="stat-card p-4 text-center">
                            <div class="stat-number">12.4K€</div>
                            <div>Revenus mensuels</div>
                        </div>
                    </div>
                </div>

                <!-- Features -->
                <div class="row row-cols-1 row-cols-md-3 g-4">
                    <!-- Carte Interactive -->
                    <div class="col">
                        <div class="feature-card p-4">
                            <div class="feature-icon d-flex align-items-center justify-content-center mb-3"
                                style="background: var(--success-gradient);">
                                <i class="bi bi-geo-alt"></i>
                            </div>
                            <h3 class="feature-title">Carte Interactive</h3>
                            <p class="feature-description">Visualisez tous vos biens sur une carte interactive avec des
                                indicateurs de performance en temps réel.</p>
                            <ul class="feature-list list-unstyled">
                                <li><i class="bi bi-check-circle-fill"></i> Localisation précise</li>
                                <li><i class="bi bi-check-circle-fill"></i> Filtres avancés</li>
                                <li><i class="bi bi-check-circle-fill"></i> Vue satellite/plan</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Analytics Avancées -->
                    <div class="col">
                        <div class="feature-card p-4">
                            <div class="feature-icon d-flex align-items-center justify-content-center mb-3"
                                style="background: var(--warning-gradient);">
                                <i class="bi bi-graph-up"></i>
                            </div>
                            <h3 class="feature-title">Analytics Avancées</h3>
                            <p class="feature-description">Tableaux de bord personnalisables avec KPIs, tendances et
                                prévisions basées sur l'IA.</p>
                            <ul class="feature-list list-unstyled">
                                <li><i class="bi bi-check-circle-fill"></i> ROI par propriété</li>
                                <li><i class="bi bi-check-circle-fill"></i> Prédictions marché</li>
                                <li><i class="bi bi-check-circle-fill"></i> Rapports automatisés</li>
                            </ul>
                        </div>
                    </div>

                    <!-- État des Propriétés -->
                    <div class="col">
                        <div class="feature-card p-4">
                            <div class="feature-icon d-flex align-items-center justify-content-center mb-3"
                                style="background: var(--info-gradient);">
                                <i class="bi bi-house-check"></i>
                            </div>
                            <h3 class="feature-title">État des Propriétés</h3>
                            <p class="feature-description">Surveillance en temps réel de l'état de vos biens avec
                                alertes automatiques.</p>
                            <ul class="feature-list list-unstyled">
                                <li><i class="bi bi-check-circle-fill"></i> Inspections programmées</li>
                                <li><i class="bi bi-check-circle-fill"></i> Maintenance préventive</li>
                                <li><i class="bi bi-check-circle-fill"></i> Photos horodatées</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<style>
.feature-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
    border-radius: 20px;
    padding: 30px;
    border: 2px solid rgba(102, 126, 234, 0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 80px rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.3);
}
</style>