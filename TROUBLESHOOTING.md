# Better Auth Troubleshooting Guide

## Current Issue

The backend server is not responding to requests. Error: `ERR_CONNECTION_REFUSED`

## Quick Fixes

### 1. Restart the Backend Server

The server needs to restart after the Better Auth configuration changes:

```bash
# Stop the current server (Ctrl+C in the terminal)
# Then restart:
cd app/server
npm run dev
```

### 2. Check Server Logs

Look for any errors in the server terminal. Common issues:

- **Import errors**: Better Auth packages not installed
- **Database connection**: Prisma client needs regeneration
- **Port conflict**: Port 5000 might be in use

### 3. Verify Better Auth Installation

Make sure Better Auth is properly installed:

```bash
cd app/server
npm list better-auth
```

If not installed or wrong version:

```bash
npm install better-auth@latest
```

### 4. Regenerate Prisma Client

After schema changes, regenerate the Prisma client:

```bash
cd app/server
npx prisma generate
```

### 5. Check Environment Variables

Ensure these are set in `app/server/.env`:

```env
DATABASE_URL="your_database_url"
JWT_SECRET="your_secret_key"
BASE_URL="http://localhost:5000"
PORT=5000
```

## Testing the Setup

### Test 1: Check if server is running

```bash
curl http://localhost:5000/api/health
```

Expected: `{"ok":true}`

### Test 2: Check Better Auth endpoint

```bash
curl http://localhost:5000/api/auth/get-session
```

Expected: Session response or 401 Unauthorized (not connection refused)

### Test 3: Check database connection

```bash
cd app/server
npx prisma db pull
```

Expected: Schema is up to date

## Common Errors & Solutions

### Error: "Cannot find module 'better-auth'"

**Solution**: Install Better Auth

```bash
cd app/server
npm install better-auth
```

### Error: "Cannot find module 'better-auth/node'"

**Solution**: Update to latest Better Auth

```bash
cd app/server
npm install better-auth@latest
```

### Error: "PrismaClient is unable to run in the browser"

**Solution**: This is a server-side only package, make sure it's not imported in client code

### Error: "Invalid `prisma` instance"

**Solution**: Regenerate Prisma client

```bash
cd app/server
npx prisma generate
```

### Error: "Port 5000 is already in use"

**Solution**: Kill the process or change port

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=5001
```

## Next Steps After Server Starts

1. ✅ Verify server is running: `http://localhost:5000/api/health`
2. ✅ Test Better Auth: `http://localhost:5000/api/auth/get-session`
3. ✅ Test login from frontend
4. ✅ Check browser console for any errors
5. ✅ Verify session cookies are being set

## If Still Not Working

Check the server terminal output for specific error messages and share them for more targeted help.
