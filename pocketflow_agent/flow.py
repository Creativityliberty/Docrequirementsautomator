"""
Classe Flow pour orchestrer l'exécution des nodes
"""

import time
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from .nodes.node import BaseNode
from .prompts import DASHBOARD_PROMPT
from .llm import LLMClient

class Flow:
    """
    Classe Flow pour orchestrer l'exécution des nodes.
    """
    
    def __init__(self, nodes: List[BaseNode], name: str = "PocketFlow Update Flow", api_key: Optional[str] = None):
        """
        Initialise un nouveau flow.
        
        Args:
            nodes (List[BaseNode]): Liste des nodes à exécuter dans l'ordre
            name (str, optional): Nom du flow. Par défaut "PocketFlow Update Flow"
            api_key (str, optional): Clé API pour le client LLM
        """
        self.nodes = nodes
        self.name = name
        self.api_key = api_key
        self.llm_client = None
        if api_key:
            self.llm_client = LLMClient(api_key=api_key)
        
    def run(self, initial_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Exécute le flow avec le contexte initial donné.
        
        Args:
            initial_context (Dict[str, Any], optional): Contexte initial
            
        Returns:
            Dict[str, Any]: Contexte final après exécution de tous les nodes
        """
        context = initial_context or {}
        start_time = time.time()
        
        # Ajouter des informations sur le flow au contexte
        context["flow"] = {
            "name": self.name,
            "node_count": len(self.nodes),
            "current_node": 0,
            "completed_nodes": [],
            "status": "running",
            "start_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "elapsed_time": "00:00:00"
        }
        
        print(self._generate_ascii_header())
        
        # Exécuter chaque node dans l'ordre
        for i, node in enumerate(self.nodes):
            node_start_time = time.time()
            context["flow"]["current_node"] = i + 1
            context["flow"]["current_node_name"] = node.name
            
            # Mettre à jour le dashboard pendant l'exécution
            elapsed = time.time() - start_time
            context["flow"]["elapsed_time"] = str(timedelta(seconds=int(elapsed)))
            print(self._generate_ascii_progress(context))
            
            print(f"[{i+1}/{len(self.nodes)}] Exécution du node: {node.name}")
            
            try:
                result = node.exec(context)
                node_elapsed = time.time() - node_start_time
                context[f"result_{node.name}"] = result
                context["flow"]["completed_nodes"].append({
                    "name": node.name,
                    "status": "success",
                    "elapsed": node_elapsed
                })
                print(f"✅ Node {node.name} exécuté avec succès en {node_elapsed:.2f}s")
            except Exception as e:
                node_elapsed = time.time() - node_start_time
                context["flow"]["completed_nodes"].append({
                    "name": node.name,
                    "status": "error",
                    "error": str(e),
                    "elapsed": node_elapsed
                })
                context["flow"]["status"] = "error"
                print(f"❌ Erreur lors de l'exécution du node {node.name}: {str(e)}")
                break
        
        # Finaliser le contexte
        if context["flow"]["status"] != "error":
            context["flow"]["status"] = "completed"
        
        # Calculer le temps total
        total_elapsed = time.time() - start_time
        context["flow"]["elapsed_time"] = str(timedelta(seconds=int(total_elapsed)))
        context["flow"]["total_elapsed_seconds"] = total_elapsed
        
        # Générer le dashboard final
        dashboard = self._generate_ascii_footer(context)
        print(dashboard)
        context["flow"]["dashboard"] = dashboard
        
        return context
    
    def _generate_ascii_progress(self, context: Dict[str, Any]) -> str:
        """
        Génère une barre de progression ASCII pour le dashboard.
        
        Args:
            context (Dict[str, Any]): Contexte d'exécution
            
        Returns:
            str: Barre de progression ASCII
        """
        current = context["flow"]["current_node"]
        total = context["flow"]["node_count"]
        current_node_name = context["flow"].get("current_node_name", "")
        elapsed = context["flow"]["elapsed_time"]
        
        # Calculer la progression
        progress_width = 40
        filled_width = int(progress_width * (current - 1) / total) if total > 0 else 0
        remaining_width = progress_width - filled_width
        
        # Générer la barre de progression
        progress_bar = "["
        progress_bar += "=" * filled_width
        progress_bar += ">" if current <= total else ""
        progress_bar += " " * (remaining_width - (1 if current <= total else 0))
        progress_bar += "]"
        
        # Générer le statut des nodes
        node_status = ""
        for i, node in enumerate(self.nodes):
            if i + 1 < current:
                node_status += f"✅ {node.name}\n"
            elif i + 1 == current:
                node_status += f"⏳ {node.name} (en cours)\n"
            else:
                node_status += f"⏲ {node.name}\n"
        
        return f"""
+-------------------------------------------------------+
| {self.name} - Progression                       |
+-------------------------------------------------------+
| {progress_bar} {current}/{total} |
| Temps écoulé: {elapsed}                                |
| Node en cours: {current_node_name}                     |
+-------------------------------------------------------+
| Statut des nodes:                                     |
{node_status}
+-------------------------------------------------------+
"""
    
    def _generate_ascii_header(self) -> str:
        """
        Génère l'en-tête ASCII pour le dashboard.
        
        Returns:
            str: En-tête ASCII
        """
        return f"""
+-------------------------------------------------------+
| {self.name} – Démarrage                    |
+-------------------------------------------------------+
| Mise à jour automatique des documents via Gemini      |
+-------------------------------------------------------+
"""
    
    def _generate_ascii_footer(self, context: Dict[str, Any]) -> str:
        """
        Génère le pied de page ASCII pour le dashboard.
        
        Args:
            context (Dict[str, Any]): Contexte d'exécution
            
        Returns:
            str: Pied de page ASCII
        """
        # Si un client LLM est disponible, utiliser le prompt pour générer un dashboard plus riche
        if self.llm_client:
            try:
                # Préparer les données pour le prompt
                flow_name = self.name
                flow_status = context["flow"]["status"]
                completed_nodes = len(context["flow"]["completed_nodes"])
                total_nodes = context["flow"]["node_count"]
                completed_node_names = ", ".join([node["name"] for node in context["flow"]["completed_nodes"]])
                current_node = context["flow"].get("current_node_name", "Aucun")
                elapsed_time = context["flow"]["elapsed_time"]
                
                # Récupérer les erreurs
                errors = []
                for node in context["flow"]["completed_nodes"]:
                    if node["status"] == "error":
                        errors.append(f"{node['name']}: {node.get('error', 'Erreur inconnue')}")
                
                # Générer le dashboard via LLM
                prompt = DASHBOARD_PROMPT.format(
                    flow_name=flow_name,
                    flow_status=flow_status,
                    completed_nodes=completed_nodes,
                    total_nodes=total_nodes,
                    completed_node_names=completed_node_names,
                    current_node=current_node,
                    errors="\n".join(errors) if errors else "Aucune",
                    elapsed_time=elapsed_time
                )
                
                dashboard = self.llm_client.generate_text(prompt)
                if dashboard:
                    return dashboard
            except Exception as e:
                print(f"Erreur lors de la génération du dashboard via LLM: {str(e)}")
        
        # Fallback: générer un dashboard simple
        status_emoji = "✅" if context["flow"]["status"] == "completed" else "❌"
        status_text = "Terminé" if context["flow"]["status"] == "completed" else "Erreur"
        elapsed = context["flow"]["elapsed_time"]
        
        # Générer le statut de chaque type de mise à jour
        dm_log_status = "✅" if any(node["name"] == "dm_log_update" and node["status"] == "success" for node in context["flow"]["completed_nodes"]) else "❌"
        mcd_status = "✅" if any(node["name"] == "model_concept_update" and node["status"] == "success" for node in context["flow"]["completed_nodes"]) else "❌"
        structure_status = "✅" if any(node["name"] == "project_structure_update" and node["status"] == "success" for node in context["flow"]["completed_nodes"]) else "❌"
        tasks_status = "✅" if any(node["name"] == "tasks_update" and node["status"] == "success" for node in context["flow"]["completed_nodes"]) else "❌"
        requirements_status = "✅" if any(node["name"] == "requirements_update" and node["status"] == "success" for node in context["flow"]["completed_nodes"]) else "❌"
        git_status = "✅" if any(node["name"] == "git_push" and node["status"] == "success" for node in context["flow"]["completed_nodes"]) else "❌"
        
        # Calculer les statistiques
        success_count = sum(1 for node in context["flow"]["completed_nodes"] if node["status"] == "success")
        error_count = sum(1 for node in context["flow"]["completed_nodes"] if node["status"] == "error")
        success_rate = (success_count / len(context["flow"]["completed_nodes"])) * 100 if context["flow"]["completed_nodes"] else 0
        
        # Générer la liste des erreurs
        error_list = ""
        for node in context["flow"]["completed_nodes"]:
            if node["status"] == "error":
                error_list += f"| ❌ {node['name']}: {node.get('error', 'Erreur inconnue')}\n"
        
        if error_list:
            error_section = f"""
+-------------------------------------------------------+
| Erreurs:                                              |
{error_list}+-------------------------------------------------------+
"""
        else:
            error_section = ""
        
        return f"""
+-------------------------------------------------------+
| {self.name} – Résultat: {status_emoji} {status_text}           |
+-------------------------------------------------------+
| Temps total: {elapsed}                                |
| Nodes: {success_count}/{len(context["flow"]["completed_nodes"])} réussis ({success_rate:.1f}%)                      |
+-------------------------------------------------------+
| Statut des documents:                                 |
| {dm_log_status} DM-Log auto-update                                |
| {mcd_status} MCD & Garde-fous auto-update                       |
| {structure_status} Structure Projet auto-update                      |
| {tasks_status} Tâches auto-update                                |
| {requirements_status} Exigences auto-update                             |
| {git_status} Git Push                                          |
+-------------------------------------------------------+
| Prochaine étape: Tests d'intégration & Amélioration LLM  |
+-------------------------------------------------------+{error_section}
"""
