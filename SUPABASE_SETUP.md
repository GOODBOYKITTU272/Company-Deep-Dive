# ✅ SUPABASE CLI SUCCESSFULLY LINKED!

## 🎉 Your Supabase project is now connected!

**Project:** molwtyvcjwtxubcahijx

---

## 🔑 Get Your Database URL (3 Methods)

### **Method 1: Via Web Dashboard (Recommended - Fastest)**

1. Go to: **https://supabase.com/dashboard/project/molwtyvcjwtxubcahijx/settings/database**

2. Scroll down to **"Connection string"** section

3. Click the **"URI"** tab

4. You'll see something like:
   ```
   postgresql://postgres.molwtyvcjwtxubcahijx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

5. **Copy this entire string** and paste it into `.env.local`

---

### **Method 2: Using Supabase CLI (Alternative)**

Since you're linked, run this command to view your project settings:

```bash
supabase projects list
```

Then manually construct the URL:
```
postgresql://postgres.molwtyvcjwtxubcahijx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

### **Method 3: Check Your Email**

When you created the Supabase project, you received an email with the database password. Search for "Supabase" in your inbox.

---

## 📝 **Add to `.env.local` Now**

**File:** `c:\Users\DELL\Downloads\Optimize Figma AI Prompts\.env.local`

**Add this:**
```env
# Supabase Database Connection
DATABASE_URL=postgresql://postgres.molwtyvcjwtxubcahijx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Environment
NODE_ENV=development
```

**Replace `[YOUR-PASSWORD]`** with your actual database password!

---

## 🔄 **If You Don't Know Your Password**

**Reset it:**

1. Go to: https://supabase.com/dashboard/project/molwtyvcjwtxubcahijx/settings/database
2. Scroll to **"Database password"**
3. Click **"Reset database password"**
4. Enter a new password (e.g., `MyNewPassword123!`)
5. Copy the new connection string
6. Paste into `.env.local`

---

## ✅ **Test Your Connection**

After adding `DATABASE_URL` to `.env.local`:

1. **Restart your dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Test the API:**
   ```bash
   curl http://localhost:5173/api/command-center?date=2026-01-31
   ```

3. **Expected:** JSON data with job statistics
   **Error:** "Connection timeout" = wrong password

---

## 🚀 **Next Steps**

1. ✅ Supabase CLI linked
2. 🔲 Get database password from dashboard
3. 🔲 Add `DATABASE_URL` to `.env.local`
4. 🔲 Restart dev server
5. 🔲 Test API endpoints
6. 🔲 Start migration!

**Go to the dashboard now and grab that connection string!** 👇

**https://supabase.com/dashboard/project/molwtyvcjwtxubcahijx/settings/database**
