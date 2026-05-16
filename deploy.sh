#!/bin/bash

# GEEF Site Deploy Script
# Executa no servidor VPS para fazer deploy da nova versão

set -e

echo "🚀 Starting deployment..."
echo "📍 Working directory: $(pwd)"

# 1. Pull latest code
echo "⬇️  Pulling latest code from GitHub..."
git fetch origin
git reset --hard origin/main

# 1.5 Configure environment variables
echo "⚙️  Configuring environment..."
cat > .env.local << 'EOF'
NEXT_PUBLIC_SITE_URL=https://geef.com.br
NEXT_PUBLIC_SUPABASE_URL=https://nycgpokqlmrfzegjlrwa.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_jDq5SX_k4spHMCCPVvlsrQ_-ZZybt8e
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Y2dwb2txbG1yZnplZ2pscndhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODM3Mzc4MSwiZXhwIjoyMDkzOTQ5NzgxfQ.BnoQWqFmV0YyfKAfCSJMiMJYUuTWwwmT3ORBKMHElJM
EOF

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit

# 3. Build the application
echo "🔨 Building application..."
npm run build

# 4. Stop current application
echo "🛑 Stopping current application..."
pm2 stop sitegeef 2>/dev/null || true

# 5. Start/restart with PM2
echo "▶️  Starting application with PM2..."
pm2 start npm --name "sitegeef" -- run start:standalone 2>/dev/null || pm2 restart sitegeef

# 6. Check status
echo "✅ Deployment complete!"
pm2 status

echo ""
echo "📊 Application Status:"
curl -s http://localhost:3500 > /dev/null && echo "✅ Server is running on port 3500" || echo "⚠️ Server not responding"

echo ""
echo "🎉 Deployment successful!"
