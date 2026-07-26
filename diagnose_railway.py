"""Diagnostico do Railway - Axis Mundi
Uso: RAILWAY_TOKEN=xxx RAILWAY_PROJECT_ID=xxx python diagnose_railway.py
"""
import urllib.request
import json
import sys
import os

TOKEN = os.environ.get("RAILWAY_TOKEN") or "cole_seu_token_aqui"
PROJECT_ID = os.environ.get("RAILWAY_PROJECT_ID") or "3203fc3a-c19a-47c6-b13f-935560ab2669"
BACKEND_URL = "https://axis-mundi-production.up.railway.app"

def graphql(query, variables=None):
    data = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        "https://backboard.railway.app/graphql/v2",
        data=data,
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read())
    except Exception as e:
        return {"error": str(e)}

print("=" * 60)
print("DIAGNOSTICO RAILWAY - AXIS MUNDI")
print("=" * 60)

# 1. Buscar projeto
print("\n[1] Buscando projeto...")
q = "query($id: String!) { project(id: $id) { id name createdAt services { id name } } }"
res = graphql(q, {"id": PROJECT_ID})
if "error" in res:
    print(f"  ERRO: {res['error']}")
    # Try listing projects instead
    q2 = "query { projects { id name } }"
    res2 = graphql(q2)
    if "error" in res2:
        print(f"  ERRO lista projetos: {res2['error']}")
    else:
        for p in res2.get("data", {}).get("projects", []):
            print(f"  Projeto: {p.get('name')} ({p.get('id')})")
    sys.exit(0)

proj = res.get("data", {}).get("project", {})
print(f"  Projeto: {proj.get('name')} (ID: {proj.get('id')})")
for svc in proj.get("services", []):
    print(f"  Servico: {svc.get('name')} (ID: {svc.get('id')})")

# 2. Testar health do backend
print("\n[2] Testando backend...")
try:
    req = urllib.request.Request(f"{BACKEND_URL}/health")
    with urllib.request.urlopen(req, timeout=10) as resp:
        body = resp.read().decode()
        print(f"  /health: {resp.getcode()} - {body[:200]}")
except Exception as e:
    print(f"  /health: ERRO - {e}")

try:
    req = urllib.request.Request(f"{BACKEND_URL}/")
    with urllib.request.urlopen(req, timeout=10) as resp:
        body = resp.read().decode()
        print(f"  / : {resp.getcode()} - {body[:200]}")
except Exception as e:
    print(f"  / : ERRO - {e}")

# 3. Buscar deployments
print("\n[3] Deployments recentes...")
q3 = """
query($projectId: String!) {
  deployments(projectId: $projectId, last: 3) {
    id status createdAt
  }
}"""
res3 = graphql(q3, {"projectId": PROJECT_ID})
if "error" in res3:
    print(f"  ERRO: {res3['error']}")
else:
    deps = res3.get("data", {}).get("deployments", [])
    if deps:
        for dep in deps:
            print(f"  Deploy: {dep.get('id')} - status: {dep.get('status')}")
    else:
        print("  Nenhum deployment encontrado")

print("\n" + "=" * 60)
print("FIM DO DIAGNOSTICO")
