#!/usr/bin/env python3
"""
Tests d'intégration pour le système PocketFlow
"""

import os
import sys
import unittest
from unittest.mock import MagicMock, patch, mock_open
import tempfile
import json
import shutil

# Ajouter le répertoire parent au path pour pouvoir importer pocketflow_agent
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pocketflow_agent.nodes.node import BaseNode
from pocketflow_agent.flow import Flow
from pocketflow_agent.llm import LLMClient
from pocketflow_agent.nodes.dm_log_nodes import (
    GitCommitNode,
    DMLogParserNode,
    DMLogLLMNode,
    DMLogUpdateNode,
    GitPushNode
)
from pocketflow_agent.nodes.doc_update_nodes import (
    ModelConceptUpdateNode,
    ProjectStructureUpdateNode,
    TasksUpdateNode,
    RequirementsUpdateNode
)

class TestIntegrationFlow(unittest.TestCase):
    """
    Tests d'intégration pour le flow complet PocketFlow
    """
    
    def setUp(self):
        """
        Préparation des tests d'intégration
        """
        # Créer un répertoire temporaire pour les tests
        self.test_dir = tempfile.mkdtemp()
        
        # Créer des fichiers de test
        self.dm_log_path = os.path.join(self.test_dir, "dm-log.md")
        self.mcd_path = os.path.join(self.test_dir, "mcd-guardrails.md")
        self.structure_path = os.path.join(self.test_dir, "project-structure.md")
        self.tasks_path = os.path.join(self.test_dir, "tasks.md")
        self.requirements_path = os.path.join(self.test_dir, "requirements.md")
        
        # Contenu initial des fichiers
        dm_log_content = """# Journal des Décisions et Réunions (DM-Log)

## 2023-01-01 - Initialisation du projet
...
"""
        
        mcd_content = """# Modèle Conceptuel de Données et Garde-fous

## Entités principales
...
"""
        
        structure_content = """# Structure du Projet

## Organisation des répertoires
...
"""
        
        tasks_content = """# Tâches d'implémentation

## Backlog
...
"""
        
        requirements_content = """# Exigences du Projet

## Exigences fonctionnelles
...
"""
        
        # Écrire le contenu initial dans les fichiers
        with open(self.dm_log_path, 'w') as f:
            f.write(dm_log_content)
        
        with open(self.mcd_path, 'w') as f:
            f.write(mcd_content)
        
        with open(self.structure_path, 'w') as f:
            f.write(structure_content)
        
        with open(self.tasks_path, 'w') as f:
            f.write(tasks_content)
        
        with open(self.requirements_path, 'w') as f:
            f.write(requirements_content)
    
    def tearDown(self):
        """
        Nettoyage après les tests
        """
        # Supprimer le répertoire temporaire
        shutil.rmtree(self.test_dir)
    
    @patch('pocketflow_agent.llm.LLMClient.generate_text')
    @patch('subprocess.check_output')
    def test_dm_log_flow(self, mock_check_output, mock_generate_text):
        """
        Test du flow de mise à jour du DM-Log
        """
        # Configurer les mocks
        mock_check_output.return_value = b"Task: Test task"
        mock_generate_text.return_value = """## 2023-01-02 - Test task

### Tâches accomplies
- Tâche 1
- Tâche 2

### Résultats
- Résultat 1
- Résultat 2

### Prochaines étapes
- Étape 1
- Étape 2
"""
        
        # Créer les nodes
        git_commit_node = GitCommitNode()
        dm_log_parser_node = DMLogParserNode(path=self.dm_log_path)
        dm_log_llm_node = DMLogLLMNode(api_key="test_key", test_mode=True)
        dm_log_update_node = DMLogUpdateNode(path=self.dm_log_path)
        
        # Créer le flow
        flow = Flow([
            git_commit_node,
            dm_log_parser_node,
            dm_log_llm_node,
            dm_log_update_node
        ], name="DM-Log Update Flow")
        
        # Exécuter le flow
        with patch('builtins.print'):  # Supprimer les sorties console
            result = flow.run()
        
        # Vérifier que le flow s'est exécuté avec succès
        self.assertEqual(result["flow"]["status"], "completed")
        
        # Vérifier que le fichier a été mis à jour
        with open(self.dm_log_path, 'r') as f:
            content = f.read()
            self.assertIn("## 2023-01-02 - Test task", content)
            self.assertIn("### Tâches accomplies", content)
            self.assertIn("### Résultats", content)
            self.assertIn("### Prochaines étapes", content)
    
    @patch('pocketflow_agent.llm.LLMClient.generate_text')
    @patch('subprocess.check_output')
    def test_full_update_flow(self, mock_check_output, mock_generate_text):
        """
        Test du flow complet de mise à jour de tous les documents
        """
        # Configurer les mocks
        mock_check_output.return_value = b"Task: Test task"
        
        # Définir les réponses LLM pour chaque type de document
        def mock_llm_response(prompt):
            if "DM-Log" in prompt:
                return """## 2023-01-02 - Test task

### Tâches accomplies
- Tâche 1
- Tâche 2

### Résultats
- Résultat 1
- Résultat 2

### Prochaines étapes
- Étape 1
- Étape 2
"""
            elif "MCD" in prompt:
                return """# Modèle Conceptuel de Données et Garde-fous

## Entités principales
- Entité 1
- Entité 2

## Relations
- Relation 1
- Relation 2

## Garde-fous
- Règle 1
- Règle 2
"""
            elif "structure du projet" in prompt:
                return """# Structure du Projet

## Organisation des répertoires
- Répertoire 1
- Répertoire 2

## Fichiers clés
- Fichier 1
- Fichier 2
"""
            elif "tâches" in prompt:
                return """# Tâches d'implémentation

## Backlog
- [x] Tâche terminée
- [ ] Tâche à faire

## En cours
- Tâche en cours
"""
            elif "exigences" in prompt:
                return """# Exigences du Projet

## Exigences fonctionnelles
- REQ-F-001: Exigence 1
- REQ-F-002: Exigence 2

## Exigences non-fonctionnelles
- REQ-NF-001: Exigence 3
- REQ-NF-002: Exigence 4
"""
            else:
                return """
+-------------------------------------------------------+
| PocketFlow Update Flow – Résultat: ✅ Terminé         |
+-------------------------------------------------------+
| ✅ DM-Log auto-update                                |
| ✅ MCD & Garde-fous auto-update                       |
| ✅ Structure Projet auto-update                      |
| ✅ Tâches auto-update                                |
| ✅ Exigences auto-update                             |
+-------------------------------------------------------+
"""
        
        mock_generate_text.side_effect = mock_llm_response
        
        # Créer les nodes
        git_commit_node = GitCommitNode()
        dm_log_parser_node = DMLogParserNode(path=self.dm_log_path)
        dm_log_llm_node = DMLogLLMNode(api_key="test_key", test_mode=True)
        dm_log_update_node = DMLogUpdateNode(path=self.dm_log_path)
        
        mcd_update_node = ModelConceptUpdateNode(
            path=self.mcd_path
        )
        mcd_update_node.llm = LLMClient(api_key="test_key", test_mode=True)
        
        structure_update_node = ProjectStructureUpdateNode(
            path=self.structure_path
        )
        structure_update_node.llm = LLMClient(api_key="test_key", test_mode=True)
        
        tasks_update_node = TasksUpdateNode(
            path=self.tasks_path
        )
        tasks_update_node.llm = LLMClient(api_key="test_key", test_mode=True)
        
        requirements_update_node = RequirementsUpdateNode(
            path=self.requirements_path
        )
        requirements_update_node.llm = LLMClient(api_key="test_key", test_mode=True)
        
        # Créer le flow complet
        flow = Flow([
            git_commit_node,
            dm_log_parser_node,
            dm_log_llm_node,
            dm_log_update_node,
            mcd_update_node,
            structure_update_node,
            tasks_update_node,
            requirements_update_node
        ], name="Full Update Flow", api_key="test_key")
        
        # Exécuter le flow
        with patch('builtins.print'):  # Supprimer les sorties console
            result = flow.run()
        
        # Vérifier que le flow s'est exécuté avec succès
        self.assertEqual(result["flow"]["status"], "completed")
        
        # Vérifier que tous les fichiers ont été mis à jour
        with open(self.dm_log_path, 'r') as f:
            content = f.read()
            self.assertIn("## 2023-01-02 - Test task", content)
        
        with open(self.mcd_path, 'r') as f:
            content = f.read()
            self.assertIn("## Entités principales", content)
            self.assertIn("- Entité 1", content)
        
        with open(self.structure_path, 'r') as f:
            content = f.read()
            self.assertIn("## Organisation des répertoires", content)
            self.assertIn("- Répertoire 1", content)
        
        with open(self.tasks_path, 'r') as f:
            content = f.read()
            self.assertIn("## Backlog", content)
            self.assertIn("- [x] Tâche terminée", content)
        
        with open(self.requirements_path, 'r') as f:
            content = f.read()
            self.assertIn("## Exigences fonctionnelles", content)
            self.assertIn("- REQ-F-001: Exigence 1", content)
    
    @patch('pocketflow_agent.llm.LLMClient.generate_text')
    @patch('subprocess.check_output')
    @patch('subprocess.run')
    def test_git_push_flow(self, mock_run, mock_check_output, mock_generate_text):
        """
        Test du flow avec GitPushNode
        """
        # Configurer les mocks
        mock_check_output.return_value = b"Task: Test task"
        mock_generate_text.return_value = """## 2023-01-02 - Test task

### Tâches accomplies
- Tâche 1
- Tâche 2

### Résultats
- Résultat 1
- Résultat 2

### Prochaines étapes
- Étape 1
- Étape 2
"""
        mock_run.return_value.returncode = 0
        
        # Créer les nodes
        git_commit_node = GitCommitNode()
        dm_log_parser_node = DMLogParserNode(path=self.dm_log_path)
        dm_log_llm_node = DMLogLLMNode(api_key="test_key", test_mode=True)
        dm_log_update_node = DMLogUpdateNode(path=self.dm_log_path)
        git_push_node = GitPushNode()
        
        # Créer le flow
        flow = Flow([
            git_commit_node,
            dm_log_parser_node,
            dm_log_llm_node,
            dm_log_update_node,
            git_push_node
        ], name="Git Push Flow")
        
        # Exécuter le flow
        with patch('builtins.print'):  # Supprimer les sorties console
            result = flow.run()
        
        # Vérifier que le flow s'est exécuté avec succès
        self.assertEqual(result["flow"]["status"], "completed")
        
        # Vérifier que git push a été appelé
        mock_run.assert_called()
    
    @patch('pocketflow_agent.llm.LLMClient.generate_text')
    @patch('subprocess.check_output')
    def test_flow_with_error(self, mock_check_output, mock_generate_text):
        """
        Test du flow avec une erreur dans un node
        """
        print("\n=== Début du test_flow_with_error ===")
        
        # Configurer les mocks pour simuler un environnement Git valide
        def mock_check_output_side_effect(cmd, *args, **kwargs):
            print(f"\nMock check_output appelé avec: {cmd}")
            if "git" in cmd[0]:
                print("Retourne un message de tâche de test")
                return b"Task: Test task"
            print("Retourne une chaîne vide")
            return b""
            
        mock_check_output.side_effect = mock_check_output_side_effect
        
        # Créer un mock pour simuler une erreur dans DMLogLLMNode
        def mock_generate_text_side_effect(*args, **kwargs):
            print(f"\nMock generate_text appelé avec: {args[0][:100]}..." if args else "Aucun argument")
            # Ne lever l'exception que pour les appels à DMLogLLMNode
            if args and "générer une entrée DM-Log" in args[0]:
                print("Lève une exception de test")
                raise Exception("Test LLM error")
            print("Retourne une chaîne vide")
            return ""
            
        mock_generate_text.side_effect = mock_generate_text_side_effect
        
        # Créer les nodes
        print("\nCréation des nodes...")
        git_commit_node = GitCommitNode()
        dm_log_parser_node = DMLogParserNode(path=self.dm_log_path)
        dm_log_llm_node = DMLogLLMNode(api_key="test_key", test_mode=True)
        dm_log_update_node = DMLogUpdateNode(path=self.dm_log_path)
        
        # Créer le flow avec un contexte initial pour éviter que GitCommitNode ne soit le premier à échouer
        context = {
            "task_name": "Tâche de test",
            "today": "2023-01-01",
            "task_results": ["Résultat de test"],
            "next_steps": ["Prochaine étape"]
        }
        
        print("\nCréation du flow...")
        flow = Flow([
            git_commit_node,
            dm_log_parser_node,
            dm_log_llm_node,
            dm_log_update_node
        ], name="Error Flow")
        
        # Exécuter le flow avec le contexte initial
        print("\nExécution du flow...")
        with patch('builtins.print') as mock_print:  # Capturer les sorties console
            result = flow.run(initial_context=context)
            
            # Afficher les appels à print pour le débogage
            print("\nSorties console capturées:")
            for call in mock_print.call_args_list:
                print(f"  - {call[0][0]}")
        
        print("\nRésultat du flow:", result)
        
        # Vérifier que le flow a échoué
        self.assertEqual(result["flow"]["status"], "error")
        
        # Afficher les nœuds exécutés pour le débogage
        print("\nNœuds exécutés:")
        for i, node in enumerate(result["flow"]["completed_nodes"], 1):
            print(f"  {i}. {node.get('name', 'inconnu')} - {node.get('status', 'inconnu')}")
            if node.get("status") == "error":
                error_msg = node.get('error', 'Pas de message d\'erreur')
                print(f"     ERREUR: {error_msg}")
        
        # Vérifier que l'erreur est dans le node LLM
        error_node = next((node for node in result["flow"]["completed_nodes"] if node.get("status") == "error"), None)
        self.assertIsNotNone(error_node, "Aucun nœud en erreur trouvé dans le flow")
        print(f"\nNœud en erreur trouvé: {error_node.get('name')} - {error_node.get('error')}")
        
        # Vérifier que l'erreur est bien dans le nœud LLM
        self.assertEqual(error_node["name"], "dm_log_llm", 
                        f"L'erreur s'est produite dans {error_node.get('name', 'inconnu')} au lieu de dm_log_llm")
        self.assertIn("Test LLM error", str(error_node.get("error", "")), 
                    f"Le message d'erreur attendu n'a pas été trouvé dans {error_node}")
                    
        print("\n=== Fin du test_flow_with_error ===\n")

if __name__ == '__main__':
    unittest.main()
