# 🚀 Scorpio AI - Deployment Guide

## Vercel + Railway/Render Setup

### 📋 Prerequisites
- GitHub account (for version control)
- Vercel account (https://vercel.com)
- Railway/Render account for backend
- Google Gemini API Key

---

## 🔧 Setup Instructions

### Step 1: Prepare for Git
```bash
# Initialize git repo (if not already)
git init
git add .
git commit -m "Initial commit: Scorpio AI full stack"

# Push to GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/scorpio-ai.git
git push -u origin main
```

### Step 2: Deploy Backend to Railway

**Option A: Railway**
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select `scorpio-ai` repository
4. Choose `backend` folder as root directory
5. Add environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: `AIzaSyCiYHoTDGkAmj06EP5EHg85yfTuB2bWa2I`
6. Deploy → Copy the Railway URL (e.g., `https://your-app.railway.app`)

**Option B: Render**
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add environment variable `GEMINI_API_KEY`
8. Deploy → Copy the Render URL

### Step 3: Update Frontend URL

Update the backend URL in `frontend/index.html`:

**Find this line in the script:**
```javascript
const res = await fetch("/api/chat", {
```

**Replace with your backend URL:**
```javascript
const res = await fetch("https://your-railway-or-render-url/api/chat", {
```

Or better, use environment variables:
```javascript
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
const res = await fetch(`${BACKEND_URL}/api/chat", {
```

### Step 4: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import from GitHub → Select `scorpio-ai`
4. **Root Directory:** `frontend`
5. Framework: `Other (HTML/CSS/JS)`
6. Build Command: Leave empty (static site)
7. Output Directory: `frontend`
8. Environment Variables:
   - Key: `BACKEND_URL`
   - Value: (akan diupdate setelah deploy backend)
   - Example: `https://your-railway-app.railway.app` atau `https://your-app.onrender.com`
9. Click "Deploy"

### After Backend Deployment

Setelah backend selesai di-deploy:
1. Kembali ke Vercel → Project Settings → Environment Variables
2. Update `BACKEND_URL` dengan URL backend yang sudah di-deploy
3. Redeploy frontend untuk apply perubahan

---

## 🌐 Access Your App

After deployment:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-railway-app.railway.app/api/chat`

---

## 🔒 Security Notes

⚠️ **NEVER commit `.env` file with API keys**

For production:
1. Store API keys in platform's environment variables
2. Use CORS restrictions in backend:
   ```javascript
   const corsOptions = {
     origin: 'https://your-app.vercel.app'
   };
   app.use(cors(corsOptions));
   ```

---

## 📱 Local Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
# Open frontend/index.html in browser or run HTTP server
npx http-server frontend
```

---

## 🆘 Troubleshooting

**Issue: "Cannot reach backend"**
- Check backend URL in frontend code
- Verify backend is running and deployed
- Check CORS settings

**Issue: "API Key not working"**
- Verify API key in environment variables
- Check it hasn't expired
- Regenerate from Google AI Studio

**Issue: "Messages not saving"**
- Backend session storage is RAM-based (resets on restart)
- This is intentional - use database for persistence

---

## 📝 Next Steps

1. Add database (MongoDB Atlas, Supabase) for persistent sessions
2. Add user authentication
3. Implement rate limiting
4. Add analytics
5. Custom domain setup

---

**Happy deploying! 🎉**
