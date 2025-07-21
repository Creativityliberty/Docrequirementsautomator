"""
Définition du flow PocketFlow pour la mise à jour automatique des documents
"""

import os
from typing import Dict, Any, List

from .flow import Flow
from .nodes.dm_log_nodes import (
    GitCommitNode,
    DMLogParserNode,
    DMLogLLMNode,
    DMLogUpdateNode,
    GitPushNode
)
from .nodes.doc_update_nodes import (
    ModelConceptUpdateNode,
    ProjectStructureUpdateNode,
    TasksUpdateNode,
    RequirementsUpdateNode
)

def create_full_update_flow(api_key: str = None, provider: str = "deepseek", test_mode: bool = False) -> Flow:
    """
    Crée et configure le flow complet pour la mise à jour des documents.

    Args:
        api_key (str, optional): Clé API pour le LLM. Si non fournie, elle sera cherchée
                                 dans les variables d'environnement correspondantes au provider.
        provider (str, optional): Le fournisseur de l'API ('deepseek', 'openai', 'gemini').
        test_mode (bool, optional): Si True, active le mode test pour les appels LLM.

    Returns:
        Flow: Le flow configuré.
    """
    nodes = [
        # 1. DM-Log
        GitCommitNode(),
        DMLogParserNode(path="docs/dm-log.md"),
        DMLogLLMNode(api_key=api_key, provider=provider, test_mode=test_mode),
        DMLogUpdateNode(path="docs/dm-log.md"),

        # 2. MCD & Garde-fous
        ModelConceptUpdateNode(path="docs/mcd-guardrails.md", api_key=api_key, provider=provider),

        # 3. Structure du projet
        ProjectStructureUpdateNode(path="docs/project-structure.md", api_key=api_key, provider=provider),

        # 4. Tâches
        TasksUpdateNode(path="docs/tasks.md", api_key=api_key, provider=provider),

        # 5. Exigences
        RequirementsUpdateNode(path="docs/requirements.md", api_key=api_key, provider=provider),

        # 6. Git Push (tous les fichiers modifiés)
        GitPushNode(files=[
            "docs/dm-log.md",
            "docs/mcd-guardrails.md",
            "docs/project-structure.md",
            "docs/tasks.md",
            "docs/requirements.md"
        ])
    ]

    return Flow(nodes)

def create_dm_log_update_flow() -> Flow:
    """
    Crée un flow pour la mise à jour du journal DM-Log uniquement.
    
    Returns:
        Flow: Flow configuré
    """
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    
    nodes = [
        GitCommitNode(),
        DMLogParserNode(path="docs/dm-log.md"),
        DMLogLLMNode(api_key=api_key, model_id="gemini-1.5-flash"),
        DMLogUpdateNode(path="docs/dm-log.md"),
        GitPushNode(files=["docs/dm-log.md"])
    ]
    
    return Flow(nodes)

def create_mcd_update_flow() -> Flow:
    """
    Crée un flow pour la mise à jour du MCD uniquement.
    
    Returns:
        Flow: Flow configuré
    """
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    
    nodes = [
        ModelConceptUpdateNode(path="docs/mcd-guardrails.md", model_id="gemini-1.5-flash"),
        GitPushNode(files=["docs/mcd-guardrails.md"])
    ]
    
    return Flow(nodes)

def create_structure_update_flow() -> Flow:
    """
    Crée un flow pour la mise à jour de la structure du projet uniquement.
    
    Returns:
        Flow: Flow configuré
    """
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    
    nodes = [
        ProjectStructureUpdateNode(path="docs/project-structure.md", model_id="gemini-1.5-flash"),
        GitPushNode(files=["docs/project-structure.md"])
    ]
    
    return Flow(nodes)
