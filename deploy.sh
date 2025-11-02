#!/bin/bash

echo "🚀 Deploying ZapEats to Vercel..."

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the client
echo "🔨 Building React app..."
cd client
npm run build
cd ..

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🎉 Your app should be live at your Vercel URL"
echo ""
echo "📋 Next steps:"
echo "1. Update your Netlify deployment to point to the new Vercel URL"
echo "2. Or delete Netlify and use Vercel for everything"
echo "3. Test authentication at your new URL"