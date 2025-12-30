# 🚀 Complete Setup Guide: Database & Navbar

## ✅ What We've Done

### 1. **Enhanced Navbar UI** ✨

- ✅ Added Upload button for authenticated users
- ✅ Added Notifications bell with badge counter
- ✅ Created user dropdown menu with:
  - Dashboard link
  - Admin Panel link (for admins)
  - Settings link
  - Sign Out button
- ✅ Improved mobile navigation
- ✅ Better user experience with hover effects

### 2. **Updated Database Seed** 🌱

- ✅ Added sample users (Admin, Faculty, Student)
- ✅ Includes password hashing
- ✅ Creates all necessary roles and design stages

---

## 📋 Step-by-Step Instructions

### Part 1: Set Up Database

#### Step 1: Configure Database Connection

1. Navigate to `app/server` directory
2. Create or update `.env` file with your PostgreSQL connection:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your-secret-key-here"
ALLOWED_EMAIL_DOMAIN="archit.edu"
PORT=5000
```

**Replace with your actual values:**

- `username` - Your PostgreSQL username (e.g., postgres)
- `password` - Your PostgreSQL password
- `database_name` - Your database name (e.g., architecture_db)

#### Step 2: Install Dependencies

```bash
cd app/server
npm install
```

#### Step 3: Generate Prisma Client

```bash
npx prisma generate
```

This creates the Prisma Client based on your schema.

#### Step 4: Create Database Tables

**Option A: Using Migrations (Recommended for Production)**

```bash
npx prisma migrate dev --name init
```

This will:

- Create migration files
- Apply schema to database
- Create all tables

**Option B: Push Schema (Quick for Development)**

```bash
npx prisma db push
```

This directly pushes the schema to the database without creating migration files.

#### Step 5: Seed the Database

```bash
npx prisma db seed
```

This will create:

- 4 Roles: Student, Faculty, Admin, SuperAdmin
- 7 Design Stages
- 3 Sample Users:
  - **Admin**: admin@archit.edu / admin123
  - **Faculty**: faculty@archit.edu / faculty123
  - **Student**: student@archit.edu / student123

#### Step 6: Verify Database

Open Prisma Studio to view your data:

```bash
npx prisma studio
```

This opens a GUI at `http://localhost:5555` where you can see all your tables and data.

---

### Part 2: Start the Application

#### Step 1: Start Backend Server

In `app/server` directory:

```bash
npm run dev
```

The server should start on `http://localhost:5000`

#### Step 2: Start Frontend Client

In `app/client` directory (new terminal):

```bash
npm run dev
```

The client should start on `http://localhost:5173`

---

### Part 3: Test the Application

#### 1. **Test Login**

Navigate to `http://localhost:5173/login`

Try logging in with:

- Email: `admin@archit.edu`
- Password: `admin123`

#### 2. **Test New Navbar Features**

After logging in, you should see:

- ✅ Upload button (top right)
- ✅ Notifications bell with badge
- ✅ User avatar with dropdown
- ✅ Click avatar to see dropdown menu

#### 3. **Test Admin Panel**

If logged in as admin:

- Click on the shield icon or dropdown → Admin Panel
- Navigate to:
  - Analytics
  - Manage Users
  - **Register Students** (NEW)
  - **Register Faculty** (NEW)
  - Resource Approvals
  - Flagged Content

---

## 🎨 Navbar Features Explained

### 1. **Upload Button**

- Visible only to authenticated users
- Quick access to upload resources
- Responsive design (hidden on mobile, shown on desktop)

### 2. **Notifications Bell**

- Shows notification count badge
- Red pulsing badge for unread notifications
- Links to notifications page
- TODO: Connect to real-time notifications API

### 3. **User Dropdown Menu**

- Click on user avatar to open
- Shows user name, email, and role
- Quick links to:
  - Dashboard
  - Admin Panel (admins only)
  - Settings
  - Sign Out

### 4. **Mobile Navigation**

- Hamburger menu for mobile devices
- Full-screen overlay menu
- Includes all navigation links
- Upload and Dashboard links for authenticated users

