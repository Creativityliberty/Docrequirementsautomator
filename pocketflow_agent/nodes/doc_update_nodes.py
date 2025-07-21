"""
Nodes pour la mise à jour des documents MCD et structure du projet
"""

import os
from typing import Dict, Any

from ..llm import LLMClient
from .node import BaseNode

class ModelConceptUpdateNode(BaseNode):
    """
    Node pour mettre à jour le document MCD & Garde-fous via un LLM.
    """
    
    PROMPT = """
Le document suivant définit le Modèle Conceptuel de Données et les Garde-fous techniques.
Mets-le à jour en ajoutant ou corrigeant les sections selon les dernières modifications du projet.

```markdown
{content}
```

RENVOIE le document complet en Markdown valide.
"""
    
    def __init__(self, path: str = "docs/mcd-guardrails.md", api_key: str = None, model_id: str = None, provider: str = "deepseek"):
        """
        Initialise le node ModelConceptUpdateNode.
        
        Args:
            path (str, optional): Chemin vers le fichier MCD
            api_key (str, optional): Clé API pour l'utilisation du LLM
            model_id (str, optional): ID du modèle à utiliser
            provider (str, optional): Fournisseur du LLM
        """
        super().__init__("model_concept_update")
        self.path = path
        self.llm = LLMClient(api_key=api_key, provider=provider)
        self.model = model_id
    
    def exec(self, context: Dict[str, Any]) -> bool:
        """
        Met à jour le document MCD et garde-fous.
        
        Args:
            context (Dict[str, Any]): Contexte d'exécution
            
        Returns:
            bool: True si la mise à jour a réussi
        """
        try:
            # Lecture du MCD existant
            with open(self.path, 'r', encoding='utf8') as f:
                content = f.read()
            
            # Générer le prompt
            prompt = self.PROMPT.format(content=content)
            
            # Générer le document mis à jour
            updated = self.llm.generate_text(prompt, model_id=self.model)
            
            # Écrire le document mis à jour
            with open(self.path, 'w', encoding='utf8') as f:
                f.write(updated)
            
            # Ajouter le fichier à la liste des fichiers modifiés
            if "modified_files" not in context:
                context["modified_files"] = []
            
            context["modified_files"].append(self.path)
            
            return True
        except Exception as e:
            raise Exception(f"Erreur lors de la mise à jour du document MCD: {str(e)}")


class ProjectStructureUpdateNode(BaseNode):
    """
    Node pour mettre à jour le document de structure du projet via un LLM.
    """
    
    PROMPT = """
Le document suivant décrit la structure du projet. Mets-le à jour pour refléter les dernières conventions et scripts d'automatisation.

```markdown
{content}
```

RENVOIE le document complet en Markdown valide.
"""
    
    def __init__(self, path: str = "docs/project-structure.md", api_key: str = None, model_id: str = None, provider: str = "deepseek"):
        """
        Initialise le node ProjectStructureUpdateNode.
        
        Args:
            path (str, optional): Chemin vers le fichier de structure du projet
            api_key (str, optional): Clé API pour l'utilisation du LLM
            model_id (str, optional): ID du modèle à utiliser
            provider (str, optional): Fournisseur du LLM
        """
        super().__init__("project_structure_update")
        self.path = path
        self.llm = LLMClient(api_key=api_key, provider=provider)
        self.model = model_id
    
    def exec(self, context: Dict[str, Any]) -> bool:
        """
        Met à jour le document de structure du projet.
        
        Args:
            context (Dict[str, Any]): Contexte d'exécution
            
        Returns:
            bool: True si la mise à jour a réussi
        """
        try:
            # Lecture du document existant
            with open(self.path, 'r', encoding='utf8') as f:
                content = f.read()
            
            # Générer le prompt
            prompt = self.PROMPT.format(content=content)
            
            # Générer le document mis à jour
            updated = self.llm.generate_text(prompt, model_id=self.model)
            
            # Écrire le document mis à jour
            with open(self.path, 'w', encoding='utf8') as f:
                f.write(updated)
            
            # Ajouter le fichier à la liste des fichiers modifiés
            if "modified_files" not in context:
                context["modified_files"] = []
            
            context["modified_files"].append(self.path)
            
            return True
        except Exception as e:
            raise Exception(f"Erreur lors de la mise à jour du document de structure: {str(e)}")


