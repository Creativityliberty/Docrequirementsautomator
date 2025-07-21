#!/usr/bin/env python3
"""
Tests unitaires pour le système PocketFlow
"""

import os
import sys
import unittest
from unittest.mock import MagicMock, patch

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

class TestBaseNode(unittest.TestCase):
    """
    Tests pour la classe BaseNode
    """
    
    def test_init(self):
        """
        Test de l'initialisation de BaseNode
        """
        node = BaseNode("test_node")
        self.assertEqual(node.name, "test_node")
    
    def test_exec_not_implemented(self):
        """
        Test que la méthode exec lève NotImplementedError
        """
        node = BaseNode("test_node")
        with self.assertRaises(NotImplementedError):
            node.exec({})

class TestFlow(unittest.TestCase):
    """
    Tests pour la classe Flow
    """
    
    def test_init(self):
        """
        Test de l'initialisation de Flow
        """
        node1 = MagicMock(spec=BaseNode)
        node1.name = "node1"
        
        node2 = MagicMock(spec=BaseNode)
        node2.name = "node2"
        
        flow = Flow([node1, node2])
        self.assertEqual(len(flow.nodes), 2)
        self.assertEqual(flow.nodes[0].name, "node1")
        self.assertEqual(flow.nodes[1].name, "node2")
    
    def test_run_success(self):
        """
        Test de l'exécution réussie de Flow
        """
        node1 = MagicMock(spec=BaseNode)
        node1.name = "node1"
        node1.exec.return_value = "result1"
        
        node2 = MagicMock(spec=BaseNode)
        node2.name = "node2"
        node2.exec.return_value = "result2"
        
        flow = Flow([node1, node2])
        
        # Patch les méthodes d'affichage
        with patch.object(flow, '_generate_ascii_header', return_value=""), \
             patch.object(flow, '_generate_ascii_footer', return_value=""), \
             patch('builtins.print'):
            
            result = flow.run({"initial": "context"})
            
            # Vérifier que les nodes ont été exécutés
            node1.exec.assert_called_once()
            node2.exec.assert_called_once()
            
            # Vérifier le contexte final
            self.assertEqual(result["result_node1"], "result1")
            self.assertEqual(result["result_node2"], "result2")
            self.assertEqual(result["flow"]["status"], "completed")
    
    def test_run_error(self):
        """
        Test de l'exécution avec erreur de Flow
        """
        node1 = MagicMock(spec=BaseNode)
        node1.name = "node1"
        node1.exec.return_value = "result1"
        
        node2 = MagicMock(spec=BaseNode)
        node2.name = "node2"
        node2.exec.side_effect = Exception("Test error")
        
        flow = Flow([node1, node2])
        
        # Patch les méthodes d'affichage
        with patch.object(flow, '_generate_ascii_header', return_value=""), \
             patch.object(flow, '_generate_ascii_footer', return_value=""), \
             patch('builtins.print'):
            
            result = flow.run({"initial": "context"})
            
            # Vérifier que seul le premier node a été exécuté
            node1.exec.assert_called_once()
            node2.exec.assert_called_once()
            
            # Vérifier le contexte final
            self.assertEqual(result["result_node1"], "result1")
            self.assertEqual(result["flow"]["status"], "error")

class TestLLMClient(unittest.TestCase):
    """
    Tests pour la classe LLMClient
    """
    
    @patch.dict(os.environ, {"GEMINI_API_KEY": "test_key"})
    def test_init_with_env_var(self):
        """
        Test de l'initialisation de LLMClient avec variable d'environnement
        """
        client = LLMClient()
        self.assertEqual(client.api_key, "test_key")
    
    def test_init_with_param(self):
        """
        Test de l'initialisation de LLMClient avec paramètre
        """
        client = LLMClient(api_key="param_key")
        self.assertEqual(client.api_key, "param_key")
    
    @patch('httpx.post')
    def test_generate_text(self, mock_post):
        """
        Test de la méthode generate_text
        """
        # Configurer le mock
        mock_response = MagicMock()
        mock_response.raise_for_status.return_value = None
        mock_response.json.return_value = {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {"text": "Generated text"}
                        ]
                    }
                }
            ]
        }
        mock_post.return_value = mock_response
        
        # Appeler la méthode
        client = LLMClient(api_key="test_key")
        result = client.generate_text("Test prompt")
        
        # Vérifier le résultat
        self.assertEqual(result, "Generated text")
        mock_post.assert_called_once()

class TestGitCommitNode(unittest.TestCase):
    """
    Tests pour la classe GitCommitNode
    """
    
    @patch('subprocess.check_output')
    def test_exec(self, mock_check_output):
        """
        Test de la méthode exec
        """
        # Configurer le mock
        mock_check_output.return_value = "Task: Test task"
        
        # Appeler la méthode
        node = GitCommitNode()
        result = node.exec({})
        
        # Vérifier le résultat
        self.assertEqual(result["task_name"], "Test task")
        self.assertIn("today", result)
        self.assertIn("task_results", result)
        self.assertIn("next_steps", result)

if __name__ == '__main__':
    unittest.main()
