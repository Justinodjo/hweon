<template>
	<!-- Header START -->
	<header class="navbar-light header-sticky">
		<!-- Logo Nav START -->
		<nav class="navbar navbar-expand-xl">
			<div class="container">
				<!-- Logo START -->
				<router-link class="navbar-brand" to="/home">
					<img class="light-mode-item navbar-brand-item h-50px"
						src="../../assets/images/hweon_logo_transparent.png" alt="logo">
					<img class="dark-mode-item navbar-brand-item" src="../../assets/images/hweon_logo_transparent.png"
						alt="logo">
					<!-- <img :src="isDark ? '../../assets/images/logo-light.svg' : '../../assets/images/hweon_logo_transparent.png'"
						alt="logo" class="navbar-brand-item"> -->
					<!-- <span>Hweon</span> -->
				</router-link>
				<!-- Logo END -->

				<!-- Responsive navbar toggler -->
				<!-- <button class="navbar-toggler ms-auto ms-sm-0 p-0 p-sm-2" type="button" data-bs-toggle="collapse"
					data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
					aria-label="Toggle navigation">
					<span class="navbar-toggler-animation">
						<span></span>
						<span></span>
						<span></span>
					</span>
					<span class="d-none d-sm-inline-block small">Menu</span>
				</button> -->

				<!-- Responsive category toggler -->
				<button class="navbar-toggler ms-sm-auto mx-3 me-md-0 p-0 p-sm-2" type="button"
					data-bs-toggle="collapse" data-bs-target="#navbarCategoryCollapse"
					aria-controls="navbarCategoryCollapse" aria-expanded="false" aria-label="Toggle navigation">
					<i class="bi bi-grid-3x3-gap-fill fa-fw"></i><span
						class="d-none d-sm-inline-block small">Category</span>
				</button>

				<!-- Nav category menu START -->
				<div class="navbar-collapse collapse justify-content-center" id="navbarCategoryCollapse"
					v-if="!isDirectoryDetails">
					<ul class="navbar-nav navbar-nav-scroll nav-pills-primary-soft text-center  p-2 p-xl-0">
						<!-- Nav item Hotel -->
						<li class="nav-item" v-for="(item, index) in services" :key="index">
							<router-link class="nav-link active" data-bs-target="#navbarCategoryCollapse"
								:to="{ name: 'DirectoryDetailsMenu', params: { id: item.id } }">
								<i :id="`lottie-${item.id}`" class="menu-lottie"></i>
								<span class="menu-label mt-1">{{ item.nomTypeBiensImmo }}</span>
							</router-link>
						</li>
					</ul>
				</div>
				<!-- Nav category menu END -->

				<!-- Profile and Notification START -->
				<ul class="nav flex-row align-items-center list-unstyled ms-xl-auto">
					<!-- Notification dropdown START -->
					<li class="nav-item dropdown ms-0 ms-md-3" v-if="!hideNotifications && isAuthenticated">
						<!-- Notification button -->
						<a class="nav-notification btn btn-light p-0 mb-0" href="#" role="button"
							data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside"
							@click="clearNotifications">
							<i class="bi bi-bell fa-fw"></i>
							<!-- Badge dynamique -->
							<span v-if="unreadCount > 0" class="notif-badge animation-blink">{{ unreadCount }}</span>
							<!-- <span v-if="unreadCount > 0" class="badge rounded-pill bg-danger"
								style="font-size: 0.6rem;">
								{{ unreadCount }}
							</span> -->
						</a>

						<!-- Notification dropdown menu START -->
						<div
							class="dropdown-menu dropdown-animation dropdown-menu-end dropdown-menu-size-md shadow-lg p-0">
							<div class="card bg-transparent">
								<!-- Card header -->
								<div
									class="card-header bg-transparent d-flex justify-content-between align-items-center border-bottom">
									<h6 class="m-0">
										Notifications
										<span v-if="unreadCount" class="badge bg-danger bg-opacity-10 text-danger ms-2">
											{{ unreadCount }} nouvelles
										</span>
									</h6>
									<a class="small" href="#" @click.prevent="clearNotifications">
										<i class="fa fa-trash"></i></a>
								</div>

								<!-- Card body START -->
								<div class="card-body p-0" style="max-height: 300px; overflow-y: auto;">
									<ul class="list-group list-group-flush list-unstyled p-2">
										<li v-for="(notif, index) in notifications" :key="index">
											<div class="list-group-item list-group-item-action rounded border-0 mb-1 p-3"
												:class="{ 'notif-unread': index < unreadCount }">
												<h6 class="mb-2">
													{{ notif.message || notif.contenu || 'Nouvelle notification' }}
												</h6>
												<span class="small text-muted">
													{{ formatDate(notif.dateNotification) }}
												</span>
											</div>
										</li>
									</ul>
								</div>
								<!-- Card body END -->

								<!-- Card footer -->
								<div class="card-footer bg-transparent text-center border-top">
									<a href="#" class="btn btn-sm btn-link mb-0 p-0">Voir toutes les notifications</a>
								</div>
							</div>

						</div>
						<!-- Notification dropdown menu END -->
					</li>
					<!-- Notification dropdown END -->

					<!-- Profile dropdown START -->
					<li class="nav-item ms-3 dropdown">
						<!-- Avatar -->
						<a class="avatar avatar-sm p-0" href="#" id="profileDropdown" role="button"
							data-bs-auto-close="outside" data-bs-display="static" data-bs-toggle="dropdown"
							aria-expanded="false">
							<img class="avatar-img rounded-2" :src="avatarUrl" alt="avatar">
						</a>

						<ul class="dropdown-menu dropdown-animation dropdown-menu-end shadow pt-3"
							aria-labelledby="profileDropdown">
							<!-- Profile info -->
							<li class="px-3 mb-3">
								<div class="d-flex align-items-center">
									<!-- Avatar -->
									<div class="avatar me-3">
										<img class="avatar-img rounded-circle shadow" :src="avatarUrl" alt="avatar">
									</div>
									<div>
										<a class="h6 mt-2 mt-sm-0" href="#">{{ fullName }}</a>
										<p class="small m-0">{{ handleEmail }}</p>
									</div>
								</div>
							</li>

							<!-- Links -->
							<li>
								<hr class="dropdown-divider">
							</li>
							<!-- Bouton tableau de bord -->
							<li v-if="isAuthenticated"> <a class="dropdown-item" @click="goToDashboard"><i
										class="bi bi-speedometer2 fa-fw me-2"></i>Mon tableau de bord</a>
							</li>
							<!-- <li v-if="fullName !== 'Non Connecté'"><router-link class="dropdown-item"
									to="directory/profils/details_profil"><i
										class="bi bi-bookmark-check fa-fw me-2"></i>Mon
									profil</router-link></li> -->

							<!-- <li><a class="dropdown-item" href="#"><i class="bi bi-heart fa-fw me-2"></i>My Wishlist</a>
							</li>
							<li><a class="dropdown-item" href="#"><i class="bi bi-gear fa-fw me-2"></i>Settings</a></li>
							<li><a class="dropdown-item" href="#"><i class="bi bi-info-circle fa-fw me-2"></i>Help
									Center</a></li> -->
							<li v-if="fullName !== 'Non Connecté'"><router-link
									class="dropdown-item bg-danger-soft-hover" to="/directory/login" @click="logout">
									<i class="bi bi-power fa-fw me-2"></i>Se déconnecter
								</router-link>
							</li>
							<li v-if="fullName == 'Non Connecté'"><router-link
									class="dropdown-item bg-danger-soft-hover" to="/directory/login" @click="logout">
									<i class="bi bi-power fa-fw me-2"></i>Se connecter
								</router-link>
							</li>
							<li>
								<hr class="dropdown-divider">
							</li>

							<!-- Dark mode options START -->
							<li>
								<div
									class="nav-pills-primary-soft theme-icon-active d-flex justify-content-between align-items-center p-2 pb-0">
									<span>Mode:</span>
									<button type="button" class="btn btn-link nav-link text-primary-hover mb-0 p-0"
										data-bs-theme-value="light" data-bs-toggle="tooltip" data-bs-placement="top"
										data-bs-title="Light">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
											fill="currentColor" class="bi bi-sun fa-fw mode-switch" viewBox="0 0 16 16">
											<path
												d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
											<use href="#"></use>
										</svg>
									</button>
									<button type="button" class="btn btn-link nav-link text-primary-hover mb-0 p-0"
										data-bs-theme-value="dark" data-bs-toggle="tooltip" data-bs-placement="top"
										data-bs-title="Dark">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
											fill="currentColor" class="bi bi-moon-stars fa-fw mode-switch"
											viewBox="0 0 16 16">
											<path
												d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
											<path
												d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
											<use href="#"></use>
										</svg>
									</button>
									<button type="button"
										class="btn btn-link nav-link text-primary-hover mb-0 p-0 active"
										data-bs-theme-value="auto" data-bs-toggle="tooltip" data-bs-placement="top"
										data-bs-title="Auto">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
											fill="currentColor" class="bi bi-circle-half fa-fw mode-switch"
											viewBox="0 0 16 16">
											<path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
											<use href="#"></use>
										</svg>
									</button>
								</div>
							</li>
							<!-- Dark mode options END-->
						</ul>
					</li>
					<!-- Profile dropdown END -->
				</ul>
				<!-- Profile and Notification START -->

			</div>
		</nav>
		<!-- Logo Nav END -->
	</header>
	<!-- Header END -->

