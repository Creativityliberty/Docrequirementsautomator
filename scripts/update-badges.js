const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Met à jour les badges de qualité dans le README
 */
function updateBadges() {
  const readmePath = path.join(__dirname, '../README.md');
  const docsPath = path.join(__dirname, '../docs');
  
  // Lire le contenu actuel du README
  let readmeContent = fs.readFileSync(readmePath, 'utf8');
  
  // Calculer les métriques
  const docCompletionMetrics = calculateDocCompletionMetrics(docsPath);
  const taskCompletionMetrics = calculateTaskCompletionMetrics(path.join(docsPath, 'tasks.md'));
  const codeQualityMetrics = calculateCodeQualityMetrics();
  
  // Générer les badges
  const badgesSection = `
## Statut du Projet

![Documentation](https://img.shields.io/badge/Documentation-${docCompletionMetrics.percentage}%25-${getBadgeColor(docCompletionMetrics.percentage)})
![Tâches](https://img.shields.io/badge/Tâches-${taskCompletionMetrics.percentage}%25-${getBadgeColor(taskCompletionMetrics.percentage)})
![Qualité du Code](https://img.shields.io/badge/Qualité-${codeQualityMetrics.score}%2F10-${getBadgeColor(codeQualityMetrics.score * 10)})
![Dernière Mise à Jour](https://img.shields.io/badge/Dernière%20Mise%20à%20Jour-${new Date().toISOString().split('T')[0]}-blue)

### Métriques de Documentation
- **Exigences**: ${docCompletionMetrics.requirements}% complet
- **Conception**: ${docCompletionMetrics.design}% complet
- **Tâches**: ${docCompletionMetrics.tasks}% complet
- **Journal DM**: ${docCompletionMetrics.dmLog} entrées

### Progression des Tâches
- **Terminées**: ${taskCompletionMetrics.completed} tâches
- **En cours**: ${taskCompletionMetrics.inProgress} tâches
- **À faire**: ${taskCompletionMetrics.todo} tâches
- **Total**: ${taskCompletionMetrics.total} tâches
`;

  // Mettre à jour le README
  if (readmeContent.includes('## Statut du Projet')) {
    // Remplacer la section existante
    readmeContent = readmeContent.replace(/## Statut du Projet[\s\S]*?(?=##|$)/, badgesSection);
  } else {
    // Ajouter la section après le titre principal
    const titleEndPos = readmeContent.indexOf('\n', readmeContent.indexOf('# ')) + 1;
    readmeContent = readmeContent.slice(0, titleEndPos) + '\n' + badgesSection + readmeContent.slice(titleEndPos);
  }
  
  // Écrire le contenu mis à jour
  fs.writeFileSync(readmePath, readmeContent, 'utf8');
  
  console.log('Badges mis à jour dans le README');
}

/**
 * Calcule les métriques de complétion des documents
 */
function calculateDocCompletionMetrics(docsPath) {
  const metrics = {
    requirements: 0,
    design: 0,
    tasks: 0,
    dmLog: 0,
    percentage: 0
  };
  
  try {
    // Vérifier l'existence et la taille des fichiers
    const requirementsPath = path.join(docsPath, 'requirements.md');
    const designPath = path.join(docsPath, 'design.md');
    const tasksPath = path.join(docsPath, 'tasks.md');
    const dmLogPath = path.join(docsPath, 'dm-log.md');
    
    if (fs.existsSync(requirementsPath)) {
      const content = fs.readFileSync(requirementsPath, 'utf8');
      metrics.requirements = Math.min(100, Math.round(content.length / 5000 * 100));
    }
    
    if (fs.existsSync(designPath)) {
      const content = fs.readFileSync(designPath, 'utf8');
      metrics.design = Math.min(100, Math.round(content.length / 10000 * 100));
    }
    
    if (fs.existsSync(tasksPath)) {
      const content = fs.readFileSync(tasksPath, 'utf8');
      metrics.tasks = Math.min(100, Math.round(content.length / 5000 * 100));
    }
    
    if (fs.existsSync(dmLogPath)) {
      const content = fs.readFileSync(dmLogPath, 'utf8');
      metrics.dmLog = (content.match(/### \d{4}-\d{2}-\d{2}/g) || []).length;
    }
    
    // Calculer le pourcentage global
    metrics.percentage = Math.round((metrics.requirements + metrics.design + metrics.tasks) / 3);
  } catch (error) {
    console.error('Erreur lors du calcul des métriques de documentation:', error);
  }
  
  return metrics;
}

/**
 * Calcule les métriques de complétion des tâches
 */
function calculateTaskCompletionMetrics(tasksPath) {
  const metrics = {
    completed: 0,
    inProgress: 0,
    todo: 0,
    total: 0,
    percentage: 0
  };
  
  try {
    if (fs.existsSync(tasksPath)) {
      const content = fs.readFileSync(tasksPath, 'utf8');
      
      // Compter les tâches terminées, en cours et à faire
      metrics.completed = (content.match(/- \[x\]/g) || []).length;
      metrics.inProgress = (content.match(/- \[\.\]/g) || []).length;
      metrics.todo = (content.match(/- \[ \]/g) || []).length;
      metrics.total = metrics.completed + metrics.inProgress + metrics.todo;
      
      if (metrics.total > 0) {
        metrics.percentage = Math.round((metrics.completed / metrics.total) * 100);
      }
    }
  } catch (error) {
    console.error('Erreur lors du calcul des métriques de tâches:', error);
  }
  
  return metrics;
}

/**
 * Calcule les métriques de qualité du code
 */
function calculateCodeQualityMetrics() {
  const metrics = {
    score: 7 // Score par défaut
  };
  
  try {
    // Ici, vous pourriez intégrer des outils comme ESLint, SonarQube, etc.
    // Pour l'instant, nous utilisons un score statique
  } catch (error) {
    console.error('Erreur lors du calcul des métriques de qualité du code:', error);
  }
  
  return metrics;
}

/**
 * Détermine la couleur du badge en fonction du pourcentage
 */
function getBadgeColor(percentage) {
  if (percentage >= 90) return 'brightgreen';
  if (percentage >= 75) return 'green';
  if (percentage >= 50) return 'yellowgreen';
  if (percentage >= 25) return 'yellow';
  return 'red';
}

// Exécuter si appelé directement
if (require.main === module) {
  updateBadges();
}

module.exports = { updateBadges };
