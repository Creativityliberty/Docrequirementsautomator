"""
Client pour interagir avec les modèles LLM (Gemini)
"""

import os
import json
import httpx
from typing import Dict, Any, Optional

class LLMClient:
    """
    Client pour interagir avec une API LLM (DeepSeek, OpenAI, Gemini).
    """
    
    def __init__(self, api_key: str = None, provider: str = "deepseek", test_mode: bool = False):
        """
        Initialise un client LLM.
        
        Args:
            api_key (str, optional): Clé API. Si non fournie, cherche dans les variables d'environnement.
            provider (str, optional): Le fournisseur de l'API ('deepseek', 'openai', 'gemini').
            test_mode (bool, optional): Si True, n'exige pas de clé API (pour les tests unitaires).
        """
        self.provider = provider.lower()
        self.api_key = api_key or self._get_api_key_from_env()
        self.test_mode = test_mode
        
        if not self.api_key and not self.test_mode:
            raise ValueError(f"API key for {self.provider} is required.")

    def _get_api_key_from_env(self):
        if self.provider == "deepseek":
            return os.getenv("DEEPSEEK_API_KEY")
        elif self.provider == "openai":
            return os.getenv("OPENAI_API_KEY")
        elif self.provider == "gemini":
            return os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        return None

    def generate_text(self, prompt: str, model_id: str = None, temperature: float = 0.2) -> str:
        """
        Génère du texte à partir d'un prompt.
        """
        if self.test_mode:
            return "Ceci est une réponse de test générée en mode test."

        if self.provider == "deepseek":
            model_id = model_id or "deepseek-reasoner"
            return self._generate_openai_compatible(prompt, model_id, temperature, "https://api.deepseek.com/v1/chat/completions")
        elif self.provider == "openai":
            model_id = model_id or "gpt-3.5-turbo"
            return self._generate_openai_compatible(prompt, model_id, temperature, "https://api.openai.com/v1/chat/completions")
        elif self.provider == "gemini":
            model_id = model_id or "gemini-1.5-flash"
            return self._generate_gemini(prompt, model_id, temperature)
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")

    def _generate_openai_compatible(self, prompt, model_id, temperature, url):
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}'
        }
        payload = {
            "model": model_id,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature
        }
        try:
            response = httpx.post(url, headers=headers, json=payload, timeout=60.0)
            response.raise_for_status()
            result = response.json()
            return result['choices'][0]['message']['content']
        except httpx.HTTPStatusError as e:
            print(f"Error calling {self.provider} API: {e}")
            raise Exception(f"API error. Status: {e.response.status_code}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            raise Exception("An unexpected error occurred while generating text.")

    def _generate_gemini(self, prompt, model_id, temperature):
        url = f"https://generativelanguage.googleapis.com/v1/models/{model_id}:generateContent"
        headers = {
            'Content-Type': 'application/json',
            'x-goog-api-key': self.api_key
        }
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": temperature}
        }
        try:
            response = httpx.post(url, headers=headers, json=payload, timeout=60.0)
            response.raise_for_status()
            result = response.json()
            return result['candidates'][0]['content']['parts'][0]['text']
        except httpx.HTTPStatusError as e:
            print(f"Error calling Gemini API: {e}")
            raise Exception(f"API error. Status: {e.response.status_code}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            raise Exception("An unexpected error occurred while generating text.")