</template>

<script>

import { tns } from 'tiny-slider';
import { mapActions, mapGetters } from "vuex";
import { API_URLS } from "@/config/api";
import { setEmail, setUserName, setSecondName, getFichier } from "@/helpers/auth";
import { setTheme, getPreferredTheme, setupThemeSwitcher } from '@/utils/theme';
import { ElNotification } from 'element-plus';
import { useRouter } from 'vue-router';
import lottie from 'lottie-web';
import getRedirectByRole from "@/helpers/getRedirectByRole";
export default {
	name: "Header",
	data() {
		return {
			services: [],
			defaultAvatarUrl: new URL('@/assets/images/avatar/user_profil.png', import.meta.url).href,
			collapseInstance: null,
			previousNotifCount: 0,
			lottieInstances: [],
			// secondName: "",
			// name: ""
		};
	},
	mounted() {
		// Assurez-vous que le DOM est complètement monté avant d'initialiser le dropdown
		// this.$nextTick(() => {
		// 	const dropdowns = document.querySelectorAll('.dropdown-toggle');
		// 	dropdowns.forEach(dropdown => new window.bootstrap.Dropdown(dropdown));
		// 	const menu = document.getElementById('navbarCategoryCollapse');
		// 	if (menu) {
		// 		this.collapseInstance = new window.bootstrap.Collapse(menu);
		// 		this.collapseInstance.hide();
		// 	}
		// });
		setupThemeSwitcher();
		this.loadService();
		// this.initLottieAnimations();

		// DEBUG : afficher l'état au montage
		console.log('Header mounted:', { currentUser: this.currentUser, isConnected: this.isConnected });

		// Démarrer la WebSocket si utilisateur connecté et notification non connectée
		if (this.currentUser && !this.isConnected) {
			try {
				// utilise l'action mappée 'start' (méthode)
				this.start();
				console.log('Notifications WS démarrées');
			} catch (e) {
				console.error('Erreur démarrage Notifications WS:', e);
			}
		}
		// ✅ Initialiser le compteur de notifications
		this.previousNotifCount = this.notifications.length;
		console.log("Voici mes notifications" + this.notifications)
	},
	computed: {
		...mapGetters('auth', ['userName', 'secondName', 'email', 'currentUser', 'userFichier', "isAuthenticated"]),
		...mapGetters('notifications', ['notifications', 'unreadCount', 'isConnected']),

		fullName() {
			return this.currentUser.name && this.currentUser.secondName
				? `${this.currentUser.name} ${this.currentUser.secondName}`
				: 'Non Connecté';
		},
		handleEmail() {
			return this.currentUser.email || 'non@connecte.com';
		},
		avatarUrl() {
			// 1. Priorité au fichier uploadé (depuis cookie ou store)
			let fileId = this.userFichier || getFichier();
			console.log("userFichier dans avatarUrl :", this.userFichier);
			// 2. Si tu veux prendre le dernier fichier uploadé via FilePond
			if (this.$refs.fileUpload?.fichier?.length) {
				fileId = this.$refs.fileUpload.fichier.slice(-1)[0].id; // ou fileId selon ta réponse serveur
			}

			if (fileId) {
				return `${API_URLS.API_BASE}/fichier/download/${fileId}`;
			}

			// 3. Avatar par défaut
			return new URL('@/assets/images/avatar/user_profil.png', import.meta.url).href;
		},
		// Vérifier si la route actuelle est "DirectoryDetails"
		isDirectoryDetails() {
			return this.$route.name === 'DirectoryDetails';  // Ou la route que vous avez pour DirectoryDetails
		},

		hideNotifications() {
			return this.$route.meta?.hideNotifications === true;
		},


	},

	beforeUnmount() {
		// ✅ Détruire toutes les instances Lottie
		this.lottieInstances.forEach(instance => {
			if (instance) instance.destroy();
		});
		this.lottieInstances = [];

		// 🔌 Déconnexion WebSocket
		if (this.isConnected) {
			this.stop();
		}
	},
	watch: {
		notifications(newList) {
			const newCount = newList.length - this.previousNotifCount;
			if (newCount > 0) {
				// 🔔 Animation cloche
				const bell = document.querySelector('.bi-bell');
				if (bell) {
					bell.classList.add('notification-shake');
					setTimeout(() => bell.classList.remove('notification-shake'), 500);
				}

				// ✅ Toast visuel
				newList.slice(-newCount).forEach(newNotif => {
					ElNotification({
						title: 'Nouvelle notification 📢',
						message: newNotif.contenu || newNotif.message || 'Vous avez une nouvelle notification',
						type: 'info',
						duration: 5000,
						position: 'top-right'
					});
				});
			}
			this.previousNotifCount = newList.length;
		},
		// ✅ Recharger les animations si les services changent
		services() {
			this.$nextTick(() => {
				this.initLottieAnimations();
			});
		}

	},
	created() {
		// setTimeout(() => {
		// 	this.$store.commit('notifications/ADD_NOTIFICATION', {
		// 		contenu: 'Ceci est une notification de test',
		// 		dateNotification: new Date().toISOString()
		// 	});
		// }, 2000);
	},
	methods: {
		...mapActions('auth', ['logout',]),
		...mapActions('notifications', ['start', 'stop']),
		closeMenu() {
			if (this.collapseInstance) {
				this.collapseInstance.hide();
			}
		},
		openMenu() {
			if (this.collapseInstance) {
				this.collapseInstance.show();
			}
		},
		goToDashboard() {
			const userRoles = this.$store.getters['auth/userRoles'] || [];
			// Utilise ta fonction utilitaire
			const redirectPath = getRedirectByRole(userRoles);
			// Redirection sécurisée
			if (redirectPath) {
				this.$router.push(redirectPath).catch(err => {
					// Ignorer l'erreur NavigationDuplicated si l'utilisateur est déjà sur la même route
					if (err.name !== 'NavigationDuplicated') {
						console.error(err);
					}
				});
			}
		},
		async loadService() {
			try {
				const response = await this.$store.dispatch('typeBiens/getAll');
				this.services = response;
				// ✅ Associe une icône Bootstrap à chaque service
				this.services = response.map(service => ({
					...service,
					animation: this.getAnimationPath(service.nomTypeBiensImmo)
				}));
				// ⏳ Attends que le DOM soit mis à jour avant de charger Lottie
				this.$nextTick(() => {
					this.initLottieAnimations();
				});
			} catch (error) {
				console.error('Erreur lors de l\'ajout de l\'élément fonction :', error);
			}
		},
		async logout() {
			this.$store.dispatch('auth/logout');  // Appel de l'action 'logout'
			this.$router.push('/directory/login'); // Rediriger vers la page de connexion
		},
		// 🎬 Détermine quelle animation Lottie utiliser selon le nom du type
		getAnimationPath(nom) {
			if (!nom) return "/animations/default.json";

			// Normalise le nom (pour éviter les différences de majuscules ou accents)
			const name = nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

			// Correspondance automatique avec les fichiers Lottie
			if (name.includes("residentiel")) return "/animations/residential.json";
			if (name.includes("commercial")) return "/animations/commercial.json";
			if (name.includes("industriel")) return "/animations/industrial.json";
			if (name.includes("agricole")) return "/animations/agricole.json";
			if (name.includes("invest")) return "/animations/investissement.json";

			// 🔁 Par défaut (si un nouveau type inconnu arrive)
			return "/animations/default.json";
		},
		// ✅ CORRECTION: Initialisation Lottie avec querySelector
		initLottieAnimations() {
			// Détruire les anciennes instances
			this.lottieInstances.forEach(instance => {
				if (instance) instance.destroy();
			});
			this.lottieInstances = [];

			// Créer les nouvelles instances
			this.services.forEach((service) => {
				const container = document.getElementById(`lottie-${service.id}`);

				if (container && service.animation) {
					try {
						const animation = lottie.loadAnimation({
							container: container,
							renderer: 'svg',
							loop: true,
							autoplay: true,
							path: service.animation,
						});

						this.lottieInstances.push(animation);
						console.log(`✅ Animation chargée pour ${service.nomTypeBiensImmo}`);
					} catch (error) {
						console.error(`❌ Erreur Lottie pour ${service.nomTypeBiensImmo}:`, error);
					}
				} else {
					console.warn(`⚠️ Container manquant pour ${service.nomTypeBiensImmo}`);
				}
			});
		},
		getImageUrl(idfile) {
			// return `https://93.115.20.172:8081/fichier/download/${idfile}`;
			return `${API_URLS.API_BASE}/fichier/download/${idfile}`;
		},
		formatDate(date) {
			if (!date) return '';
			return new Date(date).toLocaleString('fr-FR', {
				dateStyle: 'short',
				timeStyle: 'short',
			});
		},

		clearNotifications() {
			this.$store.commit('notifications/CLEAR');
		},

	},
};


