---
description: how to manage user roles and hierarchy
---

# User Role Management Workflow

This system employs a hierarchical Role-Based Access Control (RBAC) model. Below are the steps to manage the hierarchy.

## 1. System Developer (Super Admin)

**Access:** `/super-admin`

### Super Admin Responsibilities

- **Authority Architecture:** Deploy and revoke `Department Head` nodes.
- **System Oversight:** Monitor global analytics and subsystem integrity.
- **Master Override:** Access all `Admin` and `User` layer functionalities.

### Granting Authority

1. Navigate to the **Super Architect Console** (via user menu).
2. Select **Appoint Dept Head**.
3. Input the identity credentials (First Name, Last Name, Email, Access Key).
4. The node is immediately integrated into the authority matrix.

## 2. Department Head

**Access:** `/admin`

### Dept Head Responsibilities

- **Unit Initialization:** Authorized to initialize `Admin`, `Faculty`, and `Student` nodes.
- **Quota Protocol:** Ensuring at least 3 users are assigned across sub-roles (Admin, Faculty, Student).
- **Resource Management:** Approve/Reject departmental assets.

### Initializing Units

1. Navigate to the **Admin Command Center**.
2. Go to **Manage Users** -> **Initialize Node**.
3. Select the target role (limited to Admin, Faculty, Student).
4. Deploy the configuration.

## 3. Role Hierarchy & Constraints

- **Super Admin** -> Can create `Department Head`, `Admin`, `Faculty`, `Student`.
- **Department Head** -> Can create `Admin`, `Faculty`, `Student`.
- **Admin** -> Can create `Faculty`, `Student`.

// turbo 3. Verify database roles

```powershell
npx prisma studio
```
