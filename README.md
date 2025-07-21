# Design Doc Automator - Interface Web

Une interface web moderne pour générer des documents de design basés sur le framework PocketFlow et l'API Gemini.

## 🚀 Fonctionnalités

- **Génération de documents** à partir de templates
- **Adaptation de documents existants** pour de nouveaux projets
- **Gestion des templates** personnalisés
- **Historique des documents** générés
- **Intégration avec l'API Gemini** pour une génération intelligente
- **Support des serveurs MCP** pour enrichir les documents

## 🛠️ Technologies utilisées

### Backend
- Node.js avec Express
- API RESTful
- Intégration avec l'API Gemini

### Frontend
- React.js
- Material-UI
- React Router
- React Markdown

## 📋 Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- Clé API Gemini

## 🔧 Installation

### Cloner le dépôt
```bash
git clone <repository-url>
cd design-doc-automator
```

### Installer les dépendances du backend
```bash
cd backend
npm install
```

### Installer les dépendances du frontend
```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend
Créez un fichier `.env` dans le dossier `backend` avec les variables suivantes :
```
PORT=3001
GEMINI_API_KEY=votre_clé_api_gemini
```

### Frontend
Créez un fichier `.env` dans le dossier `frontend` avec les variables suivantes :
```
REACT_APP_API_URL=http://localhost:3001/api
```

## 🚀 Démarrage

### Démarrer le backend
```bash
cd backend
npm run dev
```

### Démarrer le frontend
```bash
cd frontend
npm start
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## 📚 Guide d'utilisation

### Générer un document
1. Accédez à la page "Générer"
2. Remplissez le formulaire avec les informations du projet
3. Cliquez sur "Générer"
4. Prévisualisez et téléchargez le document généré

### Adapter un document existant
1. Accédez à la page "Générer"
2. Sélectionnez l'option "Adapter un document existant"
3. Téléchargez ou collez le contenu du document à adapter
4. Remplissez les informations du nouveau projet
5. Cliquez sur "Adapter"

### Gérer les templates
1. Accédez à la page "Templates"
2. Visualisez, modifiez ou créez des templates
3. Importez ou exportez des templates

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## 📄 Licence

Ce projet est sous licence MIT.