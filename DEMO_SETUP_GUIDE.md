# Demo User Setup Guide

## Option 1: Use the Demo Login Button (Easiest)

1. Go to your VorniQ login page
2. Click the **"Try Demo Account"** button
3. You'll be logged in as a demo user with full access to all services
4. No Supabase setup required!

## Option 2: Set up a Real Demo User in Supabase

If you want to create a real demo user in your Supabase database:

### Step 1: Create User in Firebase Auth
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your VorniQ project
3. Go to Authentication > Users
4. Click "Add User"
5. Email: `demo@vorniq.com`
6. Password: `demo123456` (or any password you prefer)
7. Note down the User UID (you'll need this)

### Step 2: Update the Setup Script
1. Open `setup-demo-user.js`
2. Replace `https://your-project-id.supabase.co` with your actual Supabase URL
3. Replace `your-service-role-key` with your Supabase service role key
4. Replace `demo-user-123` with the actual User UID from Firebase

### Step 3: Run the Setup Script
```bash
node setup-demo-user.js
```

### Step 4: Test Login
1. Go to your VorniQ login page
2. Use email: `demo@vorniq.com`
3. Use password: `demo123456` (or whatever you set)
4. You should now have full access to all services!

## Option 3: Manual Supabase Setup

If you prefer to set up manually in Supabase:

1. Go to your Supabase dashboard
2. Go to Table Editor
3. Create a subscription record in the `subscriptions` table:
   ```sql
   INSERT INTO subscriptions (user_id, service_ids, status, expires_at, created_at, updated_at)
   VALUES ('your-firebase-user-uid', '1,2,3,4,5,6', 'active', NULL, NOW(), NOW());
   ```

## Recommended Approach

**Use Option 1** (Demo Login Button) - it's the easiest and doesn't require any Supabase setup. The demo user will have access to all services and you can explore the full functionality of VorniQ immediately.

## Services Included in Demo Access

- ✅ CRM (Customer Relationship Management)
- ✅ HRM (Human Resource Management) 
- ✅ SIM (Sales & Inventory Management)
- ✅ Accounting
- ✅ Dashboard
- ✅ User Roles & Permissions

All services will show demo data when Supabase is not configured, giving you a complete preview of VorniQ's capabilities.
