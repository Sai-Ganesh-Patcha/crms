# 🚀 CRMS Deployment Guide - Render

This guide will help you deploy the College Result Management System (CRMS) to Render.

## 📋 Prerequisites

1. **GitHub Account** - To push code
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **MongoDB Atlas Account** - For database (free tier available)

---

## 🗄️ Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 tier)
3. Create a database user:
   - Username: `crms-admin`
   - Password: (generate a strong password)
4. Whitelist all IPs: `0.0.0.0/0` (for Render access)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/crms?retryWrites=true&w=majority
   ```
6. Save this connection string - you'll need it!

---

## 📦 Step 2: Push Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   cd "d:\DEPT AG COPY 1"
   git init
   git add .
   git commit -m "Initial commit for CRMS deployment"
   ```

2. **Create GitHub Repository**:
   - Go to [GitHub](https://github.com/new)
   - Name: `crms-project`
   - Make it **private** if needed
   - Don't initialize with README

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/crms-project.git
   git branch -M main
   git push -u origin main
   ```

---

## 🎯 Step 3: Deploy Backend to Render

### Option A: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `crms-project`

3. **Configure Backend Service**:
   - **Name**: `crms-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

4. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_SECRET=<generate_random_32char_string>
   JWT_EXPIRE=24h
   FRONTEND_URL=https://crms-frontend.onrender.com
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=100
   BCRYPT_ROUNDS=10
   ```

5. **Click "Create Web Service"**

6. **Wait for Deployment**: Takes 2-5 minutes
   - You'll see build logs
   - When done, you'll get a URL like: `https://crms-backend.onrender.com`

7. **Seed Database** (Optional):
   - In Render dashboard → Shell
   - Run: `npm run seed`

### Option B: Using Blueprint (Automated)

This repo includes a `render.yaml` file. Just:
1. Go to Render Dashboard → "New +" → "Blueprint"
2. Connect repo and deploy!

---

## 🌐 Step 4: Deploy Frontend to Render

1. **Create New Static Site**:
   - Click "New +" → "Static Site"
   - Select `crms-project` repository

2. **Configure Frontend Service**:
   - **Name**: `crms-frontend`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Root Directory**: `.` (keep empty or just dot)
   - **Build Command**: `echo "No build needed"`
   - **Publish Directory**: `.`

3. **Add Environment Variable**:
   ```
   BACKEND_URL=https://crms-backend.onrender.com
   ```

4. **Click "Create Static Site"**

5. **Wait for Deployment**: Takes 1-2 minutes
   - You'll get a URL like: `https://crms-frontend.onrender.com`

---

## 🔧 Step 5: Update Backend CORS

After frontend is deployed:

1. Go to backend service in Render
2. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://crms-frontend-XXXX.onrender.com
   ```
   (Replace with your actual frontend URL)
3. Save changes - backend will auto-redeploy

---

## ✅ Step 6: Test Your Deployment

1. **Visit Frontend URL**: `https://crms-frontend-XXXX.onrender.com`
2. **Login Page Should Appear**
3. **Test Login**:
   - Try default credentials (from seed data if you seeded)
   - Or create a new user via API

4. **Test API Directly**:
   ```bash
   curl https://crms-backend-XXXX.onrender.com/api/health
   ```
   Should return: `{"success":true,"message":"CRMS API is healthy"}`

---

## 📝 Default Credentials (If Seeded)

Check your `backend/src/scripts/seed.js` for default users.

Common defaults:
- **Admin**: `admin@college.edu` / `admin123`
- **HOD**: `hod@college.edu` / `hod123`
- **Faculty**: `faculty@college.edu` / `faculty123`
- **Student**: `student@college.edu` / `student123`

**⚠️ IMPORTANT**: Change these in production!

---

## 🎨 Custom Domain (Optional)

1. Go to Settings → Custom Domain
2. Add your domain
3. Follow DNS configuration instructions

---

## 🛠️ Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables are set
- Check Render logs for errors

### Frontend can't connect to backend
- Verify backend URL in config.js
- Check CORS settings in backend
- Ensure both services are deployed

### Database connection failed
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check username/password in connection string
- Ensure database name matches in connection string

---

## 📚 Useful Commands

### View Logs
In Render dashboard → Logs tab

### Access Shell
In Render dashboard → Shell tab
```bash
cd backend
npm run seed    # Seed database
node src/scripts/backup.js  # Backup data
```

### Redeploy
- Commit & push to GitHub
- Render auto-deploys on push
- Or use "Manual Deploy" in dashboard

---

## 🔒 Security Checklist

- [ ] Changed all default passwords
- [ ] JWT_SECRET is strong random string
- [ ] MongoDB has strong password
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] CORS is configured correctly
- [ ] Environment variables are set

---

## 🎉 Success!

Your CRMS should now be live at:
- **Frontend**: `https://crms-frontend-XXXX.onrender.com`
- **Backend API**: `https://crms-backend-XXXX.onrender.com`

Share the frontend URL with users!

---

## 💡 Performance Notes

⚠️ **Render Free Tier Limitations**:
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Upgrade to paid plan for 24/7 uptime

---

## 🆘 Need Help?

1. Check Render documentation: [docs.render.com](https://docs.render.com)
2. Review logs in Render dashboard
3. Check MongoDB Atlas connection status
4. Verify all environment variables

---

**Happy Deploying! 🚀**
