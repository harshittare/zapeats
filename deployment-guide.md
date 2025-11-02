# ZapEats Deployment Guide

## 🚨 Current Issue
Netlify is a **static hosting service** and cannot run your Node.js authentication server. Your frontend is trying to connect to `localhost:5001` which doesn't exist on Netlify.

## 🛠️ Solution: Deploy Backend + Frontend Separately

### Step 1: Deploy Backend to Heroku (Free)

1. **Install Heroku CLI**: Download from https://devcenter.heroku.com/articles/heroku-cli

2. **Create Heroku app:**
```bash
cd server
heroku login
heroku create zapeats-api
```

3. **Add a Procfile** in your `server` folder:
```
web: node minimal-auth.js
```

4. **Deploy:**
```bash
git add .
git commit -m "Deploy backend"
git push heroku main
```

5. **Your backend will be live at:** `https://zapeats-api.herokuapp.com`

### Step 2: Update Frontend Environment

Update `client/.env`:
```env
REACT_APP_API_URL=https://zapeats-api.herokuapp.com/api
```

### Step 3: Redeploy Frontend to Netlify

```bash
cd client
npm run build
# Upload the build folder to Netlify
```

## 🚀 Alternative: Deploy Everything to Vercel

1. **Deploy to Vercel** (supports both frontend and API routes):
```bash
npx vercel
```

2. **Move your auth endpoints** to `api/` folder for Vercel
3. **One deployment** handles both frontend and backend

## 🎯 Quick Test Backend Deployment

1. **Create `server/package.json`** if missing:
```json
{
  "name": "zapeats-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node minimal-auth.js"
  },
  "dependencies": {}
}
```

2. **Test locally:**
```bash
cd server
node minimal-auth.js
```

3. **Deploy to your chosen platform**

## 📋 Current Working Files
- ✅ `server/minimal-auth.js` - Production-ready auth server
- ✅ `server/auth-test.html` - Testing interface
- ✅ Authentication endpoints working locally

## 🔄 After Backend Deployment
1. Update `REACT_APP_API_URL` in client/.env
2. Rebuild and redeploy frontend
3. Test authentication flow

Your authentication system is perfect - it just needs proper hosting! 🎉