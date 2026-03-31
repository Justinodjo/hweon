# Hweon - Projet de Gestion Immobilière

**Hweon** est une plateforme de gestion immobilière permettant aux gestionnaires, propriétaires, locataires et administrateurs de gérer des annonces, des visites, des transactions et des notifications. Le projet a été développé en tant que projet personnel, en utilisant **Vue.js** pour le frontend et **Spring Boot** pour le backend.

## Technologies utilisées

* **Frontend** : Vue.js, Bootstrap
* **Backend** : Spring Boot
* **Base de données** : PostgreSQL (ou autre base de données relationnelle)
* **Authentification** : JWT (JSON Web Tokens)
* **API documentation** : Springdoc OpenAPI (Swagger UI)
* **Notifications** : Web Push, Email
* **Sécurité** : Spring Security

## Rôle

**Développeur Full-Stack**
Développement de l'ensemble de la plateforme :

* **Frontend** : Création de l'interface utilisateur avec Vue.js et Bootstrap.
* **Backend** : Développement des API REST avec Spring Boot pour gérer la logique métier, l'authentification, et la persistance des données.
* **Gestion des transactions et des utilisateurs** : Mise en place de l'authentification et des permissions pour différents rôles d'utilisateurs (Gestionnaire, Locataire, Propriétaire, Administrateur).

## Fonctionnalités

Le projet **Hweon** offre plusieurs fonctionnalités clés pour une gestion immobilière fluide et complète :

* **Authentification** : Système de connexion avec gestion des rôles (Admin, Gestionnaire, Locataire, Propriétaire).
* **Annonces** : Création, modification, et suppression des annonces immobilières.
* **Visite** : Gestion des demandes et des réservations de visites pour les annonces.
* **Gestion des transactions** : Suivi des transactions financières liées à la location et à la gestion immobilière.
* **Notifications** : Notifications en temps réel pour les différents acteurs du système (Gestionnaires, Propriétaires, Locataires, Administrateurs) via Web Push et Email.
* **Interface responsive** : Le site est entièrement responsive, permettant aux utilisateurs d’accéder à la plateforme sur différents appareils (ordinateurs, tablettes, smartphones).
* **API RESTful** : Exposition de toutes les fonctionnalités via des API sécurisées.

## Installation

### Prérequis

Avant de commencer, vous aurez besoin des outils suivants :

* [Java 17+](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html) pour le backend (Spring Boot)
* [Node.js](https://nodejs.org/en/) pour le frontend (Vue.js)
* [PostgreSQL](https://www.postgresql.org/download/) ou une autre base de données compatible
* [Maven](https://maven.apache.org/install.html) pour la gestion des dépendances du backend

### 1. Clonez le projet

Clonez les deux repos (frontend et backend) pour démarrer le développement :

```bash id="0n4hr0"
git clone https://github.com/Justinodjo/hweon.git
cd hweon
```

### 2. Configuration de la base de données

Configurez la connexion à la base de données dans le fichier `application.properties` ou `application.yml` du backend :

```properties id="29l3t8"
spring.datasource.url=jdbc:postgresql://localhost:5432/hweon
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

### 3. Installation du frontend

Naviguez dans le dossier du frontend et installez les dépendances :

```bash id="47h9d4"
cd frontend
npm install
```

### 4. Lancer le backend

Dans le dossier du backend, lancez l'application avec Maven :

```bash id="21d4v9"
mvn spring-boot:run
```

Cela démarre l'application backend sur `http://localhost:8080`.

### 5. Lancer le frontend

Dans le dossier du frontend, démarrez l'application Vue.js avec Vite :

```bash id="09gews"
npm run dev
```

Cela démarre le serveur de développement sur `http://localhost:3000`.

## Documentation de l'API

La documentation de l'API est automatiquement générée via **Springdoc OpenAPI** (Swagger UI). Après avoir démarré le backend, vous pouvez accéder à l'interface Swagger à l'adresse suivante pour tester et explorer les endpoints :

```bash id="6m4dfp"
http://localhost:8080/swagger-ui.html
```

## Sécurité et Authentification

L'application utilise **Spring Security** et des **JWT** pour sécuriser les endpoints. Les utilisateurs doivent se connecter via l'endpoint `/login` pour obtenir un token JWT qui devra être utilisé pour authentifier les autres requêtes.

Exemple de requête pour obtenir un JWT (POST /login) :

```bash id="j5d6t8"
curl -X POST http://localhost:8080/login -d "username=admin&password=your_password"
```

Une fois le token obtenu, vous pouvez l'ajouter dans les headers des requêtes suivantes :

```bash id="6g2o15"
Authorization: Bearer <your_token>
```

## Tests

L'application comprend des tests unitaires et d'intégration pour s'assurer que tout fonctionne correctement.

Pour exécuter les tests avec Maven :

```bash id="jc3ex6"
mvn test
```

## Déploiement

Le projet est prêt à être déployé sur un serveur distant ou un service de cloud comme AWS, Heroku, ou Google Cloud. Pour un déploiement simple, il suffit de créer un fichier JAR avec Maven :

```bash id="jwy6od"
mvn clean package
```

Cela génère un fichier JAR dans le dossier `target/`, que vous pouvez ensuite déployer sur votre serveur.

## Lien GitHub

* **Code du projet** : [https://github.com/Justinodjo/hweon.git](https://github.com/Justinodjo/hweon.git)
* **Live Demo** : (Ajoute le lien vers la démo en ligne si elle existe)

## Structure du projet

Voici un aperçu de la structure du projet :

```bash id="3zht6w"
hweon/
├── backend/                    # Code source du backend (Spring Boot)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/immoservice/
│   │   │   ├── resources/
│   └── pom.xml                  # Dépendances du backend
├── frontend/                   # Code source du frontend (Vue.js)
│   ├── src/
│   ├── public/
│   └── package.json             # Dépendances du frontend
└── README.md                   # Ce fichier
```

## Contribuer

Les contributions sont les bienvenues ! Pour contribuer, suivez ces étapes :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité ou correction de bug
3. Effectuez vos modifications
4. Soumettez une pull request

## Licence

Ce projet est sous licence **MIT**. Consultez le fichier `LICENSE` pour plus d'informations.

---

**Hweon - Gestion Immobilière** : Une plateforme moderne pour la gestion des annonces, des transactions et des visites dans le secteur immobilier.