---

## 🔧 Troubleshooting

### Database Connection Issues

**Error: "Can't reach database server"**

Solution:

1. Make sure PostgreSQL is running
2. Check your DATABASE_URL in `.env`
3. Verify database exists: `psql -U postgres -l`

**Error: "Schema not found"**

Solution:

```bash
npx prisma db push --force-reset
npx prisma db seed
```

### Prisma Client Issues

**Error: "Prisma Client not generated"**

Solution:

```bash
npx prisma generate
```

### Seed Issues

**Error: "bcryptjs not found"**

Solution:

```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

---

## 📊 Database Schema Overview

### Tables Created:

1. **User** - Stores all users (students, faculty, admins)
2. **Role** - User roles (Student, Faculty, Admin, SuperAdmin)
3. **Design_stage** - Design stages for resources
4. **Resource** - Uploaded resources/files
5. **Comment** - Comments on resources
6. **Rating** - Resource ratings
7. **Flag** - Flagged content reports
8. **Notification** - User notifications

### Relationships:

- User → Role (many-to-one)
- Resource → User (uploader)
- Resource → Design_stage
- Comment → User & Resource
- Rating → User & Resource
- Flag → Resource & User (resolver)
- Notification → User & Resource

---

## 🎯 Next Steps

### Recommended Enhancements:

1. **Real-time Notifications**

   - Connect notifications bell to API
   - Add WebSocket for real-time updates
   - Mark notifications as read

2. **User Profile Pictures**

   - Add avatar upload functionality
   - Display user avatars in navbar
   - Use initials as fallback

3. **Search Functionality**

   - Connect navbar search to browse page
   - Add autocomplete suggestions
   - Recent searches

4. **Theme Toggle**

   - Add dark mode support
   - Save user preference
   - Smooth transitions

5. **Advanced Filters**
   - Quick filter buttons in navbar
   - Save filter presets
   - Recent filters

---

## 📝 Sample Data

After seeding, you'll have:

### Users:

| Email              | Password   | Role    |
| ------------------ | ---------- | ------- |
| admin@archit.edu   | admin123   | Admin   |
| faculty@archit.edu | faculty123 | Faculty |
| student@archit.edu | student123 | Student |

### Roles:

- Student
- Faculty
- Admin
- SuperAdmin

### Design Stages:

- Architectural Design I
- Architectural Design II
- Architectural Design III
- Integrated Design I
- Integrated Design II
- Integrated Design III
- Thesis Project

---

## 🔐 Security Notes

1. **Change Default Passwords**: The seed creates users with default passwords. Change these in production!

2. **Environment Variables**: Never commit `.env` file to version control

3. **JWT Secret**: Use a strong, random JWT_SECRET in production

4. **Database Credentials**: Use strong passwords for database users

5. **HTTPS**: Always use HTTPS in production

---

## 📚 Useful Commands

### Prisma Commands:

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Push schema (no migration)
npx prisma db push

# Reset database
npx prisma migrate reset

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio

# Format schema file
npx prisma format
```

### Development:

```bash
# Start backend
cd app/server && npm run dev

# Start frontend
cd app/client && npm run dev

# Install dependencies
npm install

# Build for production
npm run build
```

---

## ✅ Checklist

Before deploying, make sure:

- [ ] Database is created and accessible
- [ ] `.env` file is configured correctly
- [ ] Prisma Client is generated
- [ ] Migrations are applied
- [ ] Database is seeded
- [ ] Backend server starts without errors
- [ ] Frontend client starts without errors
- [ ] Can login with sample users
- [ ] Navbar features work correctly
- [ ] Admin panel is accessible
- [ ] Upload functionality works
- [ ] Notifications display correctly

---

## 🎉 Success!

If you've followed all steps, you should now have:
✅ A fully configured database
✅ Sample data for testing
✅ Enhanced navbar with modern UI
✅ Working authentication system
✅ Admin panel with new features
✅ Upload and notification features

**Happy coding! 🚀**
