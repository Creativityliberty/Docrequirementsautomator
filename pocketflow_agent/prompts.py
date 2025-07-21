"""
Module contenant les modèles de requête (prompts) pour l'API LLM Gemini.
Ces prompts sont utilisés pour générer du contenu pour les différents documents.
"""

# Prompt pour la mise à jour du DM-Log
DM_LOG_PROMPT = """
Tu es un assistant spécialisé dans la documentation de projets de développement logiciel.
Ta tâche est de générer une entrée pour un journal de décisions/réunions (DM-Log) basée sur les informations fournies.

## Contexte du projet
Le projet est un générateur automatique de documents de design basé sur PocketFlow et l'API Gemini.
Il permet de générer et maintenir à jour la documentation d'un projet de développement logiciel.

## Informations disponibles
- Nom de la tâche: {task_name}
- Date: {today}
- Résultats précédents: {task_results}
- Prochaines étapes prévues: {next_steps}
- Contenu actuel du DM-Log: {current_content}

## Instructions
1. Génère une nouvelle entrée pour le DM-Log au format Markdown.
2. L'entrée doit inclure:
   - Un titre avec la date et une description concise de la tâche
   - Une section "Tâches accomplies" listant les principales actions réalisées
   - Une section "Résultats" décrivant les résultats obtenus
   - Une section "Prochaines étapes" listant les actions à venir
3. Utilise un ton professionnel et concis.
4. Assure-toi que le format est cohérent avec le reste du DM-Log.
5. Ne répète pas les informations déjà présentes dans le DM-Log.
6. Sois précis et factuel.

Génère uniquement le contenu de la nouvelle entrée, sans ajouter d'explications supplémentaires.
"""

# Prompt pour la mise à jour du MCD et des garde-fous
MCD_PROMPT = """
Tu es un assistant spécialisé dans la modélisation conceptuelle de données et la documentation de projets.
Ta tâche est de mettre à jour un document décrivant le Modèle Conceptuel de Données (MCD) et les garde-fous du projet.

## Contexte du projet
Le projet est un générateur automatique de documents de design basé sur PocketFlow et l'API Gemini.
Il permet de générer et maintenir à jour la documentation d'un projet de développement logiciel.

## Structure du projet
{project_structure}

## Contenu actuel du document MCD
{current_content}

## Instructions
1. Analyse la structure du projet et identifie les entités principales, leurs attributs et leurs relations.
2. Mets à jour le document MCD en:
   - Ajoutant ou modifiant les entités identifiées
   - Précisant les relations entre ces entités
   - Décrivant les attributs principaux de chaque entité
   - Identifiant les contraintes d'intégrité
3. Mets à jour la section des garde-fous en:
   - Identifiant les règles métier à respecter
   - Définissant les limites et contraintes du système
   - Précisant les validations nécessaires
4. Utilise des diagrammes en syntaxe Mermaid pour illustrer le MCD.
5. Conserve le format Markdown et la structure existante du document.
6. Assure-toi que le contenu est cohérent avec l'état actuel du projet.

Génère le contenu complet du document MCD mis à jour, en conservant les sections existantes pertinentes.
"""

# Prompt pour la mise à jour de la structure du projet
PROJECT_STRUCTURE_PROMPT = """
Tu es un assistant spécialisé dans la documentation de projets de développement logiciel.
Ta tâche est de mettre à jour un document décrivant la structure du projet.

## Contexte du projet
Le projet est un générateur automatique de documents de design basé sur PocketFlow et l'API Gemini.
Il permet de générer et maintenir à jour la documentation d'un projet de développement logiciel.

## Structure actuelle du projet
{project_files}

## Contenu actuel du document
{current_content}

## Instructions
1. Analyse la structure actuelle du projet et identifie:
   - Les répertoires principaux et leur rôle
   - Les fichiers clés et leur fonction
   - Les dépendances principales
   - Les patterns d'architecture utilisés
2. Mets à jour le document en:
   - Décrivant la structure globale du projet
   - Expliquant l'organisation des répertoires
   - Détaillant les fichiers importants et leur rôle
   - Identifiant les composants principaux et leurs interactions
3. Utilise des diagrammes en syntaxe Mermaid pour illustrer la structure.
4. Organise le document de manière logique et hiérarchique.
5. Conserve le format Markdown et la structure existante du document.
6. Assure-toi que le contenu est à jour avec l'état actuel du projet.

Génère le contenu complet du document de structure mis à jour, en conservant les sections existantes pertinentes.
"""

