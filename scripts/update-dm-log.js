const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Met à jour le journal DM avec les résultats d'une tâche
 * @param {string} taskName - Nom de la tâche exécutée
 * @param {string} results - Résultats de la tâche
 * @param {string[]} nextSteps - Prochaines étapes à suivre
 */
function updateDMLog(taskName, results, nextSteps) {
  const dmLogPath = path.join(__dirname, '../docs/dm-log.md');
  const date = new Date().toISOString().split('T')[0];
  
  // Lire le contenu actuel
  let content = fs.readFileSync(dmLogPath, 'utf8');
  
  // Créer la nouvelle entrée
  const newEntry = `
### ${date} - ${taskName}

**Tâches accomplies :**
- ${taskName}

**Résultats :**
${results ? `- ${results.split('\n').join('\n- ')}` : '- Tâche exécutée avec succès'}

**Prochaines étapes :**
${nextSteps.map(step => `- ${step}`).join('\n')}
`;

  // Insérer la nouvelle entrée après la section "Résultats des étapes"
  const sectionMarker = '## Résultats des étapes';
  const insertPosition = content.indexOf(sectionMarker) + sectionMarker.length;
  
  content = content.slice(0, insertPosition) + newEntry + content.slice(insertPosition);
  
  // Écrire le contenu mis à jour
  fs.writeFileSync(dmLogPath, content, 'utf8');
  
  console.log(`Journal DM mis à jour avec la tâche: ${taskName}`);
}

// Exemple d'utilisation:
// node update-dm-log.js "Implémentation de la fonctionnalité X" "La fonctionnalité X a été implémentée avec succès" "Tester la fonctionnalité X" "Documenter l'API"

if (require.main === module) {
  const taskName = process.argv[2];
  const results = process.argv[3] || '';
  const nextSteps = process.argv.slice(4) || [];
  
  if (!taskName) {
    console.error('Veuillez fournir un nom de tâche');
    process.exit(1);
  }
  
  updateDMLog(taskName, results, nextSteps);
}

module.exports = { updateDMLog };
