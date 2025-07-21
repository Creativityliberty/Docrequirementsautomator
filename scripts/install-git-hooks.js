const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const hookContent = `#!/bin/sh
# Post-commit hook pour mettre à jour le DM-log

# Récupérer le message de commit
COMMIT_MSG=$(git log -1 --pretty=%B)

# Extraire le nom de la tâche (supposons que le format est "Task: <nom de la tâche>")
TASK_NAME=$(echo "$COMMIT_MSG" | grep -oP "Task: \\K.*" || echo "")

if [ -n "$TASK_NAME" ]; then
  # Exécuter le script de mise à jour du DM-log
  node scripts/update-dm-log.js "$TASK_NAME" "Commit: $COMMIT_MSG" "Revue de code" "Tests"
  
  # Ajouter le DM-log mis à jour au commit
  git add docs/dm-log.md
  git commit --amend --no-edit
fi
`;

function installGitHooks() {
  const hooksDir = path.join(__dirname, '../.git/hooks');
  const postCommitPath = path.join(hooksDir, 'post-commit');
  
  // Vérifier si le répertoire .git/hooks existe
  if (!fs.existsSync(hooksDir)) {
    console.error('Répertoire .git/hooks non trouvé. Assurez-vous que vous êtes dans un dépôt Git.');
    process.exit(1);
  }
  
  // Écrire le hook post-commit
  fs.writeFileSync(postCommitPath, hookContent, 'utf8');
  fs.chmodSync(postCommitPath, '755'); // Rendre le script exécutable
  
  console.log('Hook post-commit installé avec succès.');
}

if (require.main === module) {
  installGitHooks();
}

module.exports = { installGitHooks };
