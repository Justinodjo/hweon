<!-- ========================================= -->
<!-- SUPPLIER_ROLES - Supplier Dashboard -->
<!-- ========================================= -->
<template id="supplier-sidebar">
    <main>
        <nav class="navbar sidebar navbar-expand-xl navbar-light">
            <div class="d-flex align-items-center">
                <a class="navbar-brand" href="/supplier_dashboard">
                    <img class="light-mode-item navbar-brand-item" src="@/assets/images/logo.svg" alt="logo">
                    <img class="dark-mode-item navbar-brand-item" src="@/assets/images/logo-light.svg" alt="logo">
                </a>
            </div>

            <div class="offcanvas offcanvas-start flex-row custom-scrollbar h-100" data-bs-backdrop="true" tabindex="-1"
                id="offcanvasSidebar">
                <div class="offcanvas-body sidebar-content d-flex flex-column pt-4">
                    <ul class="navbar-nav flex-column" id="navbar-sidebar">
                        <li class="nav-item"><a href="/supplier_dashboard" class="nav-link active">Mon Dashboard</a>
                        </li>

                        <!-- Work Orders & Interventions -->
                        <li class="nav-item ms-2 my-2">Interventions</li>

                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="collapse" href="#collapseInterventions" role="button"
                                aria-expanded="false">
                                <i class="fas fa-wrench me-2"></i>Mes Interventions
                            </a>
                            <ul class="nav collapse flex-column" id="collapseInterventions"
                                data-bs-parent="#navbar-sidebar">
                                <li class="nav-item"><a class="nav-link" href="/interventions/pending">Demandes en
                                        Attente</a></li>
                                <li class="nav-item"><a class="nav-link" href="/interventions/scheduled">Interventions
                                        Programmées</a></li>
                                <li class="nav-item"><a class="nav-link" href="/interventions/in-progress">En Cours</a>
                                </li>
                                <li class="nav-item"><a class="nav-link" href="/interventions/completed">Terminées</a>
                                </li>
                            </ul>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="collapse" href="#collapseSchedule" role="button"
                                aria-expanded="false">
                                <i class="fas fa-calendar-alt me-2"></i>Planning
                            </a>
                            <ul class="nav collapse flex-column" id="collapseSchedule" data-bs-parent="#navbar-sidebar">
                                <li class="nav-item"><a class="nav-link" href="/schedule/week">Planning Semaine</a></li>
                                <li class="nav-item"><a class="nav-link" href="/schedule/month">Planning Mensuel</a>
                                </li>
                                <li class="nav-item"><a class="nav-link"
                                        href="/schedule/availability">Disponibilités</a></li>
                            </ul>
                        </li>

                        <!-- Financial Management -->
                        <li class="nav-item ms-2 my-2">Facturation</li>

                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="collapse" href="#collapseBilling" role="button"
                                aria-expanded="false">
                                <i class="fas fa-file-invoice me-2"></i>Devis & Factures
                            </a>
                            <ul class="nav collapse flex-column" id="collapseBilling" data-bs-parent="#navbar-sidebar">
                                <li class="nav-item"><a class="nav-link" href="/quotes/create">Créer Devis</a></li>
                                <li class="nav-item"><a class="nav-link" href="/quotes/pending">Devis en Attente</a>
                                </li>
                                <li class="nav-item"><a class="nav-link" href="/invoices/create">Créer Facture</a></li>
                                <li class="nav-item"><a class="nav-link" href="/invoices/sent">Factures Envoyées</a>
                                </li>
                            </ul>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="collapse" href="#collapsePayments" role="button"
                                aria-expanded="false">
                                <i class="fas fa-euro-sign me-2"></i>Paiements
                            </a>
                            <ul class="nav collapse flex-column" id="collapsePayments" data-bs-parent="#navbar-sidebar">
                                <li class="nav-item"><a class="nav-link" href="/payments/received">Paiements Reçus</a>
                                </li>
                                <li class="nav-item"><a class="nav-link" href="/payments/pending">En Attente</a></li>
                                <li class="nav-item"><a class="nav-link" href="/payments/overdue">Impayés</a></li>
                                <li class="nav-item"><a class="nav-link" href="/reports/earnings">Mes Revenus</a></li>
                            </ul>
                        </li>

                        <!-- Client Management -->
                        <li class="nav-item ms-2 my-2">Clients</li>

                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="collapse" href="#collapseClients" role="button"
                                aria-expanded="false">
                                <i class="fas fa-users me-2"></i>Gestion Clients
                            </a>
                            <ul class="nav collapse flex-column" id="collapseClients" data-bs-parent="#navbar-sidebar">
                                <li class="nav-item"><a class="nav-link" href="/clients/managers">Gestionnaires</a></li>
                                <li class="nav-item"><a class="nav-link" href="/clients/properties">Propriétés
                                        Assignées</a></li>
                                <li class="nav-item"><a class="nav-link" href="/clients/contacts">Contacts</a></li>
                            </ul>
                        </li>

                        <li class="nav-item"><a class="nav-link" href="/reviews/received"><i
                                    class="fas fa-star me-2"></i>Évaluations Reçues</a></li>

                        <!-- Documentation & Reports -->
                        <li class="nav-item ms-2 my-2">Documentation</li>

                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="collapse" href="#collapseDocuments" role="button"
                                aria-expanded="false">
                                <i class="fas fa-folder me-2"></i>Mes Documents
                            </a>
                            <ul class="nav collapse flex-column" id="collapseDocuments"
                                data-bs-parent="#navbar-sidebar">
                                <li class="nav-item"><a class="nav-link"
                                        href="/documents/certifications">Certifications</a></li>
                                <li class="nav-item"><a class="nav-link" href="/documents/insurance">Assurances</a></li>
                                <li class="nav-item"><a class="nav-link" href="/documents/technical">Docs Techniques</a>
                                </li>
                                <li class="nav-item"><a class="nav-link" href="/reports/interventions">Rapports
                                        Interventions</a></li>
                            </ul>
                        </li>

                        <!-- Communication -->
                        <li class="nav-item ms-2 my-2">Communication</li>
                        <li class="nav-item"><a class="nav-link" href="/messages/inbox"><i
                                    class="fas fa-envelope me-2"></i>Messages</a></li>
                        <li class="nav-item"><a class="nav-link" href="/notifications/work"><i
                                    class="fas fa-bell me-2"></i>Notifications Travaux</a></li>

                        <!-- Profile & Settings -->
                        <li class="nav-item ms-2 my-2">Profil</li>
                        <li class="nav-item"><a class="nav-link" href="/profile/company"><i
                                    class="fas fa-building me-2"></i>Informations Entreprise</a></li>
                        <li class="nav-item"><a class="nav-link" href="/profile/services"><i
                                    class="fas fa-tools me-2"></i>Mes Services</a></li>
                        <li class="nav-item"><a class="nav-link" href="/profile/rates"><i
                                    class="fas fa-money-bill me-2"></i>Mes Tarifs</a></li>
                    </ul>

                    <div class="d-flex align-items-center justify-content-between text-primary-hover mt-auto p-3">
                        <a class="h6 fw-light mb-0 text-body" href="/logout" data-bs-toggle="tooltip"
                            data-bs-placement="top" aria-label="Sign out">
                            <i class="fa-solid fa-arrow-right-from-bracket"></i> Log out
                        </a>
                        <a class="h6 mb-0 text-body" href="/supplier_dashboard/profile" data-bs-toggle="tooltip"
                            data-bs-placement="top" aria-label="Profile">
                            <i class="bi bi-person-fill"></i>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    </main>
</template>