<template>
    <div class="rental-management-container">
        <!-- Header avec stats -->
        <div class="stats-header">
            <div class="header-content">
                <h2 class="main-title">Gestion des Documents</h2>
                <p class="subtitle">Suivez et gérez vos documents contractuels</p>
            </div>
            <div class="stats-grid">
                <div class="stat-card active-stat">
                    <div class="stat-icon">📑</div>
                    <div class="stat-content">
                        <span class="stat-number">{{ activeDocs.length }}</span>
                        <span class="stat-label">Actifs</span>
                    </div>
                </div>
                <div class="stat-card canceled-stat">
                    <div class="stat-icon">🗑</div>
                    <div class="stat-content">
                        <span class="stat-number">{{ archivedDocs.length }}</span>
                        <span class="stat-label">Archivés</span>
                    </div>
                </div>
                <div class="stat-card completed-stat">
                    <div class="stat-icon">📜</div>
                    <div class="stat-content">
                        <span class="stat-number">{{ versionsDocs.length }}</span>
                        <span class="stat-label">Versions</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Onglets -->
        <div class="tabs-navigation">
            <button v-for="tab in tabsWithCounts" :key="tab.id"
                :class="['tab-button', { active: activeTab === tab.id }]" @click="switchTab(tab.id)">
                <i :class="tab.icon"></i>
                <span>{{ tab.label }}</span>
                <span class="tab-badge" :class="tab.badgeClass">{{ tab.count }}</span>
            </button>
        </div>

        <!-- Contenu onglets -->
        <div class="tab-content-wrapper">
            <!-- Actifs -->
            <div v-show="activeTab === 'active'" class="tab-content">
                <div class="section-header">
                    <h3 class="section-title">Documents actifs</h3>
                    <div class="section-meta">{{ activeDocs.length }} document(s)</div>
                </div>

                <div v-if="activeDocs.length === 0" class="empty-state">
                    <div class="empty-icon">📂</div>
                    <h4>Aucun document actif</h4>
                    <p>Les documents en cours apparaîtront ici</p>
                </div>

                <div v-else class="reservations-grid">
                    <div v-for="(doc, index) in activeDocs" :key="`doc-${index}`" class="reservation-card ongoing-card">
                        <div class="card-header">
                            <div class="property-info">
                                <div class="property-avatar">
                                    <i class="bi bi-file-earmark-text"></i>
                                </div>
                                <div class="property-details">
                                    <h4 class="property-name">{{ doc.typeDocument }}</h4>
                                    <div class="property-meta">
                                        <span>ID: {{ doc.id }}</span>
                                        <span>Contrat: {{ doc.contrats?.id || 'N/A' }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="status-badge status-ongoing">Actif</div>
                        </div>

                        <div class="card-footer">
                            <div class="footer-info">
                                <div class="info-item">
                                    <i class="bi bi-pen"></i>
                                    <span>Signature: {{ doc.signature || 'Non signé' }}</span>
                                </div>
                            </div>
                            <button class="action-btn" @click="openModal(doc)">
                                <i class="bi bi-eye"></i>
                                Voir
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Archivés -->
            <div v-show="activeTab === 'archived'" class="tab-content">
                <div class="section-header">
                    <h3 class="section-title">Documents archivés</h3>
                    <div class="section-meta">{{ archivedDocs.length }} document(s)</div>
                </div>

                <div v-if="archivedDocs.length === 0" class="empty-state">
                    <div class="empty-icon">🗄</div>
                    <h4>Aucun document archivé</h4>
                    <p>Les documents archivés apparaîtront ici</p>
                </div>

                <div v-else class="reservations-grid">
                    <div v-for="doc in archivedDocs" :key="doc.id" class="reservation-card canceled-card">
                        <div class="card-header">
                            <div class="property-info">
                                <div class="property-avatar canceled">
                                    <i class="bi bi-archive"></i>
                                </div>
                                <div class="property-details">
                                    <h4 class="property-name">{{ doc.typeDocument }}</h4>
                                    <div class="property-meta">
                                        <span>ID: {{ doc.id }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="status-badge status-canceled">Archivé</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Versions -->
            <div v-show="activeTab === 'versions'" class="tab-content">
                <div class="section-header">
                    <h3 class="section-title">Versions de documents</h3>
                    <div class="section-meta">{{ versionsDocs.length }} version(s)</div>
                </div>

                <div v-if="versionsDocs.length === 0" class="empty-state-special">
                    <div class="empty-content">
                        <div class="empty-illustration">
                            <div class="illustration-icon">📜</div>
                            <div class="illustration-bg"></div>
                        </div>
                        <h4>Aucune version trouvée</h4>
                        <p>Les différentes versions de vos documents apparaîtront ici</p>
                    </div>
                </div>

                <div v-else class="reservations-grid">
                    <div v-for="version in versionsDocs" :key="version.id" class="reservation-card completed-card">
                        <div class="card-header">
                            <div class="property-info">
                                <div class="property-avatar completed">
                                    <i class="bi bi-file-earmark-check"></i>
                                </div>
                                <div class="property-details">
                                    <h4 class="property-name">Version {{ version.numero }}</h4>
                                    <div class="property-meta">
                                        <span>ID: {{ version.id }}</span>
                                        <span>Date: {{ formatDate(version.dateCreation) }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="status-badge status-completed">Version</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="docModal" tabindex="-1" aria-labelledby="docModalLabel" aria-hidden="true"
            ref="docModal">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="docModalLabel">
                            {{ selectedDoc?.typeDocument }}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>ID :</strong> {{ selectedDoc?.id }}</p>
                        <p><strong>Contrat lié :</strong> {{ selectedDoc?.contrats?.id }}</p>
                        <p>
                            <strong>Signature :</strong>
                            {{ selectedDoc?.signature || "Non signé" }}
                        </p>

                        <h6 class="mt-3">📂 Fichiers liés :</h6>
                        <ul class="list-group">
                            <li v-for="fichier in selectedDoc?.fichiers" :key="fichier.id"
                                class="list-group-item d-flex justify-content-between align-items-center">
                                {{ fichier.nom }}
                                <button class="btn btn-sm btn-outline-primary" @click="downloadFile(fichier)">
                                    <i class="bi bi-download"></i> Télécharger
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success" @click="signDoc" :disabled="!!selectedDoc?.signature">
                            <i class="bi bi-pencil"></i>
                            {{ selectedDoc?.signature ? "Déjà signé" : "Signer" }}
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "DocumentsManagement",
    data() {
        return {
            activeTab: "active",
            selectedDoc: null,
            docModalInstance: null,
            // --- MOCK DATA ---
            activeDocs: [
                {
                    id: 1,
                    typeDocument: "Contrat de location",
                    signature: "Jean Dupont",
                    contrats: { id: 101 },
                    fichiers: [
                        { id: 201, nom: "contrat_location.pdf", taille: "120 Ko" },
                        { id: 202, nom: "etat_des_lieux.pdf", taille: "80 Ko" },
                    ],
                },
                {
                    id: 2,
                    typeDocument: "Quittance de loyer",
                    signature: null,
                    contrats: { id: 102 },
                    fichiers: [{ id: 203, nom: "quittance_janvier.pdf", taille: "50 Ko" }],
                },
            ],
            archivedDocs: [
                { id: 3, typeDocument: "Contrat résilié", signature: "Marie Curie" },
            ],
            versionsDocs: [
                { id: 4, numero: 1, dateCreation: "2024-01-15" },
                { id: 5, numero: 2, dateCreation: "2024-06-20" },
            ],
            tabs: [
                {
                    id: "active",
                    label: "Actifs",
                    icon: "bi bi-file-earmark-text",
                    badgeClass: "badge-ongoing",
                },
                {
                    id: "archived",
                    label: "Archivés",
                    icon: "bi bi-archive",
                    badgeClass: "badge-canceled",
                },
                {
                    id: "versions",
                    label: "Versions",
                    icon: "bi bi-layers",
                    badgeClass: "badge-completed",
                },
            ],
        };
    },
    computed: {
        tabsWithCounts() {
            return this.tabs.map((tab) => ({
                ...tab,
                count: this.getTabCount(tab.id),
            }));
        },
    },
    mounted() {
        this.docModalInstance = new window.bootstrap.Modal(this.$refs.docModal);
    },
    methods: {
        switchTab(tabId) {
            this.activeTab = tabId;
        },
        getTabCount(tabId) {
            switch (tabId) {
                case "active":
                    return this.activeDocs.length;
                case "archived":
                    return this.archivedDocs.length;
                case "versions":
                    return this.versionsDocs.length;
                default:
                    return 0;
            }
        },
        formatDate(dateString) {
            if (!dateString) return "—";
            return new Date(dateString).toLocaleDateString("fr-FR");
        },
        openModal(doc) {
            this.selectedDoc = doc;
            this.docModalInstance.show();
        },
        signDoc() {
            if (this.selectedDoc) {
                this.selectedDoc.signature = "Utilisateur connecté"; // Simulation
                alert("Document signé avec succès !");
            }
        },
        downloadFile(fichier) {
            alert("Téléchargement de " + fichier.nom);
            // ⚡️ Ici tu mettras l'appel API pour récupérer le vrai fichier
        },
    },
};
</script>

<style scoped>
.rental-management-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Header avec statistiques */
.stats-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;
    color: white;
    position: relative;
    overflow: hidden;
}

.stats-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="15" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="80" r="10" fill="rgba(255,255,255,0.1)"/></svg>');
    opacity: 0.5;
}

