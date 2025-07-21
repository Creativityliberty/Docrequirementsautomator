#!/usr/bin/env python3
"""
Script principal pour exécuter le système PocketFlow de mise à jour des documents
"""

import os
import sys
import argparse
from typing import Dict, Any

# Ajouter le répertoire parent au path pour pouvoir importer pocketflow_agent
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pocketflow_agent.flow_definition import (
    create_full_update_flow,
    create_dm_log_update_flow,
    create_mcd_update_flow,
    create_structure_update_flow
)

def parse_args():
    """
    Parse les arguments de la ligne de commande.
    
    Returns:
        argparse.Namespace: Arguments parsés
    """
    parser = argparse.ArgumentParser(description="Mise à jour automatique des documents via PocketFlow et Gemini")
    
    parser.add_argument(
        "--type",
        choices=["full", "dm-log", "mcd", "structure"],
        default="full",
        help="Type de mise à jour à effectuer (par défaut: full)"
    )
    
    parser.add_argument(
        "--task-results",
        nargs="+",
        default=["Tâche exécutée avec succès"],
        help="Résultats de la tâche (pour DM-Log)"
    )
    
    parser.add_argument(
        "--next-steps",
        nargs="+",
        default=["Prochaine étape à définir"],
        help="Prochaines étapes (pour DM-Log)"
    )
    
    parser.add_argument(
        "--api-key",
        help="Clé API Gemini (si non définie dans les variables d'environnement)"
    )
    
    return parser.parse_args()

def main():
    """
    Fonction principale.
    """
    args = parse_args()
    
    # Définir la clé API si fournie
    if args.api_key:
        os.environ["GEMINI_API_KEY"] = args.api_key
    
    # Contexte initial
    initial_context = {
        "task_results": args.task_results,
        "next_steps": args.next_steps
    }
    
    # Sélectionner le flow approprié
    if args.type == "full":
        flow = create_full_update_flow()
        print("Exécution du flow complet de mise à jour des documents...")
    elif args.type == "dm-log":
        flow = create_dm_log_update_flow()
        print("Exécution du flow de mise à jour du DM-Log...")
    elif args.type == "mcd":
        flow = create_mcd_update_flow()
        print("Exécution du flow de mise à jour du MCD...")
    elif args.type == "structure":
        flow = create_structure_update_flow()
        print("Exécution du flow de mise à jour de la structure du projet...")
    
    # Exécuter le flow
    final_context = flow.run(initial_context)
    
    # Afficher un résumé
    print("\nRésumé de l'exécution:")
    print(f"Status: {final_context['flow']['status']}")
    print(f"Nodes exécutés: {len(final_context['flow']['completed_nodes'])}/{final_context['flow']['node_count']}")
    
    # Afficher les erreurs s'il y en a
    errors = [node for node in final_context['flow']['completed_nodes'] if node['status'] == 'error']
    if errors:
        print("\nErreurs:")
        for error in errors:
            print(f"- {error['name']}: {error.get('error', 'Erreur inconnue')}")
    
    return 0 if final_context['flow']['status'] == 'completed' else 1

if __name__ == "__main__":
    sys.exit(main())
