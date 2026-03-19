# Deploying Balsm Website to Cloudflare Pages

Since you're already using Cloudflare, deploying to Cloudflare Pages is the perfect solution!

## Benefits of Cloudflare Pages

✅ **Free unlimited bandwidth** - No bandwidth limits on any tier
✅ **Global CDN** - Fastest performance worldwide
✅ **Automatic HTTPS** - SSL certificates included
✅ **Easy custom domain** - Already in your Cloudflare account
✅ **DDoS protection** - Built-in security
✅ **Preview deployments** - Every PR gets a URL
✅ **Seamless integration** - Works with your existing Cloudflare setup

---

## Quick Start: Deploy via Dashboard (5 minutes)

### Step 1: Access Cloudflare Pages

1. Go to https://dash.cloudflare.com
2. Select your account
3. Click **Workers & Pages** in the left sidebar
4. Click **Create application** → **Pages** → **Connect to Git**

### Step 2: Connect Repository

1. Click **Connect GitHub** (or GitLab)
2. Authorize Cloudflare to access your repositories
3. Select your **Balsm** repository
4. Click **Begin setup**

### Step 3: Configure Build Settings

```
Project name: balsm-website
Production branch: main
Framework preset: Next.js (Static HTML Export)
Build command: npm run build
Build output directory: .next
Root directory (advanced): website
```

### Step 4: Add Environment Variables

Click **Environment variables (advanced)** and add:

| Variable Name | Value |
|--------------|-------|
| `NODE_VERSION` | `20` |
| `NEXT_PUBLIC_SUPABASE_URL` | `your-supabase-url` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` |

### Step 5: Deploy

1. Click **Save and Deploy**
2. Wait 2-3 minutes for the build to complete
3. Your site will be live at `https://balsm-website.pages.dev`

---

## Connecting Your Custom Domain

Since you're already using Cloudflare for DNS, this is super easy!

### Step 1: Add Custom Domain in Pages

1. Go to your **balsm-website** project in Cloudflare Pages
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter your domain (e.g., `balsm.com` or `www.balsm.com`)
5. Click **Continue**

### Step 2: DNS Configuration (Automatic!)

Cloudflare will automatically:
- ✅ Create the necessary DNS records
- ✅ Issue SSL certificate
- ✅ Enable HTTPS

**That's it!** Your domain will be connected in ~1 minute.

### Recommended Setup:

```
Primary domain: www.balsm.com
Redirect: balsm.com → www.balsm.com
```

Or vice versa:

```
Primary domain: balsm.com
Redirect: www.balsm.com → balsm.com
```

---

## Automatic Deployments with GitHub Actions

I've created a workflow file that will automatically deploy when you push to main.

### Setup GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

1. **CLOUDFLARE_API_TOKEN**
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Click **Create Token**
   - Use template: **Edit Cloudflare Workers**
   - Or create custom token with: `Cloudflare Pages:Edit`
   - Copy the token

2. **CLOUDFLARE_ACCOUNT_ID**
   - Go to https://dash.cloudflare.com
   - Click on **Workers & Pages**
   - Copy the Account ID from the right sidebar

3. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL

4. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous key

### Workflow File

The workflow is already created at:
`.github/workflows/cloudflare-pages.yml`

**How it works:**
- Push to `main` → Automatic production deployment
- Open PR → Automatic preview deployment with unique URL
- Merge PR → Deploy to production

---

## Manual Deployment via CLI

If you prefer command-line deployment:

### Install Wrangler CLI

```bash
npm install -g wrangler
```

### Login to Cloudflare

```bash
wrangler login
```

This opens your browser for authentication.

### Deploy

```bash
cd /Volumes/Code/Balsm/website
./scripts/deploy-cloudflare.sh
```

Or manually:

```bash
cd /Volumes/Code/Balsm/website
npm run build
wrangler pages deploy .next --project-name=balsm-website
```

---

## Advanced Configuration

### Redirects and Headers

Create `/website/public/_redirects`:

