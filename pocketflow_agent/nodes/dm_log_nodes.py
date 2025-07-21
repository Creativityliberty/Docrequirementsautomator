"""
Nodes pour la mise à jour du journal DM-Log
"""

import os
import datetime
import subprocess
import re
from typing import List, Dict, Any

from ..llm import LLMClient
from .node import BaseNode

class GitCommitNode(BaseNode):
    """
    Node pour récupérer les informations du dernier commit Git.
    """
    
    def __init__(self):
        """
        Initialise le node GitCommitNode.
        """
        super().__init__("git_commit")
    
    def exec(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Récupère les informations du dernier commit Git.
        
        Args:
            context (Dict[str, Any]): Contexte d'exécution
            
        Returns:
            Dict[str, Any]: Contexte mis à jour avec les informations du commit
        """
        try:
            # Récupérer le message du dernier commit
            msg = subprocess.check_output(["git", "log", "-1", "--pretty=%B"], text=True).strip()
            
            # Extraire le nom de la tâche (format attendu: "Task: <nom de la tâche>")
            match = re.search(r"Task:\s*(.*)", msg)
            task = match.group(1) if match else "Tâche inconnue"
            
            # Ajouter les informations au contexte
            context["task_name"] = task
            context["today"] = datetime.date.today().isoformat()
            
            # Ajouter des résultats et prochaines étapes par défaut si non fournis
            if "task_results" not in context:
                context["task_results"] = ["Tâche exécutée avec succès"]
            
            if "next_steps" not in context:
                context["next_steps"] = ["Prochaine étape à définir"]
            
            return context
        except Exception as e:
            raise Exception(f"Erreur lors de la récupération des informations du commit: {str(e)}")


class DMLogParserNode(BaseNode):
    """
    Node pour parser le contenu du journal DM-Log.
    """
    
    def __init__(self, path: str = "docs/dm-log.md"):
        """
        Initialise le node DMLogParserNode.
        
        Args:
            path (str, optional): Chemin vers le fichier DM-Log
        """
        super().__init__("dm_log_parser")
        self.path = path
    
    def exec(self, context: Dict[str, Any]) -> str:
        """
        Parse le contenu du journal DM-Log.
        
        Args:
            context (Dict[str, Any]): Contexte d'exécution
            
        Returns:
            str: Contenu du journal DM-Log
        """
        try:
            with open(self.path, 'r', encoding='utf8') as f:
                content = f.read()
            
            context["dm_content"] = content
            return content
        except Exception as e:
            raise Exception(f"Erreur lors du parsing du journal DM-Log: {str(e)}")


class DMLogLLMNode(BaseNode):
    """
    Node pour générer une entrée DM-Log via un LLM.
    """
    
    PROMPT = """
Vous mettez à jour un journal de décisions pour un projet de développement.
Générez une entrée de journal au format Markdown avec la structure suivante:

### {date} - {task}

**Tâches accomplies :**
{done}

**Résultats :**
{results}

**Prochaines étapes :**
{next}

Assurez-vous que l'entrée est claire, concise et informative.
"""
    
    def __init__(self, api_key: str = None, model_id: str = None, provider: str = "deepseek", test_mode: bool = False):
        """
        Initialise le node DMLogLLMNode.
        
        Args:
            api_key (str, optional): Clé API
            model_id (str, optional): ID du modèle à utiliser
            provider (str, optional): Le fournisseur de l'API ('deepseek', 'openai', 'gemini')
            test_mode (bool, optional): Si True, active le mode test pour les appels LLM
        """
        super().__init__("dm_log_llm")
        self.llm = LLMClient(api_key=api_key, provider=provider, test_mode=test_mode)
        self.model = model_id
    
    def exec(self, context: Dict[str, Any]) -> str:
        """
        Génère une entrée DM-Log via Gemini.
        
        Args:
            context (Dict[str, Any]): Contexte d'exécution
            
        Returns:
            str: Entrée DM-Log générée
        """
        try:
            date = context["today"]
            task = context["task_name"]
            done = "\n".join(f"- {d}" for d in context["task_results"])
            results = "\n".join(f"- Résultat obtenu: {d}" for d in context["task_results"])
            next_steps = "\n".join(f"- {n}" for n in context["next_steps"])
            
            prompt = self.PROMPT.format(
                date=date,
                task=task,
                done=done,
                results=results,
                next=next_steps
            )
            
            entry = self.llm.generate_text(prompt, model_id=self.model)
            context["dm_entry"] = entry
            
            return entry
        except Exception as e:
            raise Exception(f"Erreur lors de la génération de l'entrée DM-Log: {str(e)}")


class DMLogUpdateNode(BaseNode):
    """
    Node pour mettre à jour le journal DM-Log.
    """
    
    def __init__(self, path: str = "docs/dm-log.md"):
        """
        Initialise le node DMLogUpdateNode.
        
        Args:
            path (str, optional): Chemin vers le fichier DM-Log
        """
        super().__init__("dm_log_update")
        self.path = path
    
    def exec(self, context: Dict[str, Any]) -> bool:
        """
        Met à jour le journal DM-Log.
        
        Args:
            context (Dict[str, Any]): Contexte d'exécution
            
        Returns:
            bool: True si la mise à jour a réussi
        """
        try:
            content = context["dm_content"]
            entry = context["dm_entry"]
            
            # Insérer la nouvelle entrée après la section "Résultats des étapes"
            section_marker = "## Résultats des étapes"
            insert_position = content.find(section_marker) + len(section_marker)
            
            updated_content = content[:insert_position] + "\n\n" + entry + content[insert_position:]
            
            with open(self.path, 'w', encoding='utf8') as f:
                f.write(updated_content)
            
            return True
        except Exception as e:
            raise Exception(f"Erreur lors de la mise à jour du journal DM-Log: {str(e)}")


class GitPushNode(BaseNode):
    """
    Node pour committer et pusher les changements.
    """
    
    def __init__(self, files: List[str] = None, commit_message: str = None):
        """
        Initialise le node GitPushNode.
        
        Args:
            files (List[str], optional): Liste des fichiers à committer
            commit_message (str, optional): Message de commit
        """
        super().__init__("git_push")
        self.files = files
        self.commit_message = commit_message
    
    def exec(self, context: Dict[str, Any]) -> bool:
        """
        Committe et pushe les changements.
        
        Args:
            context (Dict[str, Any]): Contexte d'exécution
            
        Returns:
            bool: True si le push a réussi
        """
        try:
            files = self.files or ["docs/dm-log.md"]
            date = context.get("today", datetime.date.today().isoformat())
            commit_message = self.commit_message or f"Auto-update docs: {date}"
            
            # Ajouter les fichiers
            for file in files:
                subprocess.check_call(["git", "add", file])
            
            # Committer
            subprocess.check_call(["git", "commit", "-m", commit_message])
            
            # Pusher
            subprocess.check_call(["git", "push"])
            
            return True
        except Exception as e:
            raise Exception(f"Erreur lors du push Git: {str(e)}")
