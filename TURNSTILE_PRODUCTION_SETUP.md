# Turnstile Production Setup Guide

## 🎯 Overview
This guide will help you complete the Cloudflare Turnstile CAPTCHA setup for production.

---

## ✅ Step 1: Get Your Cloudflare Turnstile Keys

1. Go to https://dash.cloudflare.com/
2. Select your account
3. Navigate to **Turnstile** in the left sidebar
4. Click **Create Widget** (or select existing widget)
5. Configure:
   - **Widget Name**: Barangay Bakilid Production
   - **Domain**: `bakilidgov.vercel.app` (your Vercel domain)
   - **Widget Mode**: Managed
6. Copy both keys:
   - **Site Key** (starts with `0x`) - for frontend
   - **Secret Key** (starts with `0x`) - for backend

---

## ✅ Step 2: Update Frontend Configuration

### Option A: Using Vercel Environment Variables (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your project (bakilidgov)
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Key**: `VITE_TURNSTILE_SITE_KEY`
   - **Value**: Your production site key (from Step 1)
   - **Environments**: Select "Production", "Preview", and "Development"
5. Click **Save**
6. Go to **Deployments** → Click **Redeploy** (uncheck "Use existing Build Cache")

### Option B: Using Hardcoded Fallback (Quick Fix)

1. Open: `barangay_client/src/config/turnstile.js`
2. Replace this line:
   ```javascript
   const PRODUCTION_SITE_KEY = 'YOUR_PRODUCTION_TURNSTILE_SITE_KEY_HERE';
   ```
   With your actual production site key:
   ```javascript
   const PRODUCTION_SITE_KEY = '0xYourActualSiteKeyHere';
   ```
3. Commit and push:
   ```bash
   git add src/config/turnstile.js
   git commit -m "chore: Add production Turnstile site key"
   git push origin main
   ```

---

## ✅ Step 3: Update Backend Configuration

### On Railway:

1. Go to https://railway.app/dashboard
2. Select your project (barangay-bakilid-server)
3. Go to **Variables** tab
4. Add new variable:
   - **Key**: `TURNSTILE_SECRET_KEY`
   - **Value**: Your production secret key (from Step 1)
5. Click **Add** and **Deploy**

The server will automatically restart with the new environment variable.

---

## ✅ Step 4: Verify Deployment

### Frontend Verification:

1. Visit your production site: https://bakilidgov.vercel.app/login
2. Open **Browser Console** (F12 → Console)
3. Look for these messages:
   ```
   ✅ Using Turnstile key from environment
   ✅ Turnstile widget loaded
   ```
4. You should see the Cloudflare Turnstile CAPTCHA widget
5. Complete the CAPTCHA and try logging in

### Backend Verification:

1. After successful login, check Railway logs:
   ```
   🔒 Turnstile verification result: true
   ```

---

## 🔧 Troubleshooting

### CAPTCHA Not Showing:

**Check Console for:**
```
⚠️ Using test Turnstile key
```
**Solution**: Environment variable not set. Follow Step 2.

**Check Console for:**
```
❌ Security verification unavailable
```
**Solution**: 
- Verify `VITE_TURNSTILE_SITE_KEY` is set in Vercel
- Redeploy with cache cleared

### Login Fails with "Verification required":

**Error in Browser:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{
    "field": "turnstileToken",
    "message": "Verification token is required"
  }]
}
```

**Solution**: 
- CAPTCHA widget is not loading properly
- Check if domain is added to Cloudflare Turnstile widget settings
- Verify site key is correct

### Backend Rejects Token:

**Railway Logs Show:**
```
❌ Turnstile verification failed: ['invalid-input-response']
```

**Solution**:
- Secret key mismatch
- Verify `TURNSTILE_SECRET_KEY` in Railway matches your Cloudflare secret
- Ensure secret key is for the same widget as site key

---

## 📋 Quick Checklist

- [ ] Cloudflare Turnstile widget created with production domain
- [ ] Site key added to Vercel environment variables OR hardcoded in `turnstile.js`
- [ ] Secret key added to Railway environment variables
- [ ] Frontend redeployed (without cache)
- [ ] Backend redeployed with new environment variable
- [ ] CAPTCHA widget visible on login/register pages
- [ ] Login successful with CAPTCHA verification
- [ ] Registration successful with CAPTCHA verification

---

## 🚀 Current Status

### ✅ Completed:
- Turnstile integration in all auth pages (login, admin login, registration)
- Centralized configuration with fallback mechanism
- Error handling and user feedback
- Debug logging for troubleshooting
- Server-side verification implementation

### 🔄 Pending:
- Add production Turnstile keys to environment variables
- Redeploy both frontend and backend

---

## 📞 Support

If you encounter issues:

1. Check browser console for error messages
2. Check Railway logs for server errors
3. Verify all environment variables are set correctly
4. Ensure domain is added in Cloudflare Turnstile settings

---

## 🔐 Security Notes

- Never commit production keys to git
- Use environment variables for all production secrets
- Test keys (`1x000...`) work on localhost only
- Production keys (`0x...`) work on specified domains only
- Rotate keys if compromised