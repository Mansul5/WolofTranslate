import json
import sys
import io
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Force l'encodage UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

app = FastAPI()

# Autoriser Next.js (qui tourne généralement sur localhost:3000) à communiquer avec cette API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, tu restreindras aux URL autorisées
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

file_path = "dataset.jsonl"

@app.get("/")
def accueil():
    return {"message": "API de traduction Français-Wolof en ligne !"}

@app.get("/search")
def rechercher(q: str):
    """Recherche des correspondances dans le dataset JSONL"""
    resultats = []
    mot_cherche = q.lower()
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            for line in f:
                data = json.loads(line.strip())
                entree = str(data.get("input", "")).lower()
                
                sortie = data.get("output")
                sortie_str = str(sortie).lower()
                
                # Si le mot cherché est dans l'input ou dans l'output
                if mot_cherche in entree or mot_cherche in sortie_str:
                    resultats.append(data)
                    
                    # On limite à 10 résultats max pour garder l'API rapide
                    if len(resultats) >= 10:
                        break
        
        return {"query": q, "total": len(resultats), "results": resultats}

    except Exception as e:
        return {"error": str(e)}