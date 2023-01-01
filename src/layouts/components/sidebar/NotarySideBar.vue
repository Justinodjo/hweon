<!-- ========================================= -->
<!-- NOTARY_ROLES - Notary Dashboard -->
<!-- ========================================= -->
<template id="notary-sidebar">
    <main>
        <nav class="navbar sidebar navbar-expand-xl navbar-light">
            <div class="d-flex align-items-center">
                <a class="navbar-brand" href="/notary_dashboard">
                    <img class="light-mode-item navbar-brand-item" src="@/assets/images/logo.svg" alt="logo">
                    <img class="dark-mode-item navbar-brand-item" src="@/assets/images/logo-light.svg" alt="logo">
                </a>
            </div>

            <div class="offcanvas offcanvas-start flex-row custom-scrollbar h-100" data-bs-backdrop="true" tabindex="-1"
                id="offcanvasSidebar">
                <div class="offcanvas-body sidebar-content d-flex flex-column pt-4">
                    <ul class="navbar-nav flex-column" id="navbar-sidebar">
                        <li class="nav-item"><a href="/notary_dashboard" class="nav-link active">Dashboard Notaire</a>
                        </li>

                        <!-- Files & Cases -->
                        <li class="nav-item ms-2 my-2">Dossiers</li>

                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="collapse" href="#collapseFiles" role="button"
                                aria-expanded="false">
                                <i class="fas fa-briefcase me-2"></i>Dossiers en Cours
                            </a>
                            <ul class="nav collapse flex-column" id="collapseFiles" data-bs-parent="#navbar-sidebar">
                                <li class="nav-item"><a class="nav-link" href="/files/new">Nouveaux Dossiers</a></li>
                                <li class="nav-item"><a class="nav-link" href="/files/in-progress">En Cours</a></li>
                                <li class="nav-item"><a class="nav-link" href="/files/pending-signature">Attente
                                        Signature</a></li>
                                <li class="nav-item"><a class="nav-link" href="/files/completed">Terminés</a></li>
                            </ul>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="collapse" href="#collapseTransactions" role="button"
                                aria-expanded="false">
                                <i class="fas fa-handshake me-2"></i>Transactions Immobilières
                            </a>
                            <ul class="nav collapse flex-column" id="collapseTransactions"
                                data-bs-parent="#navbar-sidebar">
                                <li class="nav-item"><a class="nav-link" href="/transactions/sales">Ventes</a></li>
                                <li class="nav-item"><a class="nav-link" href="/transactions/purchases">Achats</a></li>
                                <li class="nav-item"><a class="nav-link" href="/transactions/donations">Donations</a>
                                </li>
                                <li class="nav-item"><a class="nav-link"
                                        href="/transactions/successions">Successions</a></li>
                            </ul>
                        </li>

                        <!-- Legal Documents -->
                        <li class="nav-item ms-2 my-2">Documentation Légale</li>

                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="collapse" href="#collapseLegalDocs" role="button"
                                aria-expanded="false">
                                <i class="fas fa-gavel me-2"></i>Actes & Documents
                            </a>
                            <ul class="nav collapse flex-column" id="collapseLegalDocs"
                                data-bs-parent="#navbar-sidebar">
                                <li class="nav-item"><a class="nav-link" href="/documents/deeds">Actes Notariés</a></li>
                                <li class="nav-item"><a class="nav-link" href="/documents/contracts">Contrats</a></li>
                                <li class="nav-item"><a class="nav-link" href="/documents/templates">Modèles d'Actes</a>
                                </li>
                                <li class="nav-item"><a class="nav-link" href="/documents/archives">Archives</a></li>
                            </ul>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="collapse" href="#collapseVerifications" role="button"
                                aria-expanded="false">
                                <i class="fas fa-search me-2"></i>Vérifications Légales
                            </a>
                            <ul class="nav collapse flex-column" id="collapseVerifications"
                                data-bs-parent="#navbar-sidebar">
                                <li class="nav-item"><a class="nav-link" href="/verifications/property-titles">Titres de
                                        Propriété</a></li>
                                <li class="nav-item"><a class="nav-link" href="/verifications/legal-status">Statuts
                                        Juridiques</a></li>
                                <li class="nav-item"><a class="nav-link" href="/verifications/liens">Sûretés &
                                        Hypothèques</a></li>
                            </ul>
                        </li>

                        <!-- Clients & Parties -->
                        <li class="nav-item ms-2 my-2">Clients</li>

                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="collapse" href="#collapseClients" role="button"
                                aria-expanded="false">
                                <i class="fas fa-users me-2"></i>Parties & Clients
                            </a>
                            <ul class="nav collapse flex-column" id="collapseClients" data-bs-parent="#navbar-sidebar">
                                <li class="nav-item"><a class="nav-link" href="/clients/individuals">Particuliers</a>
                                </li>
                                <li class="nav-item"><a class="nav-link" href="/clients/companies">Entreprises</a></li>
                                <li class="nav-item"><a class="nav-link" href="/clients/contact-info">Informations
                                        Contact</a></li>
                            </ul>
                        </li>

                        <!-- Schedule & Appointments -->
                        <li class="nav-item ms-2 my-2">Planning</li>

                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="collapse" href="#collapseSchedule" role="button"
                                aria-expanded="false">
                                <i class="fas fa-calendar-alt me-2"></i>Rendez-vous
                            </a>
                            <ul class="nav collapse flex-column" id="collapseSchedule" data-bs-parent="#navbar-sidebar">
                                <li class="nav-item"><a class="nav-link" href="/appointments/upcoming">RDV à Venir</a>
                                </li>
                                <li class="nav-item"><a class="nav-link" href="/appointments/signatures">Signatures
                                        Programmées</a></li>
                                <li class="nav-item"><a class="nav-link"
                                        href="/appointments/consultations">Consultations</a></li>
                            </ul>
                        </li>

                        <!-- Compliance & Regulations -->
                        <li class="nav-item ms-2 my-2">Conformité</li>

                        <li class="nav-item"><a class="nav-link" href="/compliance/regulations"><i
                                    class="fas fa-balance-scale me-2"></i>Réglementation</a></li>
                        <li class="nav-item"><a class="nav-link" href="/compliance/reports"><i
                                    class="fas fa-clipboard-check me-2"></i>Rapports Conformité</a></li>
                        <li class="nav-item"><a class="nav-link" href="/compliance/updates"><i
                                    class="fas fa-bell me-2"></i>Mises à Jour Légales</a></li>

                        <!-- Communication -->
                        <li class="nav-item ms-2 my-2">Communication</li>
                        <li class="nav-item"><a class="nav-link" href="/messages/clients"><i
                                    class="fas fa-envelope me-2"></i>Messages Clients</a></li>
                        <li class="nav-item"><a class="nav-link" href="/communications/official"><i
                                    class="fas fa-stamp me-2"></i>Correspondance Officielle</a></li>
                    </ul>

                    <div class="d-flex align-items-center justify-content-between text-primary-hover mt-auto p-3">
                        <a class="h6 fw-light mb-0 text-body" href="/logout" data-bs-toggle="tooltip"
                            data-bs-placement="top" aria-label="Sign out">
                            <i class="fa-solid fa-arrow-right-from-bracket"></i> Log out
                        </a>
                        <a class="h6 mb-0 text-body" href="/notary_dashboard/profile" data-bs-toggle="tooltip"
                            data-bs-placement="top" aria-label="Profile">
                            <i class="bi bi-person-fill"></i>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    </main>
</template>