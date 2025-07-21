"""
Classe de base pour tous les nodes PocketFlow
"""

class BaseNode:
    """
    Classe de base pour tous les nodes dans le système PocketFlow.
    Chaque node doit hériter de cette classe et implémenter la méthode exec.
    """
    
    def __init__(self, name: str):
        """
        Initialise un nouveau node.
        
        Args:
            name (str): Nom du node
        """
        self.name = name
        
    def exec(self, context: dict) -> any:
        """
        Exécute le node avec le contexte donné.
        
        Args:
            context (dict): Contexte d'exécution
            
        Returns:
            any: Résultat de l'exécution
        """
        raise NotImplementedError("La méthode exec doit être implémentée par les sous-classes")
