const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { updateDMLog } = require('./update-dm-log');

/**
 * Automatise la revue de documentation
 */
function reviewDocumentation() {
  const docsPath = path.join(__dirname, '../docs');
  const reviewDate = new Date().toISOString().split('T')[0];
  const reviewResults = [];
  
  console.log('Démarrage de la revue de documentation...');
  
  // Vérifier chaque document
  reviewResults.push(...reviewRequirements(docsPath));
  reviewResults.push(...reviewDesign(docsPath));
  reviewResults.push(...reviewTasks(docsPath));
  reviewResults.push(...reviewDMLog(docsPath));
  
  // Générer le rapport de revue
  const reviewReport = generateReviewReport(reviewResults);
  
  // Sauvegarder le rapport dans un fichier
  const reportPath = path.join(docsPath, 'review-reports', `review-${reviewDate}.md`);
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, reviewReport, 'utf8');
  
  console.log(`Rapport de revue sauvegardé dans ${reportPath}`);
  
  // Mettre à jour le DM-log
  const dmLogEntry = `Revue de documentation effectuée. ${reviewResults.filter(r => r.type === 'warning').length} avertissements et ${reviewResults.filter(r => r.type === 'error').length} erreurs détectés.`;
  updateDMLog('Revue Automatique de Documentation', dmLogEntry, ['Corriger les problèmes identifiés', 'Mettre à jour la documentation']);
  
  return reviewResults;
}

/**
 * Revue du document des exigences
 */
function reviewRequirements(docsPath) {
  const results = [];
  const requirementsPath = path.join(docsPath, 'requirements.md');
  
  if (!fs.existsSync(requirementsPath)) {
    results.push({
      type: 'error',
      document: 'requirements.md',
      message: 'Le document des exigences est manquant'
    });
    return results;
  }
  
  const content = fs.readFileSync(requirementsPath, 'utf8');
  
  // Vérifier la présence d'une introduction
  if (!content.includes('## Introduction')) {
    results.push({
      type: 'warning',
      document: 'requirements.md',
      message: 'Le document des exigences ne contient pas de section Introduction'
    });
  }
  
  // Vérifier la présence d'exigences
  if (!content.includes('## Requirements') && !content.includes('## Exigences')) {
    results.push({
      type: 'error',
      document: 'requirements.md',
      message: 'Le document des exigences ne contient pas de section Requirements/Exigences'
    });
  }
  
  // Vérifier la présence de user stories
  if (!content.includes('User Story')) {
    results.push({
      type: 'warning',
      document: 'requirements.md',
      message: 'Le document des exigences ne contient pas de User Stories'
    });
  }
  
  // Vérifier la présence de critères d'acceptation
  if (!content.includes('Acceptance Criteria') && !content.includes('Critères d\'acceptation')) {
    results.push({
      type: 'warning',
      document: 'requirements.md',
      message: 'Le document des exigences ne contient pas de critères d\'acceptation'
    });
  }
  
  return results;
}

/**
 * Revue du document de conception
 */
function reviewDesign(docsPath) {
  const results = [];
  const designPath = path.join(docsPath, 'design.md');
  
  if (!fs.existsSync(designPath)) {
    results.push({
      type: 'error',
      document: 'design.md',
      message: 'Le document de conception est manquant'
    });
    return results;
  }
  
  const content = fs.readFileSync(designPath, 'utf8');
  
  // Vérifier la présence d'une architecture
  if (!content.includes('## Architecture')) {
    results.push({
      type: 'warning',
      document: 'design.md',
      message: 'Le document de conception ne contient pas de section Architecture'
    });
  }
  
  // Vérifier la présence de composants
  if (!content.includes('## Composants') && !content.includes('## Components')) {
    results.push({
      type: 'warning',
      document: 'design.md',
      message: 'Le document de conception ne contient pas de section Composants'
    });
  }
  
  // Vérifier la présence de diagrammes
  if (!content.includes('```mermaid')) {
    results.push({
      type: 'warning',
      document: 'design.md',
      message: 'Le document de conception ne contient pas de diagrammes Mermaid'
    });
  }
  
  return results;
}

