# StageConnect Maroc

Application web permettant de connecter les étudiants marocains avec des entreprises proposant des stages (PFA, PFE, stages d'observation).

## Fonctionnalités

- Authentification (étudiants, entreprises, administrateurs)
- Publication et recherche d'offres de stage
- Filtrage par type de stage, domaine, ville, etc.
- Profils étudiants avec CV et compétences
- Profils entreprises avec description et historique
- Candidatures en ligne
- Tableau de bord analytique
- Système de notifications

## Installation

### Prérequis
- Node.js (v14+)
- MongoDB
- npm ou yarn

### Étapes pour exécuter l'application

1. **Cloner le dépôt**
   ```bash
   git clone <URL_DU_DEPOT>
   cd find_internship
   ```

2. **Configurer les variables d'environnement**
   - Créez un fichier `.env` dans le dossier `backend` avec les variables suivantes :
     ```env
     MONGO_URI=mongodb://localhost:27017/stageconnect
     JWT_SECRET=your_jwt_secret
     ```

3. **Démarrer le backend**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Le backend sera accessible sur `http://localhost:5000`.

4. **Démarrer le frontend**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```
   Le frontend sera accessible sur `http://localhost:3000`.

## Technologies utilisées

- **Backend** : Node.js, Express, MongoDB, Mongoose
- **Frontend** : React.js, React Router, Bootstrap
- **Authentification** : JSON Web Tokens (JWT)
- **UI** : React-Bootstrap

## Accès à l'application

- Frontend : `http://localhost:3000`
- Backend API : `http://localhost:5000`

## Développement

Pour contribuer au projet, créez une branche, apportez vos modifications et soumettez une pull request.
