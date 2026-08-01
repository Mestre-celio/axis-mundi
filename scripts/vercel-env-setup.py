#!/usr/bin/env python3
"""
vercel-env-setup.py — Injeção/atualização de variáveis de ambiente do Portal Axium
na Vercel via REST API (alternativa ao painel, repetível e auditável).

Uso básico:
    python scripts/vercel-env-setup.py --token $VERCEL_TOKEN --project portal-axium \
        --env-file .env.production --dry-run

    python scripts/vercel-env-setup.py --key GROQ_API_KEY=sk-xxx --project portal-axium

    python scripts/vercel-env-setup.py --all-pending --env-file .env.production --dry-run

    python scripts/vercel-env-setup.py --list --project portal-axium

Flags:
  --token TOKEN       Token de acesso da Vercel (ou env VERCEL_TOKEN)
  --project PROJ      Nome ou ID do projeto na Vercel (ou env VERCEL_PROJECT_ID)
  --key K=VALUE       Define uma variável (pode repetir)
  --env-file PATH     Lê pares KEY=VALUE de um arquivo (ex: .env.production)
  --all-pending       Aplica o conjunto prioritário de pendências do Portal
  --target T          Alvos: production,preview (padrão), ou development
  --list              Lista as variáveis atuais do projeto
  --dry-run           Mostra o que seria feito sem executar
  --skip-existing     Não sobrescreve variáveis já existentes (sem upsert)

Convenção de tipos: chaves NEXT_PUBLIC_* -> "plain" (públicas, inline no build);
demais chaves -> "encrypted" (segredos de servidor).
"""

import argparse
import json
import os
import sys
import urllib.error
import urllib.request

API = "https://api.vercel.com"

PENDING_KEYS = [
    "GROQ_API_KEY",
    "BUNNY_API_KEY",
    "BUNNY_LIBRARY_ID",
    "NEXT_PUBLIC_BUNNY_LIBRARY_ID",
    "ASAAS_WEBHOOK_SECRET",
]

SECRET_KEYS = [
    "GROQ_API_KEY", "AI_API_KEY", "AI_MODEL",
    "BUNNY_API_KEY", "BUNNY_LIBRARY_ID",
    "ASAAS_API_KEY", "ASAAS_ENV", "ASAAS_WEBHOOK_SECRET",
    "SUPABASE_SERVICE_ROLE_KEY", "RESEND_API_KEY",
]

PUBLIC_KEYS = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_BUNNY_LIBRARY_ID",
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_API_URL",
]


def http_request(method, path, token, body=None):
    url = API + path
    headers = {"Authorization": "Bearer " + token, "Content-Type": "application/json"}
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as err:
        detail = ""
        try:
            payload = json.loads(err.read().decode("utf-8"))
            detail = payload.get("error", {}).get("message") or payload.get("message") or str(payload)
        except Exception:
            detail = err.reason
        raise RuntimeError(f"HTTP {err.code} em {method} {path}: {detail}")


def resolve_project(token, project):
    info = http_request("GET", f"/v9/projects/{project}", token)
    return info.get("id") or project, info.get("name") or project


def list_envs(token, project_id):
    data = http_request("GET", f"/v9/projects/{project_id}/env", token)
    return data.get("envs", [])


def upsert_env(token, project_id, key, value, target, skip_existing):
    existing = None
    if skip_existing:
        for env in list_envs(token, project_id):
            if env.get("key") == key and value and env.get("value") == value:
                existing = env
                break
        if existing:
            return {"key": key, "skipped": True, "targets": existing.get("target", [])}

    env_type = "plain" if key.startswith("NEXT_PUBLIC_") else "encrypted"
    body = {
        "key": key,
        "value": value,
        "type": env_type,
        "target": target,
        "sensitive": env_type == "encrypted",
    }
    # ?upsert=true sobrescreve variáveis já existentes
    result = http_request(
        "POST",
        f"/v9/projects/{project_id}/env?upsert=true",
        token,
        body=body,
    )
    created = result.get("created") or result.get("updated") or [{"key": key}]
    return {"key": key, "skipped": False, "targets": target}


