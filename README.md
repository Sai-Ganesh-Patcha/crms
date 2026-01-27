# 🎓 CRMS - College Result Management System

A production-grade College Result Management System with role-based access control for Students, Faculty, HOD, and Admin.

## 🚀 Live Deployment

**This project is ready to deploy to Render!**

### Quick Start (15 minutes)
1. 📖 Open `quick-deploy.md` for step-by-step instructions
2. 🔧 Follow the checklist
3. 🎉 Your app will be live!

### Deployment Guides
- **`quick-deploy.md`** - Quick reference card (⚡ Start here!)
- **`deploy-to-render.md`** - Detailed deployment guide
- **`DEPLOYMENT.md`** - Comprehensive documentation

## ✨ Features

### Student Dashboard
- View personal details
- Check semester results
- Download result PDFs
- Track academic performance

### Faculty Dashboard
- Manage student records
- Upload and update results
- Generate class analytics
- Export data to Excel/CSV

### HOD Dashboard
- Oversee department operations
- Manage faculty accounts
- Generate department reports
- Monitor academic performance

### Admin Dashboard
- Complete system control
- User management (all roles)
- System-wide analytics
- Backup and restore functionality

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - API server
- **MongoDB** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **Rate Limiting** - DDoS protection

### Frontend
- **HTML5** + **CSS3** + **JavaScript** (Vanilla)
- **Responsive Design** - Mobile-friendly
- **LocalStorage** - Client-side caching
- **Modern UI** - Clean and professional

## 📁 Project Structure

```
CRMS/
├── backend/                # Node.js backend
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth & validation
│   │   ├── controllers/   # Business logic
│   │   ├── services/      # Helper services
│   │   ├── config/        # Configuration
│   │   └── server.js      # Entry point
│   └── package.json
├── js/                    # Frontend JavaScript
│   ├── config.js         # API configuration
│   ├── auth.js           # Authentication
│   ├── data.js           # Data management
│   └── security.js       # Security utilities
├── css/                   # Stylesheets
├── pages/                 # HTML pages
│   ├── login.html
│   ├── student.html
│   ├── faculty.html
│   ├── hod.html
│   └── admin.html
├── index.html             # Landing page
├── render.yaml            # Render deployment config
└── deploy-to-render.md   # Deployment guide
```

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on all endpoints
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection protection
- ✅ XSS prevention

## 🌐 Deployment

### Prerequisites
- GitHub account
- Render account (free)
- MongoDB Atlas account (free)

### Deploy Now!
```bash
# 1. Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/crms-deployment.git
git branch -M main
git push -u origin main

# 2. Follow deploy-to-render.md guide
# 3. Your app will be live in ~15 minutes!
```

## 📚 API Documentation

### Authentication
```
POST /api/auth/login       - User login
POST /api/auth/logout      - User logout
POST /api/auth/refresh     - Refresh token
```

### Students
```
GET    /api/students       - Get all students
GET    /api/students/:id   - Get student by ID
POST   /api/students       - Create student
PUT    /api/students/:id   - Update student
DELETE /api/students/:id   - Delete student
```

### Results
```
GET    /api/results/:studentId  - Get student results
POST   /api/results              - Add new result
PUT    /api/results/:id          - Update result
DELETE /api/results/:id          - Delete result
```

### Users (Admin only)
```
GET    /api/users          - Get all users
POST   /api/users          - Create user
PUT    /api/users/:id      - Update user
DELETE /api/users/:id      - Delete user
```

## 🧪 Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

### Frontend
Just open `index.html` in your browser, or use a local server:
```bash
python -m http.server 3000
# or
npx serve .
```

## 📊 Environment Variables

Create `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crms
JWT_SECRET=your-secret-key
JWT_EXPIRE=24h
FRONTEND_URL=http://localhost:3000
```

See `backend/.env.example` for all variables.

## 🎯 Default Credentials (After Seeding)

Run seed script:
```bash
cd backend
npm run seed
```

Default users (change in production!):
- **Admin**: `admin@college.edu` / `admin123`
- **HOD**: `hod@college.edu` / `hod123`  
- **Faculty**: `faculty@college.edu` / `faculty123`
- **Student**: `student@college.edu` / `student123`

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables
- Check if port 5000 is available

### Frontend can't connect to backend
- Update `PRODUCTION_API_URL` in `js/config.js`
- Check CORS settings in backend
- Verify backend is running

### Database errors
- Ensure MongoDB is running
- Check connection string format
- Verify database user permissions

## 📄 License

This project is for educational purposes.

## 👥 Support

For deployment help:
1. Check `deploy-to-render.md`
2. Review `quick-deploy.md`
3. Check Render logs for errors

## 🎉 Ready to Deploy?

**Start here:** Open `quick-deploy.md` and follow the checklist!

Your CRMS will be live in about 15 minutes. 🚀

---

Made with ❤️ for educational institutions