/**
 * Revue du document des tâches
 */
function reviewTasks(docsPath) {
  const results = [];
  const tasksPath = path.join(docsPath, 'tasks.md');
  
  if (!fs.existsSync(tasksPath)) {
    results.push({
      type: 'error',
      document: 'tasks.md',
      message: 'Le document des tâches est manquant'
    });
    return results;
  }
  
  const content = fs.readFileSync(tasksPath, 'utf8');
  
  // Vérifier la présence de tâches
  const completedTasks = (content.match(/- \[x\]/g) || []).length;
  const inProgressTasks = (content.match(/- \[\.\]/g) || []).length;
  const todoTasks = (content.match(/- \[ \]/g) || []).length;
  
  if (completedTasks + inProgressTasks + todoTasks === 0) {
    results.push({
      type: 'error',
      document: 'tasks.md',
      message: 'Le document des tâches ne contient aucune tâche'
    });
  }
  
  // Vérifier la progression des tâches
  if (completedTasks === 0 && (inProgressTasks > 0 || todoTasks > 0)) {
    results.push({
      type: 'warning',
      document: 'tasks.md',
      message: 'Aucune tâche n\'est marquée comme terminée'
    });
  }
  
  return results;
}

/**
 * Revue du journal DM
 */
function reviewDMLog(docsPath) {
  const results = [];
  const dmLogPath = path.join(docsPath, 'dm-log.md');
  
  if (!fs.existsSync(dmLogPath)) {
    results.push({
      type: 'error',
      document: 'dm-log.md',
      message: 'Le journal DM est manquant'
    });
    return results;
  }
  
  const content = fs.readFileSync(dmLogPath, 'utf8');
  
  // Vérifier la présence d'entrées
  const entries = content.match(/### \d{4}-\d{2}-\d{2}/g) || [];
  
  if (entries.length === 0) {
    results.push({
      type: 'warning',
      document: 'dm-log.md',
      message: 'Le journal DM ne contient aucune entrée'
    });
  }
  
  // Vérifier la date de la dernière entrée
  if (entries.length > 0) {
    const lastEntryDate = entries[0].replace('### ', '');
    const today = new Date().toISOString().split('T')[0];
    const daysSinceLastEntry = Math.floor((new Date(today) - new Date(lastEntryDate)) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastEntry > 7) {
      results.push({
        type: 'warning',
        document: 'dm-log.md',
        message: `La dernière entrée du journal DM date de ${daysSinceLastEntry} jours`
      });
    }
  }
  
  return results;
}

/**
 * Génère un rapport de revue
 */
function generateReviewReport(results) {
  const reviewDate = new Date().toISOString().split('T')[0];
  const errors = results.filter(r => r.type === 'error');
  const warnings = results.filter(r => r.type === 'warning');
  
  let report = `# Rapport de Revue de Documentation - ${reviewDate}\n\n`;
  
  report += `## Résumé\n\n`;
  report += `- **Erreurs**: ${errors.length}\n`;
  report += `- **Avertissements**: ${warnings.length}\n`;
  report += `- **Total**: ${results.length}\n\n`;
  
  if (errors.length > 0) {
    report += `## Erreurs\n\n`;
    errors.forEach(error => {
      report += `- **${error.document}**: ${error.message}\n`;
    });
    report += '\n';
  }
  
  if (warnings.length > 0) {
    report += `## Avertissements\n\n`;
    warnings.forEach(warning => {
      report += `- **${warning.document}**: ${warning.message}\n`;
    });
    report += '\n';
  }
  
  report += `## Recommandations\n\n`;
  
  if (errors.length > 0) {
    report += `- Corriger les erreurs identifiées en priorité\n`;
  }
  
  if (warnings.length > 0) {
    report += `- Adresser les avertissements pour améliorer la qualité de la documentation\n`;
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    report += `- La documentation est en bon état, continuer à la maintenir à jour\n`;
  }
  
  return report;
}

// Exécuter si appelé directement
if (require.main === module) {
  reviewDocumentation();
}

module.exports = { reviewDocumentation };
