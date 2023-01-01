<template>
    <main>
        <section class="pt-0">
            <div class="container vstack gap-4">
                <!-- Title -->
                <div class="row">
                    <div class="col-12">
                        <h1 class="fs-4 mb-0">
                            <i class="bi bi-calendar-week fa-fw me-1"></i>Planning des Interventions
                        </h1>
                        <p class="text-muted mb-0">Planification et suivi des interventions de maintenance</p>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="row g-4">
                    <div class="col-md-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">Aujourd'hui</h6>
                                    <h2 class="mb-0 text-primary">{{ stats.aujourdhui }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-calendar-day me-1"></i>Interventions
                                    </p>
                                </div>
                                <div class="bg-primary bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-calendar-day fs-4 text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">Cette Semaine</h6>
                                    <h2 class="mb-0 text-info">{{ stats.semaine }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-calendar-week me-1"></i>Planifiées
                                    </p>
                                </div>
                                <div class="bg-info bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-calendar-week fs-4 text-info"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">En Retard</h6>
                                    <h2 class="mb-0 text-danger">{{ stats.enRetard }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-exclamation-triangle me-1"></i>À traiter
                                    </p>
                                </div>
                                <div class="bg-danger bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-exclamation-triangle fs-4 text-danger"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">Prochaines</h6>
                                    <h2 class="mb-0 text-success">{{ stats.prochaines }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-calendar-check me-1"></i>À venir
                                    </p>
                                </div>
                                <div class="bg-success bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-calendar-check fs-4 text-success"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- View Mode Toggle and Calendar Navigation -->
                <div class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                    <!-- View Mode -->
                                    <div class="btn-group" role="group">
                                        <button type="button" class="btn btn-outline-primary"
                                            :class="{ active: viewMode === 'calendar' }" @click="viewMode = 'calendar'">
                                            <i class="bi bi-calendar3 me-1"></i>Calendrier
                                        </button>
                                        <button type="button" class="btn btn-outline-primary"
                                            :class="{ active: viewMode === 'timeline' }" @click="viewMode = 'timeline'">
                                            <i class="bi bi-list-task me-1"></i>Timeline
                                        </button>
                                        <button type="button" class="btn btn-outline-primary"
                                            :class="{ active: viewMode === 'gantt' }" @click="viewMode = 'gantt'">
                                            <i class="bi bi-diagram-3 me-1"></i>Gantt
                                        </button>
                                    </div>

                                    <!-- Calendar Navigation -->
                                    <div class="d-flex align-items-center gap-3">
                                        <button class="btn btn-outline-secondary btn-sm" @click="previousPeriod">
                                            <i class="bi bi-chevron-left"></i>
                                        </button>
                                        <div class="text-center">
                                            <h6 class="mb-0">{{ currentPeriodLabel }}</h6>
                                            <small class="text-muted">{{ currentYearLabel }}</small>
                                        </div>
                                        <button class="btn btn-outline-secondary btn-sm" @click="nextPeriod">
                                            <i class="bi bi-chevron-right"></i>
                                        </button>
                                        <button class="btn btn-outline-primary btn-sm" @click="goToToday">
                                            Aujourd'hui
                                        </button>
                                    </div>

                                    <!-- Actions -->
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-primary btn-sm" @click="showScheduleModal = true">
                                            <i class="bi bi-plus-circle me-1"></i>Planifier
                                        </button>
                                        <button class="btn btn-info btn-sm" @click="exportPlanning">
                                            <i class="bi bi-download me-1"></i>Exporter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Calendar View -->
                <div v-if="viewMode === 'calendar'" class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-body p-0">
                                <div class="calendar-container">
                                    <!-- Days Header -->
                                    <div class="calendar-header">
                                        <div v-for="day in daysOfWeek" :key="day" class="calendar-day-header">
                                            {{ day }}
                                        </div>
                                    </div>

                                    <!-- Calendar Grid -->
                                    <div class="calendar-grid">
                                        <div v-for="(day, index) in calendarDays" :key="index" class="calendar-day"
                                            :class="{
                                                'other-month': !day.isCurrentMonth,
                                                'today': day.isToday,
                                                'has-events': day.interventions.length > 0,
                                                'weekend': day.isWeekend
                                            }">
                                            <div class="day-number">{{ day.date }}</div>

                                            <div v-if="day.interventions.length > 0" class="day-events">
                                                <div v-for="intervention in day.interventions.slice(0, 3)"
                                                    :key="intervention.id" class="event-item"
                                                    :class="getEventClass(intervention)"
                                                    @click="viewIntervention(intervention)">
                                                    <div class="event-time">{{ formatTime(intervention.dateTraitement)
                                                    }}</div>
                                                    <div class="event-title">{{ intervention.typeIntervention }}</div>
                                                    <div class="event-location">
                                                        <i class="bi bi-geo-alt"></i>
                                                        {{ intervention.biensImmobilers?.nom }}
                                                    </div>
                                                </div>
                                                <div v-if="day.interventions.length > 3" class="more-events"
                                                    @click="showDayDetails(day)">
                                                    +{{ day.interventions.length - 3 }} plus
                                                </div>
                                            </div>

                                            <div v-else class="empty-day">
                                                <button class="btn-add-event" @click="quickSchedule(day.fullDate)">
                                                    <i class="bi bi-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Timeline View -->
                <div v-if="viewMode === 'timeline'" class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-body">
                                <div class="timeline-container">
                                    <div v-for="(group, date) in groupedByDate" :key="date" class="timeline-group">
                                        <div class="timeline-date">
                                            <div class="date-badge">
                                                <div class="date-day">{{ formatDay(date) }}</div>
                                                <div class="date-month">{{ formatMonth(date) }}</div>
                                            </div>
                                        </div>

                                        <div class="timeline-items">
                                            <div v-for="intervention in group" :key="intervention.id"
                                                class="timeline-item" :class="getTimelineItemClass(intervention)">
                                                <div class="timeline-marker" :class="getMarkerClass(intervention)">
                                                </div>
                                                <div class="timeline-content">
                                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                                        <div>
                                                            <h6 class="mb-1">
                                                                <span class="badge"
                                                                    :class="getPrioriteBadgeClass(intervention.priorite)">
                                                                    {{ intervention.priorite }}
                                                                </span>
                                                                {{ intervention.typeIntervention }}
                                                            </h6>
                                                            <p class="text-muted small mb-1">
                                                                <i class="bi bi-building me-1"></i>
                                                                {{ intervention.biensImmobilers?.nom }}
                                                            </p>
                                                            <p class="text-muted small mb-0">
                                                                <i class="bi bi-clock me-1"></i>
                                                                {{ formatTime(intervention.dateTraitement) }}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span class="badge"
                                                                :class="getStatusBadgeClass(intervention.statut)">
                                                                {{ getStatusLabel(intervention.statut) }}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p class="mb-2 text-truncate">{{ intervention.description }}</p>
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <small class="text-muted">
                                                            Coût: {{ formatCurrency(intervention.estimationCout) }}
                                                        </small>
                                                        <div class="btn-group btn-group-sm">
                                                            <button class="btn btn-outline-primary"
                                                                @click="viewIntervention(intervention)">
                                                                <i class="bi bi-eye"></i>
                                                            </button>
                                                            <button class="btn btn-outline-success"
                                                                @click="editSchedule(intervention)">
                                                                <i class="bi bi-pencil"></i>
                                                            </button>
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
                </div>

                <!-- Gantt View -->
                <div v-if="viewMode === 'gantt'" class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-body">
                                <div class="gantt-container">
                                    <div class="gantt-header">
                                        <div class="gantt-task-header">Interventions</div>
                                        <div class="gantt-timeline-header">
                                            <div v-for="day in ganttDays" :key="day.date" class="gantt-day-header"
                                                :class="{ 'today': day.isToday, 'weekend': day.isWeekend }">
                                                <div class="day-name">{{ day.dayName }}</div>
                                                <div class="day-number">{{ day.dayNumber }}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="gantt-body">
                                        <div v-for="intervention in sortedInterventions" :key="intervention.id"
                                            class="gantt-row">
                                            <div class="gantt-task-cell">
                                                <div class="task-info">
                                                    <div class="task-title">{{ intervention.typeIntervention }}</div>
                                                    <small class="text-muted">{{ intervention.biensImmobilers?.nom
                                                    }}</small>
                                                </div>
                                            </div>
                                            <div class="gantt-timeline-cell">
                                                <div class="gantt-bars">
                                                    <div class="gantt-bar" :class="getGanttBarClass(intervention)"
                                                        :style="getGanttBarStyle(intervention)"
                                                        @click="viewIntervention(intervention)">
                                                        <span class="bar-label">{{ intervention.typeIntervention
                                                        }}</span>
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

                <!-- Upcoming Interventions List -->
                <div class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-header border-bottom">
                                <h5 class="card-header-title">
                                    Interventions à Venir
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ upcomingInterventions.length }}
                                    </span>
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="list-group list-group-flush">
                                    <div v-if="upcomingInterventions.length === 0" class="text-center py-4">
                                        <i class="bi bi-calendar-x fs-1 text-muted d-block mb-2"></i>
                                        <p class="text-muted mb-0">Aucune intervention planifiée</p>
                                    </div>
                                    <div v-else v-for="intervention in upcomingInterventions.slice(0, 5)"
                                        :key="intervention.id"
                                        class="list-group-item d-flex justify-content-between align-items-center">
                                        <div class="d-flex align-items-center gap-3">
                                            <div class="intervention-icon" :class="getIconClass(intervention.priorite)">
                                                <i class="bi bi-tools"></i>
                                            </div>
                                            <div>
                                                <h6 class="mb-1">{{ intervention.typeIntervention }}</h6>
                                                <p class="text-muted small mb-0">
                                                    <i class="bi bi-building me-1"></i>{{
                                                        intervention.biensImmobilers?.nom }}
                                                    <span class="mx-2">•</span>
                                                    <i class="bi bi-calendar me-1"></i>{{
                                                        formatDate(intervention.dateTraitement) }}
                                                    <span class="mx-2">•</span>
                                                    <i class="bi bi-clock me-1"></i>{{
                                                        formatTime(intervention.dateTraitement) }}
                                                </p>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-center gap-2">
                                            <span class="badge" :class="getPrioriteBadgeClass(intervention.priorite)">
                                                {{ intervention.priorite }}
                                            </span>
                                            <span class="badge" :class="getStatusBadgeClass(intervention.statut)">
                                                {{ getStatusLabel(intervention.statut) }}
                                            </span>
                                            <button class="btn btn-sm btn-outline-primary"
                                                @click="viewIntervention(intervention)">
                                                <i class="bi bi-eye"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Modal Planification -->
        <div v-if="showScheduleModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);"
            tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Planifier une Intervention</h5>
                        <button type="button" class="btn-close" @click="closeScheduleModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveSchedule">
                            <div class="row g-3">
                                <div class="col-12">
                                    <label class="form-label">Intervention existante</label>
                                    <select v-model="scheduleForm.interventionId" class="form-select">
                                        <option value="">Créer une nouvelle intervention</option>
                                        <option v-for="intervention in unscheduledInterventions" :key="intervention.id"
                                            :value="intervention.id">
                                            {{ intervention.typeIntervention }} - {{ intervention.biensImmobilers?.nom
                                            }}
                                        </option>
                                    </select>
                                </div>

                                <div v-if="!scheduleForm.interventionId" class="col-md-6">
                                    <label class="form-label">Type d'intervention <span
                                            class="text-danger">*</span></label>
                                    <select v-model="scheduleForm.typeIntervention" class="form-select" required>
                                        <option value="">Sélectionner</option>
                                        <option value="Plomberie">Plomberie</option>
                                        <option value="Électricité">Électricité</option>
                                        <option value="Climatisation">Climatisation</option>
                                        <option value="Peinture">Peinture</option>
                                        <option value="Menuiserie">Menuiserie</option>
                                    </select>
                                </div>

                                <div v-if="!scheduleForm.interventionId" class="col-md-6">
                                    <label class="form-label">Bien concerné <span class="text-danger">*</span></label>
                                    <select v-model="scheduleForm.biensImmobilersId" class="form-select" required>
                                        <option value="">Sélectionner un bien</option>
                                        <option value="1">Appartement A1 - Cocody Angré</option>
                                        <option value="2">Villa B2 - Plateau Dokui</option>
                                        <option value="3">Bureau C3 - Marcory Zone 4</option>
                                    </select>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Date <span class="text-danger">*</span></label>
                                    <input type="date" v-model="scheduleForm.date" class="form-control" required>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Heure <span class="text-danger">*</span></label>
                                    <input type="time" v-model="scheduleForm.time" class="form-control" required>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Priorité <span class="text-danger">*</span></label>
                                    <select v-model="scheduleForm.priorite" class="form-select" required>
                                        <option value="HAUTE">Haute</option>
                                        <option value="MOYENNE">Moyenne</option>
                                        <option value="BASSE">Basse</option>
                                    </select>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Durée estimée (heures)</label>
                                    <input type="number" v-model.number="scheduleForm.duree" class="form-control"
                                        min="0.5" step="0.5" placeholder="2">
                                </div>

                                <div v-if="!scheduleForm.interventionId" class="col-12">
                                    <label class="form-label">Description</label>
                                    <textarea v-model="scheduleForm.description" class="form-control" rows="3"
                                        placeholder="Décrivez l'intervention..."></textarea>
                                </div>

                                <div class="col-12">
                                    <label class="form-label">Notes</label>
                                    <textarea v-model="scheduleForm.notes" class="form-control" rows="2"
                                        placeholder="Notes supplémentaires..."></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeScheduleModal">
                            Annuler
                        </button>
                        <button type="button" class="btn btn-primary" @click="saveSchedule">
                            <i class="bi bi-check-circle me-1"></i>Planifier
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Détails Intervention -->
        <div v-if="selectedIntervention" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);"
            tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Détails de l'intervention
                            <span class="badge ms-2" :class="getStatusBadgeClass(selectedIntervention.statut)">
                                {{ getStatusLabel(selectedIntervention.statut) }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedIntervention = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="text-muted small">Type</label>
                                <p class="fw-bold">{{ selectedIntervention.typeIntervention }}</p>
                            </div>
                            <div class="col-md-6">
                                <label class="text-muted small">Priorité</label>
                                <p>
                                    <span class="badge" :class="getPrioriteBadgeClass(selectedIntervention.priorite)">
                                        {{ selectedIntervention.priorite }}
                                    </span>
                                </p>
                            </div>
                            <div class="col-md-6">
                                <label class="text-muted small">Date planifiée</label>
                                <p class="fw-bold">{{ formatDateTime(selectedIntervention.dateTraitement) }}</p>
                            </div>
                            <div class="col-md-6">
                                <label class="text-muted small">Bien</label>
                                <p class="fw-bold">{{ selectedIntervention.biensImmobilers?.nom }}</p>
                            </div>
                            <div class="col-12">
                                <label class="text-muted small">Description</label>
                                <p>{{ selectedIntervention.description }}</p>
                            </div>
                            <div class="col-md-6">
                                <label class="text-muted small">Coût estimé</label>
                                <p class="fw-bold text-primary">{{ formatCurrency(selectedIntervention.estimationCout)
                                }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedIntervention = null">
                            Fermer
                        </button>
                        <button type="button" class="btn btn-success" @click="editSchedule(selectedIntervention)">
                            <i class="bi bi-pencil me-1"></i>Modifier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'PlanningInterventions',

    data() {
        return {
            loading: true,
            viewMode: 'calendar',
            currentDate: new Date(),

            stats: {
                aujourdhui: 0,
                semaine: 0,
                enRetard: 0,
                prochaines: 0
            },

            interventions: [],
            selectedIntervention: null,
            showScheduleModal: false,

            scheduleForm: {
                interventionId: '',
                typeIntervention: '',
                biensImmobilersId: '',
                date: '',
                time: '',
                priorite: 'MOYENNE',
                duree: 2,
                description: '',
                notes: ''
            },

            daysOfWeek: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
        };
    },

    computed: {
        ...mapGetters('interventions', {
            allInterventions: 'all'
        }),

        currentPeriodLabel() {
            const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
            return months[this.currentDate.getMonth()];
        },

        currentYearLabel() {
            return this.currentDate.getFullYear();
        },

        calendarDays() {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startDayOfWeek = firstDay.getDay() || 7;

            const days = [];
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Jours du mois précédent
            for (let i = startDayOfWeek - 1; i > 0; i--) {
                const date = new Date(year, month, -i + 1);
                days.push({
                    date: date.getDate(),
                    fullDate: date,
                    isCurrentMonth: false,
                    isToday: false,
                    isWeekend: date.getDay() === 0 || date.getDay() === 6,
                    interventions: this.getInterventionsForDate(date)
                });
            }

            // Jours du mois actuel
            for (let i = 1; i <= daysInMonth; i++) {
                const date = new Date(year, month, i);
                const isToday = date.getTime() === today.getTime();

                days.push({
                    date: i,
                    fullDate: date,
                    isCurrentMonth: true,
                    isToday: isToday,
                    isWeekend: date.getDay() === 0 || date.getDay() === 6,
                    interventions: this.getInterventionsForDate(date)
                });
            }

            // Jours du mois suivant
            const remainingDays = 42 - days.length;
            for (let i = 1; i <= remainingDays; i++) {
                const date = new Date(year, month + 1, i);
                days.push({
                    date: i,
                    fullDate: date,
                    isCurrentMonth: false,
                    isToday: false,
                    isWeekend: date.getDay() === 0 || date.getDay() === 6,
                    interventions: this.getInterventionsForDate(date)
                });
            }

            return days;
        },

        groupedByDate() {
            const grouped = {};
            const sortedInterventions = [...this.interventions]
                .filter(i => i.dateTraitement)
                .sort((a, b) => new Date(a.dateTraitement) - new Date(b.dateTraitement));

            sortedInterventions.forEach(intervention => {
                const date = new Date(intervention.dateTraitement).toISOString().split('T')[0];
                if (!grouped[date]) {
                    grouped[date] = [];
                }
                grouped[date].push(intervention);
            });

            return grouped;
        },

        ganttDays() {
            const days = [];
            const startDate = new Date(this.currentDate);
            startDate.setDate(1);

            for (let i = 0; i < 30; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                days.push({
                    date: date.toISOString().split('T')[0],
                    dayName: this.daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1],
                    dayNumber: date.getDate(),
                    isToday: date.getTime() === today.getTime(),
                    isWeekend: date.getDay() === 0 || date.getDay() === 6
                });
            }
            return days;
        },

        sortedInterventions() {
            return [...this.interventions]
                .filter(i => i.dateTraitement)
                .sort((a, b) => new Date(a.dateTraitement) - new Date(b.dateTraitement));
        },

        upcomingInterventions() {
            const now = new Date();
            return [...this.interventions]
                .filter(i => i.dateTraitement && new Date(i.dateTraitement) >= now)
                .sort((a, b) => new Date(a.dateTraitement) - new Date(b.dateTraitement));
        },

        unscheduledInterventions() {
            return this.interventions.filter(i => !i.dateTraitement || i.statut === 'EN_ATTENTE');
        }
    },

    async mounted() {
        await this.loadData();
    },

    methods: {
        ...mapActions('interventions', {
            getAllInterventions: 'getAll',
            createIntervention: 'create',
            updateIntervention: 'update'
        }),

        async loadData() {
            try {
                this.loading = true;
                await this.getAllInterventions();
                this.interventions = this.allInterventions;
                this.calculateStats();
            } catch (error) {
                console.error('Erreur lors du chargement:', error);
                this.$message?.error('Erreur lors du chargement des interventions');
            } finally {
                this.loading = false;
            }
        },

        calculateStats() {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekEnd = new Date(today);
            weekEnd.setDate(today.getDate() + 7);

            this.stats.aujourdhui = this.interventions.filter(i => {
                if (!i.dateTraitement) return false;
                const date = new Date(i.dateTraitement);
                return date.toDateString() === today.toDateString();
            }).length;

            this.stats.semaine = this.interventions.filter(i => {
                if (!i.dateTraitement) return false;
                const date = new Date(i.dateTraitement);
                return date >= today && date <= weekEnd;
            }).length;

            this.stats.enRetard = this.interventions.filter(i => {
                if (!i.dateTraitement) return false;
                const date = new Date(i.dateTraitement);
                return date < today && i.statut !== 'TERMINE';
            }).length;

            this.stats.prochaines = this.interventions.filter(i => {
                if (!i.dateTraitement) return false;
                const date = new Date(i.dateTraitement);
                return date > weekEnd;
            }).length;
        },

        getInterventionsForDate(date) {
            return this.interventions.filter(intervention => {
                if (!intervention.dateTraitement) return false;
                const interventionDate = new Date(intervention.dateTraitement);
                return interventionDate.toDateString() === date.toDateString();
            });
        },

        previousPeriod() {
            const newDate = new Date(this.currentDate);
            newDate.setMonth(newDate.getMonth() - 1);
            this.currentDate = newDate;
        },

        nextPeriod() {
            const newDate = new Date(this.currentDate);
            newDate.setMonth(newDate.getMonth() + 1);
            this.currentDate = newDate;
        },

        goToToday() {
            this.currentDate = new Date();
        },

        quickSchedule(date) {
            this.scheduleForm.date = date.toISOString().split('T')[0];
            this.scheduleForm.time = '09:00';
            this.showScheduleModal = true;
        },

        async saveSchedule() {
            try {
                if (!this.scheduleForm.date || !this.scheduleForm.time) {
                    this.$message?.warning('Veuillez remplir tous les champs obligatoires');
                    return;
                }

                const dateTime = new Date(`${this.scheduleForm.date}T${this.scheduleForm.time}`);

                if (this.scheduleForm.interventionId) {
                    const intervention = this.interventions.find(i => i.id == this.scheduleForm.interventionId);
                    await this.updateIntervention({
                        ...intervention,
                        dateTraitement: dateTime.toISOString(),
                        statut: 'EN_COURS'
                    });
                    this.$message?.success('Intervention planifiée avec succès');
                } else {
                    if (!this.scheduleForm.typeIntervention || !this.scheduleForm.biensImmobilersId) {
                        this.$message?.warning('Veuillez remplir tous les champs obligatoires');
                        return;
                    }

                    await this.createIntervention({
                        typeIntervention: this.scheduleForm.typeIntervention,
                        description: this.scheduleForm.description,
                        priorite: this.scheduleForm.priorite,
                        statut: 'EN_COURS',
                        dateSignalement: new Date().toISOString(),
                        dateTraitement: dateTime.toISOString(),
                        biensImmobilers: {
                            id: parseInt(this.scheduleForm.biensImmobilersId)
                        }
                    });
                    this.$message?.success('Intervention créée et planifiée avec succès');
                }

                this.closeScheduleModal();
                await this.loadData();
            } catch (error) {
                console.error('Erreur lors de la planification:', error);
                this.$message?.error('Erreur lors de la planification');
            }
        },

        editSchedule(intervention) {
            const date = intervention.dateTraitement ? new Date(intervention.dateTraitement) : new Date();
            this.scheduleForm = {
                interventionId: intervention.id,
                date: date.toISOString().split('T')[0],
                time: date.toTimeString().split(' ')[0].substring(0, 5),
                priorite: intervention.priorite,
                notes: ''
            };
            this.selectedIntervention = null;
            this.showScheduleModal = true;
        },

        closeScheduleModal() {
            this.showScheduleModal = false;
            this.scheduleForm = {
                interventionId: '',
                typeIntervention: '',
                biensImmobilersId: '',
                date: '',
                time: '',
                priorite: 'MOYENNE',
                duree: 2,
                description: '',
                notes: ''
            };
        },

        viewIntervention(intervention) {
            this.selectedIntervention = intervention;
        },

        showDayDetails(day) {
            alert(`${day.interventions.length} interventions planifiées pour ce jour`);
        },

        exportPlanning() {
            this.$message?.info('Fonctionnalité d\'export en cours de développement');
        },

        getEventClass(intervention) {
            const classes = ['event-item'];
            if (intervention.priorite === 'HAUTE') classes.push('priority-high');
            if (intervention.statut === 'TERMINE') classes.push('status-completed');
            if (intervention.statut === 'EN_COURS') classes.push('status-progress');
            return classes.join(' ');
        },

        getTimelineItemClass(intervention) {
            const now = new Date();
            const date = new Date(intervention.dateTraitement);
            if (date < now && intervention.statut !== 'TERMINE') {
                return 'overdue';
            }
            return '';
        },

        getMarkerClass(intervention) {
            const classes = {
                'HAUTE': 'bg-danger',
                'MOYENNE': 'bg-warning',
                'BASSE': 'bg-info'
            };
            return classes[intervention.priorite] || 'bg-secondary';
        },

        getGanttBarClass(intervention) {
            const classes = ['gantt-bar'];
            if (intervention.priorite === 'HAUTE') classes.push('priority-high');
            if (intervention.statut === 'TERMINE') classes.push('completed');
            if (intervention.statut === 'EN_COURS') classes.push('in-progress');
            return classes.join(' ');
        },

        getGanttBarStyle(intervention) {
            if (!intervention.dateTraitement) return {};

            const startDate = new Date(this.currentDate);
            startDate.setDate(1);
            const interventionDate = new Date(intervention.dateTraitement);

            const daysDiff = Math.floor((interventionDate - startDate) / (1000 * 60 * 60 * 24));
            const duration = this.scheduleForm.duree || 1;

            if (daysDiff < 0 || daysDiff > 30) return { display: 'none' };

            const left = (daysDiff / 30) * 100;
            const width = (duration / 24) * (100 / 30);

            return {
                left: `${left}%`,
                width: `${Math.max(width, 2)}%`
            };
        },

        getIconClass(priorite) {
            const classes = {
                'HAUTE': 'icon-danger',
                'MOYENNE': 'icon-warning',
                'BASSE': 'icon-info'
            };
            return classes[priorite] || 'icon-secondary';
        },

        getStatusBadgeClass(statut) {
            const classes = {
                'EN_ATTENTE': 'bg-warning text-dark',
                'EN_COURS': 'bg-primary',
                'TERMINE': 'bg-success'
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatusLabel(statut) {
            const labels = {
                'EN_ATTENTE': 'En attente',
                'EN_COURS': 'En cours',
                'TERMINE': 'Terminé'
            };
            return labels[statut] || statut;
        },

        getPrioriteBadgeClass(priorite) {
            const classes = {
                'HAUTE': 'bg-danger',
                'MOYENNE': 'bg-warning text-dark',
                'BASSE': 'bg-secondary'
            };
            return classes[priorite] || 'bg-secondary';
        },

        formatCurrency(value) {
            if (!value && value !== 0) return '—';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0
            }).format(value);
        },

        formatDate(date) {
            if (!date) return '—';
            return new Date(date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        formatDateTime(date) {
            if (!date) return '—';
            return new Date(date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        formatTime(date) {
            if (!date) return '—';
            return new Date(date).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        formatDay(date) {
            return new Date(date).getDate();
        },

        formatMonth(date) {
            const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
                'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
            return months[new Date(date).getMonth()];
        }
    }
};
</script>

<style scoped>
.modal.show {
    display: block !important;
}

/* Calendar Styles */
.calendar-container {
    min-height: 600px;
}

.calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: #dee2e6;
    border: 1px solid #dee2e6;
}

.calendar-day-header {
    background: #f8f9fa;
    padding: 12px;
    text-align: center;
    font-weight: 600;
    font-size: 0.875rem;
    color: #6c757d;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: #dee2e6;
    border: 1px solid #dee2e6;
    border-top: none;
}

.calendar-day {
    background: white;
    min-height: 120px;
    padding: 8px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.2s;
}

.calendar-day:hover {
    background-color: #f8f9fa;
}

.calendar-day.other-month {
    background-color: #f8f9fa;
    opacity: 0.5;
}

.calendar-day.today {
    background-color: #e7f3ff;
}

.calendar-day.weekend {
    background-color: #fff9e6;
}

.calendar-day.has-events {
    background-color: #f0f9ff;
}

.day-number {
    font-weight: 600;
    font-size: 0.875rem;
    margin-bottom: 4px;
    color: #495057;
}

.calendar-day.today .day-number {
    background: #0d6efd;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.day-events {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.event-item {
    background: #0d6efd;
    color: white;
    padding: 4px 6px;
    border-radius: 4px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.event-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.event-item.priority-high {
    background: #dc3545;
    border-left: 3px solid #a71d2a;
}

.event-item.status-completed {
    background: #198754;
    opacity: 0.7;
}

.event-item.status-progress {
    background: #0dcaf0;
}

.event-time {
    font-size: 0.7rem;
    font-weight: 600;
    margin-bottom: 2px;
}

.event-title {
    font-weight: 600;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.event-location {
    font-size: 0.7rem;
    opacity: 0.9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.empty-day {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.btn-add-event {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px dashed #dee2e6;
    background: transparent;
    color: #6c757d;
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.calendar-day:hover .btn-add-event {
    display: flex;
}

.btn-add-event:hover {
    border-color: #0d6efd;
    color: #0d6efd;
    background: #e7f3ff;
}

.more-events {
    color: #0d6efd;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    padding: 2px 6px;
    text-align: center;
}

.more-events:hover {
    text-decoration: underline;
}

/* Timeline Styles */
.timeline-container {
    padding: 20px 0;
}

.timeline-group {
    display: flex;
    gap: 30px;
    margin-bottom: 40px;
}

.timeline-date {
    flex-shrink: 0;
    width: 80px;
}

.date-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
}

.date-day {
    font-size: 1.5rem;
    font-weight: 700;
}

.date-month {
    font-size: 0.875rem;
    text-transform: uppercase;
}

.timeline-items {
    flex: 1;
}

.timeline-item {
    position: relative;
    padding-left: 30px;
    margin-bottom: 20px;
}

.timeline-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: -20px;
    width: 2px;
    background: #dee2e6;
}

.timeline-item:last-child::before {
    display: none;
}

.timeline-item.overdue::before {
    background: #dc3545;
}

.timeline-marker {
    position: absolute;
    left: -5px;
    top: 10px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 0 2px #dee2e6;
}

.timeline-content {
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 16px;
}

.timeline-item.overdue .timeline-content {
    border-color: #dc3545;
    background: #fff5f5;
}

/* Gantt Styles */
.gantt-container {
    overflow-x: auto;
}

.gantt-header {
    display: flex;
    border-bottom: 2px solid #dee2e6;
    background: #f8f9fa;
}

.gantt-task-header {
    width: 250px;
    padding: 12px;
    font-weight: 600;
    border-right: 2px solid #dee2e6;
    flex-shrink: 0;
}

.gantt-timeline-header {
    display: flex;
    flex: 1;
    min-width: 900px;
}

.gantt-day-header {
    flex: 1;
    padding: 8px;
    text-align: center;
    border-right: 1px solid #dee2e6;
    font-size: 0.75rem;
}

.gantt-day-header.today {
    background: #e7f3ff;
    font-weight: 600;
}

.gantt-day-header.weekend {
    background: #fff9e6;
}

.day-name {
    font-weight: 600;
    color: #6c757d;
    text-transform: uppercase;
}

.day-number {
    font-size: 0.875rem;
}

.gantt-body {
    max-height: 600px;
    overflow-y: auto;
}

.gantt-row {
    display: flex;
    border-bottom: 1px solid #dee2e6;
    min-height: 50px;
}

.gantt-row:hover {
    background: #f8f9fa;
}

.gantt-task-cell {
    width: 250px;
    padding: 12px;
    border-right: 2px solid #dee2e6;
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.task-info {
    overflow: hidden;
}

.task-title {
    font-weight: 600;
    font-size: 0.875rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.gantt-timeline-cell {
    flex: 1;
    position: relative;
    min-width: 900px;
}

.gantt-bars {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
}

.gantt-bar {
    position: absolute;
    height: 30px;
    background: #0d6efd;
    border-radius: 4px;
    padding: 6px 12px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    align-items: center;
}

.gantt-bar:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.gantt-bar.priority-high {
    background: #dc3545;
}

.gantt-bar.completed {
    background: #198754;
    opacity: 0.7;
}

.gantt-bar.in-progress {
    background: #0dcaf0;
}

.bar-label {
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Intervention Icons */
.intervention-icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
}

.icon-danger {
    background: #fee;
    color: #dc3545;
}

.icon-warning {
    background: #fff3cd;
    color: #ffc107;
}

.icon-info {
    background: #cfe2ff;
    color: #0d6efd;
}

.icon-secondary {
    background: #e9ecef;
    color: #6c757d;
}

/* List Group */
.list-group-item {
    border-left: 3px solid transparent;
    transition: all 0.2s;
}

.list-group-item:hover {
    border-left-color: #0d6efd;
    background-color: #f8f9fa;
}

/* Badges */
.badge {
    font-weight: 500;
    padding: 0.35em 0.65em;
}

/* Responsive */
@media (max-width: 768px) {
    .calendar-day {
        min-height: 80px;
        padding: 4px;
    }

    .event-item {
        padding: 2px 4px;
    }

    .event-title,
    .event-location {
        font-size: 0.65rem;
    }

    .gantt-task-cell {
        width: 150px;
    }

    .timeline-group {
        flex-direction: column;
        gap: 15px;
    }
}
</style>