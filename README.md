# BeeBank

Application web full-stack minimale avec un backend Spring Boot et un frontend Angular.

## Prérequis

- Java 21
- Maven 3.9+
- Node.js 22+ et npm
- Docker et Docker Compose

## Démarrer PostgreSQL

Copiez le fichier d'exemple puis démarrez le conteneur :

```bash
cp .env .env
docker compose up -d
```

Les valeurs de développement du fichier `.env.example` sont uniquement destinées à l'environnement local. Ne versionnez jamais le fichier `.env`.

## Démarrer Spring Boot

Avec PostgreSQL démarré, lancez le profil local :

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Liquibase crée et met à jour le schéma. Hibernate le valide uniquement.

## Déploiement Render + Neon

### 1. Créer la base Neon

1. Créez un projet dans la [console Neon](https://console.neon.tech), puis ouvrez ses informations de connexion.
2. Relevez le host, le nom de la base, le nom d'utilisateur et le mot de passe. Conservez ce dernier dans un gestionnaire de secrets.
3. Construisez l'URL JDBC sans identifiants intégrés : `jdbc:postgresql://HOST/DATABASE?sslmode=require`.

### 2. Déployer le backend sur Render

1. Poussez ce dépôt vers GitHub.
2. Dans Render, créez un **Web Service** depuis ce dépôt, avec `backend` comme *Root Directory* et Docker comme environnement.
3. Configurez le *Health Check Path* avec `/actuator/health`.
4. Ajoutez ces variables d'environnement dans Render :

   | Variable | Valeur |
   | --- | --- |
   | `SPRING_PROFILES_ACTIVE` | `prod` |
   | `DB_URL` | URL JDBC Neon avec `sslmode=require` |
   | `DB_USERNAME` | utilisateur Neon |
   | `DB_PASSWORD` | mot de passe Neon |
   | `FRONTEND_URL` | origine du site Angular, par exemple `https://mon-frontend.onrender.com` |

Le conteneur utilise automatiquement le port `PORT` fourni par Render. Liquibase applique les migrations non exécutées et Hibernate valide uniquement le schéma ; aucune donnée n'est supprimée ou recréée. Le pool de production est limité à deux connexions.

### 3. Déployer le frontend sur Render

1. Créez un **Static Site** Render depuis le même dépôt, avec `frontend` comme *Root Directory*.
2. Utilisez la commande de build `npm ci && npm run build`.
3. Utilisez `dist/beebank-frontend/browser` comme *Publish Directory*.
4. Ajoutez la variable de build `API_URL` avec l'URL publique du Web Service Render, sans `/api` final, par exemple `https://mon-backend.onrender.com`.
5. Une fois l'URL publique du Static Site connue, reportez-la dans `FRONTEND_URL` du Web Service, puis redéployez le backend.

Lors du build de production, `API_URL` construit la configuration du frontend. Sans cette variable, le frontend utilise `/api`, ce qui conserve le proxy Angular en local. Aucun secret n'est stocké dans ce dépôt.

## Démarrer Angular

Dans un autre terminal :

```bash
cd frontend
npm install
npm start
```

Le serveur Angular utilise `proxy.conf.json` : les appels vers `/api` sont redirigés vers le backend local.

## URLs

- Frontend : [http://localhost:4200](http://localhost:4200)
- Backend : [http://localhost:8080](http://localhost:8080)
- API des messages : [http://localhost:8080/api/messages](http://localhost:8080/api/messages)
- Actuator : [http://localhost:8080/actuator](http://localhost:8080/actuator)
