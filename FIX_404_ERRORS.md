# 🚨 URGENT: Fix 404 Errors - Action Required

## Problem Summary

You're seeing **404 errors** because:

1. ❌ **Backend server is NOT running**
2. ❌ **Frontend .env file is missing**

---

## ✅ SOLUTION - Follow These Steps:

### Step 1: Create Frontend .env File

Create a file named `.env` in `app/client/` directory with this content:

```env
VITE_API_URL=http://localhost:5000/api
```

**How to create:**

1. Navigate to: `c:\Fuad\Architecture\app\client\`
2. Create new file: `.env`
3. Add the line above
4. Save the file

---

### Step 2: Start Backend Server

Open a **NEW terminal** and run:

```bash
cd c:\Fuad\Architecture\app\server
npm run dev
```

**Expected output:**

```
Server running on http://localhost:5000
Database connected successfully
```

---

### Step 3: Restart Frontend (if needed)

If the frontend doesn't pick up the .env file:

1. Stop the current frontend (Ctrl+C)
2. Restart it:
   ```bash
   npm run dev
   ```

---

## 🔍 Verify Everything Works

### 1. Check Backend is Running:

Open browser: http://localhost:5000/api/health

Should see:

```json
{ "ok": true }
```

### 2. Check Frontend Environment:

In browser console (F12), type:

```javascript
console.log(import.meta.env.VITE_API_URL);
```

Should show:

```
http://localhost:5000/api
```

### 3. Test Login:

1. Go to: http://localhost:5173/login
2. Enter:
   - Email: `admin@archit.edu`
   - Password: `admin123`
3. Should successfully log in!

---

## 📋 Quick Checklist

- [ ] Created `.env` file in `app/client/`
- [ ] Added `VITE_API_URL=http://localhost:5000/api`
- [ ] Started backend server in new terminal
- [ ] Backend shows "Server running on http://localhost:5000"
- [ ] Restarted frontend (if needed)
- [ ] No more 404 errors in console
- [ ] Can successfully login

---

## 🎯 File Locations

### Frontend .env:

```
c:\Fuad\Architecture\app\client\.env
```

Content:

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend .env:

```
c:\Fuad\Architecture\app\server\.env
```

Content (if missing):

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/architecture_db"
PORT=5000
JWT_SECRET="your-secret-key-here"
ALLOWED_EMAIL_DOMAIN="archit.edu"
UPLOAD_DIR="./uploads"
```

---

## 🚀 Complete Setup Commands

### First Time Setup:

```bash
# Backend setup
cd app/server
npm install
npx prisma generate
npx prisma db push
npx prisma db seed

# Frontend setup
cd ../client
npm install
# Create .env file manually (see above)
```

### Daily Development:

```bash
# Terminal 1 - Backend
cd app/server
npm run dev

# Terminal 2 - Frontend
cd app/client
npm run dev
```

---

## ⚠️ Important Notes

1. **Both servers must run simultaneously:**

   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

2. **The .env file is crucial:**

   - Without it, frontend doesn't know where backend is
   - Must be in `app/client/` directory
   - Must be named exactly `.env`

3. **After creating .env:**
   - Restart the frontend dev server
   - Refresh your browser

---

## 🎉 Success Indicators

When everything works:

✅ **Backend Terminal:**

```
Server running on http://localhost:5000
Database connected successfully
```

✅ **Frontend Terminal:**

```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

✅ **Browser Console:**

```
No 404 errors
API calls successful
Login works
```

---

## 🆘 Still Not Working?

### Check 1: Backend Running?

```bash
# Windows
netstat -ano | findstr :5000
```

Should show a process on port 5000.

### Check 2: .env File Correct?

```bash
cd app/client
type .env
```

Should show:

```
VITE_API_URL=http://localhost:5000/api
```

### Check 3: Frontend Restarted?

After creating .env, you MUST restart the frontend server.

---

## 📞 Quick Reference

| Item          | Value                           |
| ------------- | ------------------------------- |
| Frontend URL  | http://localhost:5173           |
| Backend URL   | http://localhost:5000           |
| API Base URL  | http://localhost:5000/api       |
| Admin Login   | admin@archit.edu / admin123     |
| Faculty Login | faculty@archit.edu / faculty123 |
| Student Login | student@archit.edu / student123 |

---

**DO THESE TWO THINGS NOW:**

1. ✅ Create `app/client/.env` with `VITE_API_URL=http://localhost:5000/api`
2. ✅ Start backend: `cd app/server && npm run dev`

**Then refresh your browser and the 404 errors will be gone!** 🚀