.header-content {
    position: relative;
    z-index: 2;
    text-align: center;
    margin-bottom: 30px;
}

.main-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
}

.subtitle {
    font-size: 16px;
    opacity: 0.9;
}

.stats-grid {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
}

.stat-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    transition: transform 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
}

.stat-icon {
    font-size: 24px;
    margin-bottom: 12px;
}

.stat-number {
    display: block;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 14px;
    opacity: 0.9;
}

/* Navigation par onglets */
.tabs-navigation {
    display: flex;
    background: white;
    border-radius: 16px;
    padding: 8px;
    margin-bottom: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    gap: 4px;
}

.tab-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    border: none;
    background: transparent;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #64748b;
    font-weight: 500;
}

.tab-button.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    transform: scale(1.02);
}

.tab-button:not(.active):hover {
    background: #f8fafc;
    color: #475569;
}

.tab-badge {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
}

.tab-button:not(.active) .tab-badge {
    background: #e2e8f0;
    color: #64748b;
}

/* Contenu des onglets */
.tab-content-wrapper {
    position: relative;
}

.tab-content {
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.section-title {
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
}

.section-meta {
    color: #64748b;
    font-size: 14px;
}

/* États vides */
.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #64748b;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 20px;
}

.empty-state h4 {
    font-size: 18px;
    color: #475569;
    margin-bottom: 12px;
}