</script>
<style>
.dropdown-menu {
	z-index: 2000;
}

.header.header-sticky {
	z-index: 1050;
	position: relative;
}

.nav-notification {
	position: relative;
	display: inline-block;
	/* obligatoire pour que absolute fonctionne correctement */
	width: 2.5rem;
	/* ajustable selon la taille de l'icône */
	height: 2.5rem;
	/* idem */
	text-align: center;
	/* centrer l'icône */
	line-height: 2.5rem;
	/* centrer verticalement */
}

.nav-notification .badge {
	position: absolute;
	top: 0.2rem;
	/* légèrement en dessous du bord supérieur */
	right: 0.2rem;
	/* légèrement en retrait du bord droit */
	font-size: 0.6rem;
	min-width: 1rem;
	height: 1rem;
	padding: 0 0.25rem;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #dc3545;
	color: white;
	z-index: 2100;
}

/* 🔔 Animation cloche */
@keyframes shake {

	0%,
	100% {
		transform: rotate(0);
	}

	25% {
		transform: rotate(-10deg);
	}

	75% {
		transform: rotate(10deg);
	}
}

.notification-shake {
	animation: shake 0.4s ease-in-out;
}

/* Clignotement du badge */
@keyframes blink {

	0%,
	100% {
		opacity: 1;
	}

	50% {
		opacity: 0.4;
	}
}

