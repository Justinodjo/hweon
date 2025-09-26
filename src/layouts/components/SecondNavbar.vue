<template>
	<header class="header-transparent">
		<!-- Logo Nav START -->
		<nav class="navbar navbar-dark navbar-expand-xl">
			<div class="container">
				<!-- Logo START -->
				<a class="navbar-brand" href="/home">
					<img class="navbar-brand-item mx-auto h-70px" src="../../assets/images/logo.png" alt="logo">
				</a>
				<!-- Logo END -->

				<!-- Responsive navbar toggler -->
				<!-- <button class="navbar-toggler ms-auto me-3 p-0" type="button" data-bs-toggle="collapse"
					data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
					aria-label="Toggle navigation">
					<span class="navbar-toggler-animation">
						<span></span>
						<span></span>
						<span></span>
					</span>
				</button> -->

				<!-- Main navbar START -->
				<!-- <div class="navbar-collapse collapse" id="navbarCollapse" v-if="isDirectoryDetails">
					<ul class="navbar-nav navbar-nav-scroll mx-auto">

						Nav item Listing
						<li class="nav-item dropdown" v-for="(item, index) in services" :key="index">
							<router-link class="nav-link " id="listingMenu" aria-haspopup="true" aria-expanded="false"
								:to="{ name: 'DirectoryDetails', params: { id: item.id } }"> {{
									item.nom
								}}</router-link>
						</li>



						Nav item link
						<li class="nav-item dropdown">
							<a class="nav-link" href="index-directory.html#" id="advanceMenu" data-bs-toggle="dropdown"
								aria-haspopup="true" aria-expanded="false">
								<i class="fas fa-ellipsis-h text-dark"></i>
							</a>
							<ul class="dropdown-menu min-w-auto" data-bs-popper="none">
								<li>
									<router-link class="dropdown-item" to="/terms" target="_blank">
										<i class="text-warning fa-fw bi bi-life-preserver me-2"></i>Terms Of Service
									</router-link>
								</li>
								<li>
									<a class="dropdown-item" href="docs/index.html" target="_blank">
										<i class="text-danger fa-fw bi bi-card-text me-2"></i>Documentation
									</a>
								</li>
								<li>
									<hr class="dropdown-divider">
								</li>
								<li>
									<a class="dropdown-item" href="rtl/index.html" target="_blank">
										<i class="text-info fa-fw bi bi-toggle-off me-2"></i>RTL demo
									</a>
								</li>
								<li>
									<a class="dropdown-item" href="https://themes.getbootstrap.com/store/webestica/"
										target="_blank">
										<i class="text-success fa-fw bi bi-cloud-download-fill me-2"></i>Buy Booking!
									</a>
								</li>
								<li>
									<hr class="dropdown-divider">
								</li>
								<li>
									<a class="dropdown-item" href="docs/alerts.html" target="_blank">
										<i class="text-orange fa-fw bi bi-puzzle-fill me-2"></i>Components
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</div> -->
				<!-- Main navbar END -->

				<!-- Profile and Notification START -->
				<ul class="nav flex-row align-items-center list-unstyled ms-xl-auto">

					<li class="nav-item dropdown ms-0 ms-md-3">
						<!-- Notification button -->
						<!-- <router-link class="nav-notification btn btn-light p-0 mb-0" to="/reservation" role="button">
							<i class="bi bi-bell fa-fw"></i>
						</router-link>
						<span class="notif-badge animation-blink"></span> -->
					</li>

					<!-- Dark mode options START -->
					<li class="nav-item dropdown ms-3">
						<button class="nav-notification btn btn-light lh-0 p-0 mb-0" id="bd-theme" type="button"
							aria-expanded="false" data-bs-toggle="dropdown" data-bs-display="static">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
								class="bi bi-circle-half fa-fw theme-icon-active" viewBox="0 0 16 16">
								<path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
								<use href="#"></use>
							</svg>
						</button>

						<ul class="dropdown-menu min-w-auto dropdown-menu-end" aria-labelledby="bd-theme">
							<li class="mb-1">
								<button type="button" class="dropdown-item d-flex align-items-center"
									data-bs-theme-value="light">
									<svg width="16" height="16" fill="currentColor"
										class="bi bi-brightness-high-fill fa-fw mode-switch me-1" viewBox="0 0 16 16">
										<path
											d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
										<use href="#"></use>
									</svg>Light
								</button>
							</li>
							<li class="mb-1">
								<button type="button" class="dropdown-item d-flex align-items-center"
									data-bs-theme-value="dark">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
										class="bi bi-moon-stars-fill fa-fw mode-switch me-1" viewBox="0 0 16 16">
										<path
											d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
										<path
											d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
										<use href="#"></use>
									</svg>Dark
								</button>
							</li>
							<li>
								<button type="button" class="dropdown-item d-flex align-items-center active"
									data-bs-theme-value="auto">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
										class="bi bi-circle-half fa-fw mode-switch" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
										<use href="#"></use>
									</svg>Auto
								</button>
							</li>
						</ul>
					</li>
					<!-- Dark mode options END -->

					<!-- Profile dropdown START -->
					<li class="nav-item ms-3 dropdown">
						<!-- Avatar -->
						<a class="avatar avatar-sm p-0" href="index-directory.html#" id="profileDropdown" role="button"
							data-bs-auto-close="outside" data-bs-display="static" data-bs-toggle="dropdown"
							aria-expanded="false">
							<img class="avatar-img rounded-circle shadow" :src="avatarUrl" alt="avatar">
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
										<a class="h6 mt-2 mt-sm-0" href="index-directory.html#"> {{ fullName }}</a>
										<p class="small m-0">{{ handlerEmail }}</p>
									</div>
								</div>
							</li>

							<!-- Links -->
							<li>
								<hr class="dropdown-divider">
							</li>
							<li v-if="fullName !== 'Non Connecté'"><router-link class="dropdown-item"
									to="directory/profils/details_profil"><i
										class="bi bi-bookmark-check fa-fw me-2"></i>Mon
									Profil</router-link></li>
							<!-- <li v-if="fullName != 'Non Connecté'"><router-link class="dropdown-item"
									to="/account_reservation"><i class="bi bi-heart fa-fw me-2"></i>Mes
									Réservations</router-link>
							</li>
							<li v-if="fullName != 'Non Connecté'"><a class="dropdown-item"
									href="index-directory.html#"><i class="bi bi-gear fa-fw me-2"></i>Settings</a></li>
							<li v-if="fullName != 'Non Connecté'"><a class="dropdown-item"
									href="index-directory.html#"><i class="bi bi-info-circle fa-fw me-2"></i>Help
									Center</a></li> -->
							<li v-if="fullName !== 'Non Connecté'"><router-link
									class="dropdown-item bg-danger-soft-hover" to="/directory/login" @click="logout">
									<i class="bi bi-power fa-fw me-2"></i>Se Déconnecter
								</router-link>
							</li>
							<li v-if="fullName == 'Non Connecté'"><router-link
									class="dropdown-item bg-danger-soft-hover" to="/directory/login" :onclick="logout">
									<i class="bi bi-power fa-fw me-2"></i>Se Connecter
								</router-link>
							</li>
						</ul>
					</li>
					<!-- Profile dropdown END -->
				</ul>
				<!-- Profile and Notification START -->

			</div>
		</nav>
		<!-- Logo Nav END -->
	</header>