# Prompt pour la mise à jour des tâches
TASKS_PROMPT = """
Tu es un assistant spécialisé dans la planification et la documentation de projets de développement logiciel.
Ta tâche est de mettre à jour un document décrivant les tâches du projet.

## Contexte du projet
Le projet est un générateur automatique de documents de design basé sur PocketFlow et l'API Gemini.
Il permet de générer et maintenir à jour la documentation d'un projet de développement logiciel.

## Structure actuelle du projet
{project_files}

## Contenu actuel du document de tâches
{current_content}

## Contenu du document d'exigences
{requirements_content}

## Instructions
1. Analyse la structure actuelle du projet et les exigences.
2. Identifie les tâches déjà accomplies et celles qui restent à faire.
3. Mets à jour le document de tâches en:
   - Marquant les tâches terminées comme [x]
   - Ajoutant de nouvelles tâches si nécessaire
   - Organisant les tâches par priorité et par composant
   - Estimant la complexité de chaque tâche (Faible, Moyenne, Élevée)
4. Pour chaque tâche, inclus:
   - Une description claire
   - Les dépendances avec d'autres tâches
   - Les critères d'acceptation
5. Conserve le format Markdown et la structure existante du document.
6. Assure-toi que le contenu est cohérent avec l'état actuel du projet.

Génère le contenu complet du document de tâches mis à jour, en conservant les sections existantes pertinentes.
"""

# Prompt pour la mise à jour des exigences
REQUIREMENTS_PROMPT = """
Tu es un assistant spécialisé dans l'analyse des exigences et la documentation de projets de développement logiciel.
Ta tâche est de mettre à jour un document décrivant les exigences du projet.

## Contexte du projet
Le projet est un générateur automatique de documents de design basé sur PocketFlow et l'API Gemini.
Il permet de générer et maintenir à jour la documentation d'un projet de développement logiciel.

## Structure actuelle du projet
{project_files}

## Contenu actuel du document d'exigences
{current_content}

## Instructions
1. Analyse la structure actuelle du projet.
2. Identifie les exigences fonctionnelles et non-fonctionnelles du projet.
3. Mets à jour le document d'exigences en:
   - Organisant les exigences par catégorie (Fonctionnelles, Non-fonctionnelles, Techniques)
   - Attribuant un identifiant unique à chaque exigence (ex: REQ-F-001)
   - Précisant la priorité de chaque exigence (Critique, Élevée, Moyenne, Faible)
   - Indiquant le statut de chaque exigence (Implémentée, En cours, Planifiée)
4. Pour chaque exigence, inclus:
   - Une description claire et concise
   - Des critères d'acceptation mesurables
   - Des contraintes associées si applicable
5. Conserve le format Markdown et la structure existante du document.
6. Assure-toi que le contenu est cohérent avec l'état actuel du projet.

Génère le contenu complet du document d'exigences mis à jour, en conservant les sections existantes pertinentes.
"""

# Prompt pour la génération du dashboard ASCII
DASHBOARD_PROMPT = """
Tu es un assistant spécialisé dans la visualisation de données et la création de dashboards.
Ta tâche est de générer un dashboard ASCII pour afficher l'état d'un flow PocketFlow.

## Contexte
Le dashboard doit afficher l'état d'un flow PocketFlow qui automatise la mise à jour de documents.

## Données disponibles
- Nom du flow: {flow_name}
- État global: {flow_status}
- Progression: {completed_nodes}/{total_nodes} nodes
- Nodes terminés: {completed_node_names}
- Node en cours: {current_node}
- Erreurs: {errors}
- Temps écoulé: {elapsed_time}

## Instructions
1. Génère un dashboard ASCII avec:
   - Un titre clair
   - Une barre de progression
   - L'état de chaque node (✓ pour terminé, ⚠ pour erreur, ⚙ pour en cours, ⏳ pour en attente)
   - Un résumé des erreurs s'il y en a
   - Le temps écoulé
2. Utilise des caractères ASCII et Unicode simples pour la mise en forme.
3. Assure-toi que le dashboard est lisible et bien structuré.
4. Limite la largeur à 80 caractères maximum.
5. Inclus des informations sur les prochaines actions à effectuer.

Génère uniquement le dashboard ASCII, sans ajouter d'explications supplémentaires.
"""