```
# Redirect apex to www
https://balsm.com/* https://www.balsm.com/:splat 301

# Or redirect www to apex
# https://www.balsm.com/* https://balsm.com/:splat 301

# Language redirects
/ar /ar/
/en /en/
```

Create `/website/public/_headers`:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/api/*
  Cache-Control: no-store, no-cache, must-revalidate
```

### Preview Branches

Enable preview deployments for all branches:

1. Go to **Settings** → **Builds & deployments**
2. Under **Preview deployments**, select **All non-production branches**
3. Every branch gets a unique URL: `https://branch-name.balsm-website.pages.dev`

---

## Monitoring & Analytics

### Enable Web Analytics (Free)

1. Go to your Cloudflare Pages project
2. Click **Analytics** tab
3. Enable **Web Analytics**
4. Get detailed metrics:
   - Page views
   - Unique visitors
   - Bounce rate
   - Top pages
   - Referrers
   - Geographic data

### Build Notifications

Get notified about deployments:

1. Go to **Settings** → **Notifications**
2. Add webhook for Slack, Discord, or email
3. Get alerts for:
   - Successful deployments
   - Failed builds
   - Build duration

---

## Troubleshooting

### Build Fails

**Check build logs:**
1. Go to your project in Cloudflare
2. Click on the failed deployment
3. View build logs

**Common issues:**
- Missing environment variables
- Node version mismatch (set `NODE_VERSION=20`)
- Wrong build output directory

### Site Not Updating

**Clear cache:**
1. Go to Cloudflare Dashboard → Caching
2. Click **Purge Everything**
3. Wait 30 seconds and refresh

### API Routes Not Working

Next.js API routes need Edge Runtime:

Update your API routes with:
```typescript
export const runtime = 'edge';
```

---

## Cost

**Free Forever Tier includes:**
- ✅ Unlimited bandwidth
- ✅ Unlimited requests
- ✅ 500 builds per month
- ✅ Concurrent builds: 1
- ✅ Free SSL certificates
- ✅ DDoS protection

**Paid ($20/month) adds:**
- 5,000 builds per month
- Concurrent builds: 5
- Instant rollbacks
- Advanced analytics

**For your use case:** Free tier is perfect!

---

## Performance Tips

### 1. Enable Argo Smart Routing ($5/month)
- Routes traffic through fastest paths
- Reduces latency by 30%
- Worth it for global traffic

### 2. Use Cloudflare Images (Optional)
- Automatic image optimization
- Resize and compress images
- Serve WebP/AVIF formats

### 3. Enable HTTP/3
- Already enabled by default on Cloudflare
- Faster loading times

---

## Comparison: Cloudflare Pages vs Others

| Feature | Cloudflare Pages | Vercel | Netlify | Azure |
|---------|-----------------|--------|---------|-------|
| **Bandwidth** | ∞ Unlimited | 100GB | 100GB | 100GB |
| **Builds/month** | 500 | Unlimited | 300 | Unlimited |
| **Custom domain** | ✅ Free | ✅ Free | ✅ Free | ✅ Free |
| **SSL** | ✅ Free | ✅ Free | ✅ Free | ✅ Free |
| **CDN** | Global (270+ cities) | Global | Global | Regional |
| **DDoS protection** | ✅ Included | Paid | Paid | Paid |
| **Price (Free)** | $0 | $0 | $0 | $0 |
| **Already using** | ✅ Yes | ❌ No | ❌ No | ❌ No |

**Winner for Balsm:** Cloudflare Pages 🏆

---

## Next Steps

1. ✅ Deploy via dashboard (5 minutes)
2. ✅ Connect custom domain
3. ✅ Add GitHub secrets for automatic deployments
4. ✅ Test the site
5. ✅ Monitor analytics

---

## Support & Resources

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages
- **Next.js on Pages:** https://developers.cloudflare.com/pages/framework-guides/nextjs
- **Community:** https://community.cloudflare.com

---

## Quick Deploy Command

```bash
cd /Volumes/Code/Balsm/website
./scripts/deploy-cloudflare.sh
```

That's it! Your website will be live with unlimited bandwidth and global CDN. 🚀
