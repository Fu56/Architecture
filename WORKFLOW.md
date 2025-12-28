# Digital Library - User Registration & Resource Management Workflow

## Overview

This document describes the complete workflow for user registration and resource management in the Digital Library system.

## User Registration

### 1. Student Registration (Bulk via Excel)

**Admin Process:**

1. Navigate to **Admin Dashboard** → **Register Students**
2. Download the CSV template by clicking "Download Template"
3. Fill in student information in the template:
   - first_name
   - last_name
   - email
   - batch (optional)
   - year (optional)
4. Upload the filled CSV file
5. System validates the data and shows preview
6. Click "Register Students" to complete registration

**Backend Process:**

- Endpoint: `POST /admin/users/bulk-register`
- Validates each student record
- Checks for duplicate emails
- Generates random passwords for each student
- Creates user accounts with "Student" role
- Returns success/failure count

**Important Notes:**

- Default passwords are generated automatically (format: `Student####`)
- Passwords are logged to console (TODO: implement email notification)
- Duplicate emails are skipped with error message

### 2. Faculty Registration (Individual via Form)

**Admin Process:**

1. Navigate to **Admin Dashboard** → **Register Faculty**
2. Fill in the registration form:
   - First Name \*
   - Last Name \*
   - Email \*
   - Password \* (can use "Generate" button)
   - Department (optional)
   - Specialization (optional)
3. Click "Register Faculty"

**Backend Process:**

- Endpoint: `POST /admin/users/register-faculty`
- Validates required fields
- Checks for duplicate email
- Hashes password securely
- Creates user account with "Faculty" role
- Returns success confirmation

## Resource Upload & Approval Workflow

### 1. Student/Faculty Uploads Resource

**User Process:**

1. Navigate to **Upload** page
2. Fill in resource details:
   - Title
   - Author
   - Keywords
   - Year/Batch
   - Design Stage
   - File upload
3. Submit the resource

**Backend Process:**

- Resource is created with status: `"pending"`
- Stored in database with uploader information
- Awaits admin approval

### 2. Admin Reviews Resources

**Admin Process:**

1. Navigate to **Admin Dashboard** → **Resource Approvals**
2. View list of pending resources
3. For each resource:
   - Click "Review" to download/view the file
   - Click "Approve" to approve the resource
   - Click "Reject" to reject the resource

**Backend Process - Approval:**

- Endpoint: `PATCH /admin/resources/:id/approve`
- Updates resource status to `"approved"`
- Sets `approved_at` timestamp
- Creates notification for uploader
- Resource becomes visible to all users

**Backend Process - Rejection:**

- Endpoint: `PATCH /admin/resources/:id/reject`
- Updates resource status to `"rejected"`
- Sets `rejected_at` timestamp
- Creates notification for uploader with reason
- Resource remains hidden from users

### 3. Approved Resources Visibility

**After Approval:**

- Resource appears in **Browse** page
- Searchable by all users
- Available for download
- Can be rated and commented on
- Appears in analytics

## Resource Status Flow

```
Upload → pending → (Admin Review) → approved/rejected
                                   ↓
                          (If approved) → visible to all users
                                   ↓
                          (If rejected) → hidden, uploader notified
```

## Admin Dashboard Navigation

The admin dashboard includes the following sections:

1. **Analytics** - System statistics and metrics
2. **Manage Users** - View and manage all users
3. **Register Students** - Bulk student registration via Excel
4. **Register Faculty** - Individual faculty registration
5. **Resource Approvals** - Review and approve/reject uploaded resources
6. **Flagged Content** - Review flagged resources

## API Endpoints Summary

### Admin - User Registration

- `POST /admin/users/bulk-register` - Bulk register students
- `POST /admin/users/register-faculty` - Register individual faculty

### Admin - Resource Management

- `GET /admin/resources/pending` - Get all pending resources
- `PATCH /admin/resources/:id/approve` - Approve a resource
- `PATCH /admin/resources/:id/reject` - Reject a resource
- `PATCH /admin/resources/:id/archive` - Archive a resource

### Admin - User Management

- `GET /admin/users` - Get all users
- `PATCH /admin/users/:id/role` - Update user role

### Admin - Flags

- `GET /admin/flags` - Get all flagged content
- `PATCH /admin/flags/:id/resolve` - Resolve a flag

## Database Schema

### User Table

- id, first_name, last_name, email, password
- roleId (links to Role table)
- status (active/inactive)
- created_at, updated_at

### Resource Table

- id, title, author, keywords, forYearStudents, batch
- file_path, file_type, file_size
- uploader_id (links to User)
- design_stage_id (links to Design_stage)
- status (pending/approved/rejected)
- uploaded_at, approved_at, rejected_at, archived_at
- download_count, flag, priority_tag

### Role Table

- id, name (Student, Faculty, Admin, SuperAdmin)
- created_at, updated_at

## Future Enhancements

1. **Email Notifications**
   - Send credentials to newly registered students
   - Notify users when resources are approved/rejected
2. **Batch Management**
   - Track student batches and years
   - Filter resources by batch
3. **Faculty Profiles**
   - Store department and specialization in separate table
   - Faculty profile pages
4. **Advanced Analytics**
   - Track upload trends
   - Popular resources
   - User engagement metrics

## Security Considerations

1. All admin routes require authentication and admin role
2. Passwords are hashed using bcrypt
3. File uploads are validated and sanitized
4. Email uniqueness is enforced
5. Role-based access control (RBAC) is implemented