def parse_env_file(path):
    values = {}
    if not os.path.isfile(path):
        raise FileNotFoundError(f"Arquivo de ambiente não encontrado: {path}")
    with open(path, "r", encoding="utf-8") as fh:
        for raw in fh:
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            k, _, v = line.partition("=")
            k = k.strip()
            v = v.strip().strip("'").strip('"')
            values[k] = v
    return values


def main():
    parser = argparse.ArgumentParser(description="Setup de env vars na Vercel (Portal Axium)")
    parser.add_argument("--token", default=os.environ.get("VERCEL_TOKEN"), help="Token da Vercel (ou env VERCEL_TOKEN)")
    parser.add_argument("--project", default=os.environ.get("VERCEL_PROJECT_ID"), help="Nome ou ID do projeto (ou env VERCEL_PROJECT_ID)")
    parser.add_argument("--key", action="append", default=[], metavar="K=VALUE", help="Define uma variável (repetível)")
    parser.add_argument("--env-file", default=None, help="Arquivo KEY=VALUE com valores")
    parser.add_argument("--all-pending", action="store_true", help="Aplica o conjunto prioritário de pendências")
    parser.add_argument("--target", default="production,preview", help="Alvos: production,preview (padrão) ou development")
    parser.add_argument("--list", action="store_true", help="Lista as variáveis atuais")
    parser.add_argument("--dry-run", action="store_true", help="Apenas mostra o que seria feito")
    parser.add_argument("--skip-existing", action="store_true", help="Não sobrescreve valores já existentes")
    args = parser.parse_args()

    if not args.token:
        sys.exit("ERRO: informe --token ou defina VERCEL_TOKEN.")
    if not args.project:
        sys.exit("ERRO: informe --project ou defina VERCEL_PROJECT_ID.")

    values = {}
    if args.env_file:
        values.update(parse_env_file(args.env_file))
    for item in args.key:
        if "=" not in item:
            sys.exit(f"ERRO: --key espera K=VALUE, recebido: {item}")
        k, _, v = item.partition("=")
        values[k.strip()] = v
    if args.all_pending:
        for k in PENDING_KEYS:
            if k not in values:
                print(f"[info] {k} não fornecida — ignorada (nenhum valor em --env-file/--key).")

    if not values and not args.list:
        sys.exit("ERRO: nada a fazer. Use --key, --env-file, --all-pending ou --list.")

    try:
        project_id, project_name = resolve_project(args.token, args.project)
    except RuntimeError as err:
        sys.exit(f"ERRO ao resolver projeto: {err}")

    print(f"Projeto: {project_name} (id {project_id})")

    if args.list:
        envs = list_envs(args.token, project_id)
        if not envs:
            print("Nenhuma variável configurada.")
        for env in sorted(envs, key=lambda e: e.get("key", "")):
            key = env.get("key", "")
            targets = ",".join(env.get("target", []))
            redacted = "***" if env.get("type") != "plain" else env.get("value", "")
            print(f"  {key} [{targets}] = {redacted}")
        missing = [k for k in PENDING_KEYS if not any(e.get("key") == k for e in envs)]
        if missing:
            print("\nPendentes (não configuradas): " + ", ".join(missing))
        return

    targets = [t.strip() for t in args.target.split(",") if t.strip()]
    if not targets:
        sys.exit("ERRO: --target vazio.")

    keys = [k for k in values if k]
    if args.all_pending:
        keys = [k for k in PENDING_KEYS if k in values] + [k for k in keys if k not in PENDING_KEYS]

    for key in keys:
        value = values[key]
        if not value:
            print(f"[info] {key} vazia — ignorada.")
            continue
        if args.dry_run:
            env_type = "plain" if key.startswith("NEXT_PUBLIC_") else "encrypted"
            print(f"[dry-run] {key} -> {env_type} [{','.join(targets)}] (valor {len(value)} chars)")
            continue
        try:
            result = upsert_env(args.token, project_id, key, value, targets, args.skip_existing)
            status = "já existia (mantido)" if result.get("skipped") else "aplicado"
            print(f"  [ok] {key} -> {status} [{','.join(result.get('targets', targets))}]")
        except RuntimeError as err:
            print(f"  [erro] {key}: {err}")

    print("Concluído.")


if __name__ == "__main__":
    main()