.animation-blink {
	animation: blink 1s infinite;
}

.menu-item {
	text-align: center;
	transition: transform 0.3s ease;
}

.menu-lottie {
	width: 60px;
	height: 60px;
	margin: auto;
}

.menu-label {
	font-size: 0.8rem;
	color: #6c757d;
	transition: color 0.3s ease;
}

.menu-item:hover {
	transform: translateY(-5px);
}

.menu-item:hover .menu-label {
	color: #0d6efd;
}

.dropdown-menu {
	z-index: 2000;
}

.header.header-sticky {
	z-index: 1050;
	position: relative;
}

.nav-notification {
	position: relative;
	display: inline-block;
	width: 2.5rem;
	height: 2.5rem;
	text-align: center;
	line-height: 2.5rem;
}

.notif-badge {
	position: absolute;
	top: 0.2rem;
	right: 0.2rem;
	font-size: 0.6rem;
	min-width: 1rem;
	height: 1rem;
	padding: 0 0.25rem;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #dc3545;
	color: white;
	z-index: 2100;
}

/* 🔔 Animation cloche */
@keyframes shake {

	0%,
	100% {
		transform: rotate(0);
	}

	25% {
		transform: rotate(-10deg);
	}

	75% {
		transform: rotate(10deg);
	}
}

.notification-shake {
	animation: shake 0.4s ease-in-out;
}

/* Clignotement du badge */
@keyframes blink {

	0%,
	100% {
		opacity: 1;
	}

	50% {
		opacity: 0.4;
	}
}

.animation-blink {
	animation: blink 1s infinite;
}

/* ✅ Styles pour le menu Lottie */
.menu-item {
	text-align: center;
	transition: transform 0.3s ease;
}

.menu-lottie {
	width: 60px;
	height: 60px;
	margin: 0 auto;
	display: block;
}

.menu-label {
	display: block;
	font-size: 0.8rem;
	color: #6c757d;
	transition: color 0.3s ease;
	margin-top: 0.5rem;
}

.menu-item:hover {
	transform: translateY(-5px);
}

.menu-item:hover .menu-label {
	color: #0d6efd;
}
</style>