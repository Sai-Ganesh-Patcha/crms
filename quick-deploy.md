# 🎯 CRMS Deployment - Quick Reference Card

## 📋 What You'll Need

- [ ] GitHub account
- [ ] Render account (free): https://render.com
- [ ] MongoDB Atlas account (free): https://mongodb.com/cloud/atlas

## ⚡ 5-Minute Deployment Checklist

### 1️⃣ GitHub (2 min)
```bash
# Create repo at: https://github.com/new
# Name: crms-deployment

# Then run:
git remote add origin https://github.com/YOUR_USERNAME/crms-deployment.git
git branch -M main
git push -u origin main
```

### 2️⃣ MongoDB Atlas (3 min)
- Create free cluster at: https://mongodb.com/cloud/atlas
- Create user: `crms-admin` with password
- Whitelist IP: `0.0.0.0/0` (all IPs)
- Get connection string: 
  ```
  mongodb+srv://crms-admin:PASSWORD@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```

### 3️⃣ Render Backend (5 min)
Go to: https://dashboard.render.com

**New Web Service:**
- Repository: `crms-deployment`
- Name: `crms-backend`
- Root Directory: `backend`
- Build: `npm install`
- Start: `npm start`

**Environment Variables:**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<random_32_char_string>
JWT_EXPIRE=24h
FRONTEND_URL=https://crms-frontend.onrender.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
BCRYPT_ROUNDS=10
```

### 4️⃣ Render Frontend (3 min)
**New Static Site:**
- Repository: `crms-deployment`
- Name: `crms-frontend`
- Build: `echo "No build needed"`
- Publish: `.`

### 5️⃣ Update URLs (2 min)
1. **Update backend CORS**: 
   - Render → crms-backend → Environment
   - Change `FRONTEND_URL` to your actual frontend URL
   
2. **Update frontend config**:
   - Edit `js/config.js` line 8
   - Set `PRODUCTION_API_URL` to your backend URL
   - Commit and push:
     ```bash
     git add js/config.js
     git commit -m "Update API URL"
     git push
     ```

## 🎉 Done!

Your app is live at: `https://crms-frontend-XXXX.onrender.com`

---

## 🔗 Important Links

| Service | URL | Purpose |
|---------|-----|---------|
| GitHub Repo | https://github.com/YOUR_USERNAME/crms-deployment | Source code |
| MongoDB Atlas | https://cloud.mongodb.com | Database |
| Render Dashboard | https://dashboard.render.com | Hosting |
| Frontend (Live) | https://crms-frontend-XXXX.onrender.com | User access |
| Backend API | https://crms-backend-XXXX.onrender.com | API server |

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend not starting | Check MongoDB connection string & env vars |
| Frontend can't connect | Update `PRODUCTION_API_URL` in config.js |
| Database errors | Verify IP whitelist (0.0.0.0/0) in MongoDB |
| Slow first load | Normal - free tier spins down after 15 min |

---

## 📊 Next Steps After Deployment

1. ✅ Test login functionality
2. ✅ Seed database: `npm run seed` (in Render Shell)
3. ✅ Change default passwords
4. ✅ Share frontend URL with users

---

**Need detailed instructions?** See `deploy-to-render.md`

**Total Time: ~15 minutes** ⏱️
