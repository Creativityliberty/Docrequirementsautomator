const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Détermine la classe CSS pour la barre de progression
 */
function getProgressClass(value) {
  if (value >= 75) return 'progress-success';
  if (value >= 50) return 'progress-warning';
  return 'progress-danger';
}

/**
 * Détermine la classe CSS pour le badge
 */
function getBadgeClass(value) {
  if (value >= 7.5) return 'success';
  if (value >= 5) return 'warning';
  return 'danger';
}

/**
 * Génère un tableau de bord HTML pour le suivi du projet
 */
function generateDashboard() {
  const outputPath = path.join(__dirname, '../docs/dashboard.html');
  const docsPath = path.join(__dirname, '../docs');
  
  // Collecter les données
  const projectMetrics = collectProjectMetrics(docsPath);
  const taskProgress = collectTaskProgress(docsPath);
  const docQuality = collectDocQuality(docsPath);
  const recentActivity = collectRecentActivity(docsPath);
  
  // Générer le HTML
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tableau de Bord - Design Doc Automator</title>
  <style>
    :root {
      --primary: #3498db;
      --success: #2ecc71;
      --warning: #f39c12;
      --danger: #e74c3c;
      --dark: #34495e;
      --light: #ecf0f1;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f7fa;
      color: #333;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    header {
      background-color: var(--dark);
      color: white;
      padding: 20px;
      text-align: center;
      margin-bottom: 30px;
      border-radius: 5px;
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .card {
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    
    .card-header {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    
    .metric {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    
    .metric-name {
      font-weight: 500;
    }
    
    .progress-bar {
      height: 10px;
      background-color: #eee;
      border-radius: 5px;
      margin-top: 5px;
      overflow: hidden;
    }
    
    .progress-value {
      height: 100%;
      border-radius: 5px;
    }
    
    .activity-item {
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    
    .activity-date {
      font-size: 12px;
      color: #777;
    }
    
    .chart-container {
      height: 300px;
    }
    
    footer {
      text-align: center;
      padding: 20px;
      color: #777;
      font-size: 14px;
    }
    
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 12px;
      font-weight: bold;
      color: white;
    }
    
    .badge-success { background-color: var(--success); }
    .badge-warning { background-color: var(--warning); }
    .badge-danger { background-color: var(--danger); }
    .badge-primary { background-color: var(--primary); }
    
    .progress-success { background-color: var(--success); }
    .progress-warning { background-color: var(--warning); }
    .progress-danger { background-color: var(--danger); }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <header>
    <h1>Tableau de Bord - Design Doc Automator</h1>
    <p>Dernière mise à jour: ${new Date().toLocaleString('fr-FR')}</p>
  </header>
  
  <div class="container">
    <div class="dashboard-grid">
      <!-- Métriques du Projet -->
      <div class="card">
        <div class="card-header">Métriques du Projet</div>
        <div class="metric">
          <span class="metric-name">Complétion Documentation</span>
          <span>${projectMetrics.docCompletionPercentage}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-value ${getProgressClass(projectMetrics.docCompletionPercentage)}" style="width: ${projectMetrics.docCompletionPercentage}%"></div>
        </div>
        
        <div class="metric">
          <span class="metric-name">Avancement des Tâches</span>
          <span>${projectMetrics.taskCompletionPercentage}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-value ${getProgressClass(projectMetrics.taskCompletionPercentage)}" style="width: ${projectMetrics.taskCompletionPercentage}%"></div>
        </div>
        
        <div class="metric">
          <span class="metric-name">Qualité Globale</span>
          <span>${projectMetrics.qualityScore}/10</span>
        </div>
        <div class="progress-bar">
          <div class="progress-value ${getProgressClass(projectMetrics.qualityScore * 10)}" style="width: ${projectMetrics.qualityScore * 10}%"></div>
        </div>
      </div>
      
      <!-- Progression des Tâches -->
      <div class="card">
        <div class="card-header">Progression des Tâches</div>
        <div class="chart-container">
          <canvas id="taskChart"></canvas>
        </div>
      </div>
      
      <!-- Qualité des Documents -->
      <div class="card">
        <div class="card-header">Qualité des Documents</div>
        ${docQuality.map(doc => `
          <div class="metric">
            <span class="metric-name">${doc.name}</span>
            <span class="badge badge-${getBadgeClass(doc.score)}">${doc.score}/10</span>
          </div>
          <div class="progress-bar">
            <div class="progress-value ${getProgressClass(doc.score * 10)}" style="width: ${doc.score * 10}%"></div>
          </div>
        `).join('')}
      </div>
      
      <!-- Activité Récente -->
      <div class="card">
        <div class="card-header">Activité Récente</div>
        ${recentActivity.map(activity => `
          <div class="activity-item">
            <div>${activity.description}</div>
            <div class="activity-date">${activity.date}</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- Graphique d'évolution -->
    <div class="card">
      <div class="card-header">Évolution du Projet</div>
      <div class="chart-container">
        <canvas id="progressChart"></canvas>
      </div>
    </div>
  </div>
  
  <footer>
    <p>Généré automatiquement par Design Doc Automator</p>
    <p><a href="https://github.com/Creativityliberty/Docrequirementsautomator" target="_blank">GitHub Repository</a></p>
  </footer>
  
  <script>
    // Données pour les graphiques
    const taskData = {
      labels: ['Terminées', 'En cours', 'À faire'],
      datasets: [{
        data: [${taskProgress.completed}, ${taskProgress.inProgress}, ${taskProgress.todo}],
        backgroundColor: ['#2ecc71', '#f39c12', '#e74c3c'],
        hoverOffset: 4
      }]
    };
    
    const progressData = {
      labels: ['J-30', 'J-25', 'J-20', 'J-15', 'J-10', 'J-5', 'Aujourd\'hui'],
      datasets: [
        {
          label: 'Documentation',
          data: [20, 35, 45, 60, 70, 80, ${projectMetrics.docCompletionPercentage}],
          borderColor: '#3498db',
          tension: 0.1,
          fill: false
        },
        {
          label: 'Tâches',
          data: [10, 25, 30, 45, 55, 65, ${projectMetrics.taskCompletionPercentage}],
          borderColor: '#2ecc71',
          tension: 0.1,
          fill: false
        },
        {
          label: 'Qualité',
          data: [50, 55, 60, 65, 70, 75, ${projectMetrics.qualityScore * 10}],
          borderColor: '#f39c12',
          tension: 0.1,
          fill: false
        }
      ]
    };
    
    // Initialisation des graphiques
    window.onload = function() {
      const taskCtx = document.getElementById('taskChart').getContext('2d');
      new Chart(taskCtx, {
        type: 'doughnut',
        data: taskData,
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
      
      const progressCtx = document.getElementById('progressChart').getContext('2d');
      new Chart(progressCtx, {
        type: 'line',
        data: progressData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    };
    
    function getProgressClass(value) {
      if (value >= 75) return 'progress-success';
      if (value >= 50) return 'progress-warning';
      return 'progress-danger';
    }
    
    function getBadgeClass(value) {
      if (value >= 7.5) return 'success';
      if (value >= 5) return 'warning';
      return 'danger';
    }
  </script>
</body>
</html>
  `;
  
  // Écrire le fichier HTML
  fs.writeFileSync(outputPath, html, 'utf8');
  
  console.log(`Tableau de bord généré dans ${outputPath}`);
  return outputPath;
}

/**
 * Collecte les métriques globales du projet
 */
function collectProjectMetrics(docsPath) {
  // Dans un cas réel, ces métriques seraient calculées à partir des fichiers
  return {
    docCompletionPercentage: 85,
    taskCompletionPercentage: 65,
    qualityScore: 7.8
  };
}

/**
 * Collecte les données de progression des tâches
 */
function collectTaskProgress(docsPath) {
  const tasksPath = path.join(docsPath, 'tasks.md');
  
  if (fs.existsSync(tasksPath)) {
    const content = fs.readFileSync(tasksPath, 'utf8');
    
    return {
      completed: (content.match(/- \[x\]/g) || []).length,
      inProgress: (content.match(/- \[\.\]/g) || []).length,
      todo: (content.match(/- \[ \]/g) || []).length
    };
  }
  
  return {
    completed: 15,
    inProgress: 8,
    todo: 22
  };
}

/**
 * Collecte les données de qualité des documents
 */
function collectDocQuality(docsPath) {
  // Dans un cas réel, ces scores seraient calculés à partir d'une analyse des documents
  return [
    { name: 'Requirements', score: 8.5 },
    { name: 'Design', score: 7.8 },
    { name: 'Tasks', score: 9.2 },
    { name: 'DM-Log', score: 6.5 }
  ];
}

/**
 * Collecte les données d'activité récente
 */
function collectRecentActivity(docsPath) {
  const dmLogPath = path.join(docsPath, 'dm-log.md');
  const activities = [];
  
  if (fs.existsSync(dmLogPath)) {
    const content = fs.readFileSync(dmLogPath, 'utf8');
    const entries = content.match(/### (\d{4}-\d{2}-\d{2}) - (.*?)(?=\n\n)/g) || [];
    
    entries.slice(0, 5).forEach(entry => {
      const match = entry.match(/### (\d{4}-\d{2}-\d{2}) - (.*?)$/);
      if (match) {
        activities.push({
          date: match[1],
          description: match[2]
        });
      }
    });
  }
  
  if (activities.length === 0) {
    // Données d'exemple
    activities.push(
      { date: '2023-06-15', description: 'Initialisation du projet avec documentation' },
      { date: '2023-06-14', description: 'Revue Automatique de Documentation' },
      { date: '2023-06-12', description: 'Mise à jour des exigences' },
      { date: '2023-06-10', description: 'Implémentation de la génération de documents' },
      { date: '2023-06-08', description: 'Configuration initiale du projet' }
    );
  }
  
  return activities;
}

// Exécuter si appelé directement
if (require.main === module) {
  generateDashboard();
}

module.exports = { generateDashboard };
