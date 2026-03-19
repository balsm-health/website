#!/bin/bash

# Balsm Website - Cloudflare Pages Deployment Script

set -e

echo "======================================"
echo "Balsm Website - Cloudflare Pages"
echo "======================================"
echo ""

# Check if Wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "Installing Wrangler CLI..."
    npm install -g wrangler
fi

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "Error: Run this from the website directory"
    exit 1
fi

# Login to Cloudflare
echo "Logging in to Cloudflare..."
wrangler login

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf .next
rm -rf dev
rm -rf .turbo
rm -rf node_modules/.cache

# Build the project
echo "Building Next.js application..."
npm run build

# Deploy to Cloudflare Pages
echo "Deploying to Cloudflare Pages..."
wrangler pages deploy .next --project-name=balsm-website

echo ""
echo "======================================"
echo "Deployment Complete!"
echo "======================================"
echo ""
echo "Next Steps:"
echo "1. Go to https://dash.cloudflare.com"
echo "2. Navigate to Workers & Pages → balsm-website"
echo "3. Go to Settings → Environment variables"
echo "4. Add:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "5. Redeploy: wrangler pages deploy .next --project-name=balsm-website"
echo ""
echo "Your site will be available at:"
echo "https://balsm-website.pages.dev"
echo ""
echo "To use your custom domain, configure it in Cloudflare Dashboard"
echo ""
