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
if [ ! -d ".next/standalone" ]; then
  echo "❌ Build failed: .next/standalone not found"
  exit 1
fi
echo "✅ Build successful"

# 4. Stop current application
echo "🛑 Stopping current application..."
pm2 stop sitegeef || true
sleep 2

# 5. Delete old process and start with PM2
echo "▶️  Starting application with PM2..."
pm2 delete sitegeef || true
pm2 start npm --name "sitegeef" -- run start:standalone
sleep 3

# 6. Check PM2 status
echo "📊 PM2 Status:"
pm2 status

# 7. Ensure PM2 auto-starts on server restart
echo "🔄 Configuring PM2 auto-startup..."
pm2 startup systemd -u ubuntu --hp /home/ubuntu 2>/dev/null || true
pm2 save

# 8. Health check
echo ""
echo "🏥 Health Check:"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3500 | grep -q "200\|301\|302"; then
  echo "✅ Server is running and responding on port 3500"
else
  echo "⚠️  Server not responding yet (may still be starting)"
fi

echo ""
echo "🎉 Deployment successful!"
echo "📝 Application logs: pm2 logs sitegeef"
echo "📊 Monitor: pm2 monit"
