#!/bin/bash

echo "🚀 ByteContest Deployment Script"
echo "=================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/yourrepo.git"
    exit 1
fi

echo "✅ Git repository configured"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy: Update deployment configuration"
git push origin main

echo ""
echo "🎉 Code pushed to GitHub!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. 🌐 Deploy Backend to Render:"
echo "   - Go to https://render.com"
echo "   - Click 'New +' → 'Web Service'"
echo "   - Connect your GitHub repository"
echo "   - Set Root Directory to 'server'"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: npm start"
echo "   - Add environment variables from server/env.example"
echo ""
echo "2. 🎨 Deploy Frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Click 'New Project'"
echo "   - Import your GitHub repository"
echo "   - Set Root Directory to 'client'"
echo "   - Add environment variables from client/env.example"
echo "   - Deploy!"
echo ""
echo "3. 🔗 Update CORS:"
echo "   - After both are deployed, update CORS_ORIGIN in Render"
echo "   - Set it to your Vercel frontend URL"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md" 