</template>

<script>
import { tns } from 'tiny-slider';
import { mapActions, mapGetters } from "vuex";
import { setEmail, setUserName, setSecondName, } from "@/helpers/auth";
export default {
	name: "SecondNavbar",
	data() {
		return {
			services: [],
			defaultAvatarUrl: new URL('@/assets/images/avatar/01.jpg', import.meta.url).href,
			// secondName: "",
			// name: ""
		};
	},
	mounted() {
		this.loadService();
		// this.logout();
	},
	computed: {
		...mapGetters('auth', ['userName', 'secondName', 'email', 'isAuthenticated', 'userFichier', 'email']),

		fullName() {
			// Ici vous pouvez ajouter des calculs ou récupérer le nom de l'utilisateur
			// Exemple avec vuex
			if (this.userName && this.secondName) {
				return this.userName + ' ' + this.secondName
			} else {
				return 'Non Connecté'
			}
		},
		handlerEmail() {
			// Idem pour l'email
			if (this.email) {
				return this.email
			} else {
				return 'non@connecte.com'
			}
		},
		// Vérifier si la route actuelle est "DirectoryDetails"
		isDirectoryDetails() {
			return this.$route.name === 'DirectoryDetails';  // Ou la route que vous avez pour DirectoryDetails
		},
		avatarUrl() {
			if (this.userFichier) {
				// Construire l'URL de l'avatar à partir du dossier assets
				return new URL(`/var/www/maisdorplus/tfe/uploads/${this.userFichier}`, import.meta.url).href;
			}
			return this.defaultAvatarUrl;
		},
	},
	methods: {
		...mapActions('auth', ['logout',]),
		async loadService() {
			try {
				const response = await this.$store.dispatch('categorie/getAll');
				this.services = response;
			} catch (error) {
				console.error('Erreur lors de l\'ajout de l\'élément fonction :', error);
			}
		},
		async logout() {
			this.$store.dispatch('auth/logout');  // Appel de l'action 'logout'
		}

	},
};



const storedTheme = localStorage.getItem("theme");

const getPreferredTheme = () => {
	if (storedTheme) {
		return storedTheme;
	}
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
};

const setTheme = function (theme) {
	if (
		theme === "auto" &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
	) {
		document.documentElement.setAttribute("data-bs-theme", "dark");
	} else {
		document.documentElement.setAttribute("data-bs-theme", theme);
	}
};

setTheme(getPreferredTheme());

window.addEventListener("DOMContentLoaded", () => {
	var el = document.querySelector(".theme-icon-active");
	if (el != "undefined" && el != null) {
		const showActiveTheme = (theme) => {
			const activeThemeIcon = document.querySelector(".theme-icon-active use");
			const btnToActive = document.querySelector(
				`[data-bs-theme-value="${theme}"]`
			);
			const svgOfActiveBtn = btnToActive
				.querySelector(".mode-switch use")
				.getAttribute("href");

			document.querySelectorAll("[data-bs-theme-value]").forEach((element) => {
				element.classList.remove("active");
			});

			btnToActive.classList.add("active");
			activeThemeIcon.setAttribute("href", svgOfActiveBtn);
		};

		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", () => {
				if (storedTheme !== "light" || storedTheme !== "dark") {
					setTheme(getPreferredTheme());
				}
			});

		showActiveTheme(getPreferredTheme());

		document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
			toggle.addEventListener("click", () => {
				const theme = toggle.getAttribute("data-bs-theme-value");
				localStorage.setItem("theme", theme);
				setTheme(theme);
				showActiveTheme(theme);
			});
		});
	}
});

</script>
