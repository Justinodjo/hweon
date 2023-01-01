<template>
  <div>
    <!-- Alerte de validation en cours -->
    <div v-if="checking" class="validation-alert checking">
      <div class="alert-icon">
        <div class="spinner-border spinner-border-sm" role="status">
          <span class="visually-hidden">Vérification...</span>
        </div>
      </div>
      <div class="alert-content">
        <strong>Vérification en cours...</strong>
        <p class="mb-0">Nous vérifions la disponibilité des biens sélectionnés</p>
      </div>
    </div>

    <!-- Alerte d'erreurs -->
    <div v-if="errors.length > 0" class="validation-alert error">
      <div class="alert-icon">
        <i class="bi bi-exclamation-triangle-fill"></i>
      </div>
      <div class="alert-content">
        <strong>Biens non disponibles</strong>
        <ul class="error-list">
          <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
        </ul>
        <button 
          @click="$emit('retry')" 
          class="btn btn-sm btn-outline-danger mt-2">
          <i class="bi bi-arrow-clockwise me-1"></i>
          Réessayer
        </button>
      </div>
    </div>

    <!-- Alerte d'avertissements -->
    <div v-if="warnings.length > 0" class="validation-alert warning">
      <div class="alert-icon">
        <i class="bi bi-exclamation-circle-fill"></i>
      </div>
      <div class="alert-content">
        <strong>Attention</strong>
        <ul class="warning-list">
          <li v-for="(warning, index) in warnings" :key="index">{{ warning }}</li>
        </ul>
      </div>
    </div>

    <!-- Alerte de succès -->
    <div v-if="checked && errors.length === 0" class="validation-alert success">
      <div class="alert-icon">
        <i class="bi bi-check-circle-fill"></i>
      </div>
      <div class="alert-content">
        <strong>Disponibilité confirmée</strong>
        <p class="mb-0">Tous les biens sont disponibles pour la période sélectionnée</p>
      </div>
    </div>

    <!-- Liste des biens avec statut -->
    <div v-if="showDetails && biensStatus.length > 0" class="biens-status-list">
      <h6 class="status-title">Statut des biens :</h6>
      <div 
        v-for="(status, index) in biensStatus" 
        :key="index" 
        class="bien-status-item"
        :class="status.disponible ? 'disponible' : 'indisponible'">
        <div class="status-icon">
          <i :class="status.disponible ? 'bi bi-check-circle-fill text-success' : 'bi bi-x-circle-fill text-danger'"></i>
        </div>
        <div class="status-info">
          <strong>{{ status.nom }}</strong>
          <small v-if="!status.disponible" class="text-danger d-block">
            {{ status.message }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ValidationAlert',
  props: {
    checking: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    },
    errors: {
      type: Array,
      default: () => []
    },
    warnings: {
      type: Array,
      default: () => []
    },
    biensStatus: {
      type: Array,
      default: () => []
    },
    showDetails: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.validation-alert {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.validation-alert.checking {
  background: #e7f3ff;
  border-left: 4px solid #007bff;
}

.validation-alert.error {
  background: #ffe6e6;
  border-left: 4px solid #dc3545;
}

.validation-alert.warning {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
}

.validation-alert.success {
  background: #d4edda;
  border-left: 4px solid #28a745;
}

.alert-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: flex-start;
  padding-top: 0.25rem;
}

.checking .alert-icon {
  color: #007bff;
}

.error .alert-icon {
  color: #dc3545;
}

.warning .alert-icon {
  color: #ffc107;
}

.success .alert-icon {
  color: #28a745;
}

.alert-content {
  flex: 1;
}

.alert-content strong {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.alert-content p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.error-list,
.warning-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
}

.error-list li,
.warning-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.error-list li:last-child,
.warning-list li:last-child {
  border-bottom: none;
}

.biens-status-list {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.status-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bien-status-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
}

.bien-status-item:last-child {
  margin-bottom: 0;
}

.bien-status-item.disponible {
  border-left: 3px solid #28a745;
}

.bien-status-item.indisponible {
  border-left: 3px solid #dc3545;
  background: #fff5f5;
}

.status-icon {
  font-size: 1.25rem;
}

.status-info {
  flex: 1;
}

.status-info strong {
  display: block;
  color: #333;
  margin-bottom: 0.25rem;
}

.spinner-border {
  width: 1.25rem;
  height: 1.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .validation-alert {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .alert-icon {
    font-size: 1.25rem;
  }
}
</style>