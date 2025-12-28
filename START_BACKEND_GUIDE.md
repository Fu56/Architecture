# 🚨 Backend Server Not Running - Quick Fix Guide

## Problem Identified

You're getting **404 errors** on `auth/login` because the **backend server is NOT running**.

```
❌ Failed to load resource: the server responded with a status of 404 (Not Found)
```

This means your React app is trying to connect to the backend API, but the server isn't started.

---

## ✅ Solution: Start the Backend Server

### Step 1: Open a New Terminal

Open a **new terminal window** (keep the frontend running in the current one).

### Step 2: Navigate to Server Directory

```bash
cd c:\Fuad\Architecture\app\server
```

### Step 3: Install Dependencies (if needed)

```bash
npm install
```

### Step 4: Set Up Database (First Time Only)

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database
npx prisma db seed
```

### Step 5: Start the Backend Server

```bash
npm run dev
```

### Expected Output:

```
Server running on http://localhost:5000
Database connected successfully
```

---

## 🔍 Verify Backend is Running

### Test 1: Health Check

Open your browser and go to:

```
http://localhost:5000/api/health
```

You should see:

```json
{ "ok": true }
```

### Test 2: API Root

Go to:

```
http://localhost:5000/
```

You should see:

```json
{ "message": "Welcome to the Digital Library API" }
```

---

## 🎯 Current Setup

### Frontend (Already Running):

- **Port:** 5173
- **URL:** http://localhost:5173
- **Status:** ✅ Running

### Backend (Needs to Start):

- **Port:** 5000
- **URL:** http://localhost:5000
- **Status:** ❌ Not Running

---

## 📋 Complete Startup Checklist

### Terminal 1 - Frontend (Already Running):

```bash
cd c:\Fuad\Architecture\app\client
npm run dev
# ✅ Running on http://localhost:5173
```

### Terminal 2 - Backend (Start This Now):

```bash
cd c:\Fuad\Architecture\app\server
npm run dev
# Should run on http://localhost:5000
```

---

## 🔧 Troubleshooting

### Issue 1: Port Already in Use

**Error:**

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue 2: Database Connection Error

**Error:**

```
Error: Can't reach database server
```

**Solution:**

1. Make sure PostgreSQL is running
2. Check your `.env` file in `app/server`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   ```
3. Verify database exists

### Issue 3: Module Not Found

**Error:**

```
Cannot find module '@prisma/client'
```

**Solution:**

```bash
cd app/server
npm install
npx prisma generate
```

---

## 🎨 Environment Variables

Make sure you have a `.env` file in `app/server/`:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/architecture_db"

# Server
PORT=5000

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Email Domain (optional)
ALLOWED_EMAIL_DOMAIN="archit.edu"

# Upload Directory
UPLOAD_DIR="./uploads"
```

---

## ✅ After Backend Starts

Once the backend is running, you should see:

### In Terminal:

```
Server running on http://localhost:5000
Database connected successfully
```

### In Browser Console:

- ✅ No more 404 errors
- ✅ Login page loads correctly
- ✅ API calls work

### Test Login:

1. Go to http://localhost:5173/login
2. Use credentials:
   - Email: `admin@archit.edu`
   - Password: `admin123`
3. Should successfully log in!

---

## 📊 Quick Status Check

Run this in your terminal to see what's running:

```bash
# Windows
netstat -ano | findstr "5000 5173"
```

You should see:

- Port **5173** - Frontend (Vite)
- Port **5000** - Backend (Express)

---

## 🚀 Quick Start Commands

### One-Time Setup:

```bash
# In app/server directory
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Every Time You Start Development:

```bash
# Terminal 1 - Frontend
cd app/client
npm run dev

# Terminal 2 - Backend
cd app/server
npm run dev
```

---

## 🎉 Success Indicators

When everything is working:

✅ Frontend terminal shows:

```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

✅ Backend terminal shows:

```
Server running on http://localhost:5000
Database connected successfully
```

✅ Browser console shows:

```
No 404 errors
API calls successful
```

---

## 📝 Next Steps After Starting Backend

1. ✅ Refresh your browser (http://localhost:5173)
2. ✅ Try logging in with sample credentials
3. ✅ Test the navbar features
4. ✅ Access admin panel
5. ✅ Upload resources

---

## 🆘 Still Having Issues?

If you still see 404 errors after starting the backend:

1. **Check both terminals are running**
2. **Verify ports:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
3. **Check API URL in frontend:**
   - File: `app/client/src/lib/api.ts`
   - Should point to: `http://localhost:5000/api`
4. **Clear browser cache** and refresh
5. **Check browser console** for specific errors

---

**Start the backend server now and your 404 errors will disappear!** 🚀
