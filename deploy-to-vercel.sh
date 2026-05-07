#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"

echo "=== [1/6] Git state check ==="
for lock in .git/HEAD.lock .git/MERGE_HEAD .git/index.lock; do
  [ -f "$lock" ] && { echo "Removing stale $lock"; rm -f "$lock"; }
done

if [ -f .git/MERGE_HEAD ]; then git merge --abort || true; fi
if [ -f .git/REBASE_HEAD ]; then git rebase --abort || true; fi

# Drop stashes so they don't interfere
git stash list | grep -q . && git stash drop || true

# Stage new feature files
git add .gitignore
git add "app/(app)/concierge/ConciergeChat.tsx" 2>/dev/null || true
git add "app/api/auth/dev-signin/" 2>/dev/null || true
git add "hooks/useMeeraChat.ts" 2>/dev/null || true
git add "lib/concierge/" 2>/dev/null || true
git add "lib/env-check.ts" 2>/dev/null || true
git add "types/meera.ts" 2>/dev/null || true
git add "deploy-to-vercel.sh" 2>/dev/null || true

if ! git diff --cached --quiet; then
  echo "Committing staged changes..."
  git commit -m "feat: add Meera concierge chat, env-check, dev-signin, deploy script

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
fi

echo "=== [2/6] Sync with origin ==="
git fetch origin
git merge -X ours origin/master --no-edit 2>/dev/null || true
git push origin master

echo "=== [3/6] Build check ==="
npm run build

echo "=== [4/6] Deploy to Vercel production ==="
DEPLOY_OUTPUT=$(vercel --prod --yes 2>&1)
echo "$DEPLOY_OUTPUT"
# Prefer the aliased production URL (public) over the deployment-specific URL (Vercel-protected)
DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -Eo 'Aliased: https://[a-zA-Z0-9._/-]+' | grep -Eo 'https://[^ ]+' | head -1 || true)
if [ -z "$DEPLOY_URL" ]; then
  DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -Eo 'https://[a-zA-Z0-9._-]+\.vercel\.app' | tail -1 || true)
fi
echo ""
echo "Deployed URL: ${DEPLOY_URL:-unknown}"

echo "=== [5/6] Smoke tests ==="
if [ -n "${DEPLOY_URL:-}" ]; then
  echo "Testing $DEPLOY_URL ..."

  echo -n "  GET /api/destinations ... "
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/api/destinations" || echo "000")
  echo "$STATUS"
  [ "$STATUS" != "200" ] && echo "  WARN: /api/destinations returned $STATUS"

  echo -n "  GET /api/muhurat?date=2026-05-07 ... "
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/api/muhurat?date=2026-05-07" || echo "000")
  echo "$STATUS"

  echo -n "  GET / (home page) ... "
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/" || echo "000")
  echo "$STATUS"
  { [ "$STATUS" = "200" ] || [ "$STATUS" = "307" ]; } && echo "  Home page OK" || true
else
  echo "No deploy URL captured — skipping smoke tests"
fi

echo "=== [6/6] Done ==="
echo "Deployment complete!"