.empty-state-special {
    text-align: center;
    padding: 80px 20px;
}

.empty-content {
    max-width: 400px;
    margin: 0 auto;
}

.empty-illustration {
    position: relative;
    display: inline-block;
    margin-bottom: 30px;
}

.illustration-icon {
    font-size: 64px;
    position: relative;
    z-index: 2;
}

.illustration-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    border-radius: 50%;
    z-index: 1;
}

.cta-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    color: white;
}

/* Grille des réservations */
.reservations-grid {
    display: grid;
    gap: 24px;
}

.reservation-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #f1f5f9;
    transition: all 0.3s ease;
    position: relative;
}

.reservation-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.ongoing-card:hover {
    border-color: rgba(102, 126, 234, 0.3);
}

.canceled-card:hover {
    border-color: rgba(239, 68, 68, 0.3);
}

.completed-card:hover {
    border-color: rgba(34, 197, 94, 0.3);
}

/* En-tête de carte */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
}

.property-info {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    flex: 1;
}

.property-avatar {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    flex-shrink: 0;
}

.property-avatar.canceled {
    background: linear-gradient(135deg, #ef4444, #dc2626);
}

.property-avatar.completed {
    background: linear-gradient(135deg, #22c55e, #16a34a);
}

.property-name {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
}

.property-meta {
    display: flex;
    gap: 12px;
    font-size: 14px;
    color: #64748b;
}

.reservation-id {
    font-weight: 600;
}

/* Badges de statut */
.status-badge {
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-ongoing {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
}

.status-canceled {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
}

.status-completed {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
}

/* Section services */
.services-section {
    margin: 20px 0;
}

.services-title {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 12px;
}

.services-table {
    background: #f8fafc;
    border-radius: 12px;
    overflow: hidden;
}

.table-header {
    display: grid;
    grid-template-columns: 1fr 100px;
    gap: 16px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
}

.table-row {
    display: grid;
    grid-template-columns: 1fr 100px;
    gap: 16px;
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
    align-items: center;
}

.table-row:last-child {
    border-bottom: none;
}

.service-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.service-id {
    font-size: 12px;
    color: #667eea;
    font-weight: 600;
}

.service-name {
    color: #374151;
    font-weight: 500;
}

.service-price {
    font-weight: 700;
    color: #059669;
    text-align: right;
}

/* Pied de carte */
.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #f1f5f9;
}

.footer-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #64748b;
}

.info-item i {
    color: #667eea;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.action-btn.secondary {
    background: #f1f5f9;
    color: #475569;
}

.action-btn.secondary:hover {
    background: #e2e8f0;
    box-shadow: 0 4px 15px rgba(71, 85, 105, 0.2);
}

.cancellation-reason {
    font-style: italic;
    color: #ef4444;
}

/* Loader */
.loading-overlay {
    position: fixed;
    top: 0;
}
</style>