class TasksUpdateNode(BaseNode):
    """
    Node pour mettre à jour le document des tâches via un LLM.
    """
    
    PROMPT = """
Le document suivant décrit les tâches du projet. Mets-le à jour pour refléter l'avancement et les nouvelles tâches.

```markdown
{content}
```

RENVOIE le document complet en Markdown valide.
"""
    
    def __init__(self, path: str = "docs/tasks.md", api_key: str = None, model_id: str = None, provider: str = "deepseek"):
        """
        Initialise le node TasksUpdateNode.
        
        Args:
            path (str, optional): Chemin vers le fichier des tâches
            api_key (str, optional): Clé API pour l'utilisation du LLM
            model_id (str, optional): ID du modèle à utiliser
            provider (str, optional): Fournisseur du LLM
        """
        super().__init__("tasks_update")
        self.path = path
        self.llm = LLMClient(api_key=api_key, provider=provider)
        self.model = model_id
    
    def exec(self, context: Dict[str, Any]) -> bool:
        """
        Met à jour le document des tâches.
        
        Args:
            context (Dict[str, Any]): Contexte d'exécution
            
        Returns:
            bool: True si la mise à jour a réussi
        """
        try:
            # Lecture du document existant
            with open(self.path, 'r', encoding='utf8') as f:
                content = f.read()
            
            # Générer le prompt
            prompt = self.PROMPT.format(content=content)
            
            # Générer le document mis à jour
            updated = self.llm.generate_text(prompt, model_id=self.model)
            
            # Écrire le document mis à jour
            with open(self.path, 'w', encoding='utf8') as f:
                f.write(updated)
            
            # Ajouter le fichier à la liste des fichiers modifiés
            if "modified_files" not in context:
                context["modified_files"] = []
            
            context["modified_files"].append(self.path)
            
            return True
        except Exception as e:
            raise Exception(f"Erreur lors de la mise à jour du document des tâches: {str(e)}")


class RequirementsUpdateNode(BaseNode):
    """
    Node pour mettre à jour le document des exigences via un LLM.
    """
    
    PROMPT = """
Le document suivant décrit les exigences du projet. Mets-le à jour pour refléter les nouvelles exigences et les modifications.

```markdown
{content}
```

RENVOIE le document complet en Markdown valide.
"""
    
    def __init__(self, path: str = "docs/requirements.md", api_key: str = None, model_id: str = None, provider: str = "deepseek"):
        """
        Initialise le node RequirementsUpdateNode.
        
        Args:
            path (str, optional): Chemin vers le fichier des exigences
            api_key (str, optional): Clé API pour l'utilisation du LLM
            model_id (str, optional): ID du modèle à utiliser
            provider (str, optional): Fournisseur du LLM
        """
        super().__init__("requirements_update")
        self.path = path
        self.llm = LLMClient(api_key=api_key, provider=provider)
        self.model = model_id
    
    def exec(self, context: Dict[str, Any]) -> bool:
        """
        Met à jour le document des exigences.
        
        Args:
            context (Dict[str, Any]): Contexte d'exécution
            
        Returns:
            bool: True si la mise à jour a réussi
        """
        try:
            # Lecture du document existant
            with open(self.path, 'r', encoding='utf8') as f:
                content = f.read()
            
            # Générer le prompt
            prompt = self.PROMPT.format(content=content)
            
            # Générer le document mis à jour
            updated = self.llm.generate_text(prompt, model_id=self.model)
            
            # Écrire le document mis à jour
            with open(self.path, 'w', encoding='utf8') as f:
                f.write(updated)
            
            # Ajouter le fichier à la liste des fichiers modifiés
            if "modified_files" not in context:
                context["modified_files"] = []
            
            context["modified_files"].append(self.path)
            
            return True
        except Exception as e:
            raise Exception(f"Erreur lors de la mise à jour du document des exigences: {str(e)}")
