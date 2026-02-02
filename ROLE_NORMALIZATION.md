# Enhanced API with Role Normalization

## New Table: `karmafy_jobrole`

The `karmafy_jobrole` table provides **intelligent role categorization** by mapping various job titles to standardized role families.

### Table Structure
```sql
karmafy_jobrole:
├── id                      - Primary key
├── name                    - Standard role name (e.g., "Software Engineer")
├── alternate_roles         - Comma-separated alternatives (e.g., "Backend Developer, Full Stack Engineer")
├── keywords                - Role-specific keywords for matching
└── jobTitlesToApplyFor     - Specific job titles that belong to this role
```

---

## 🆕 New API Endpoints

### 1. **Roles API** - `GET /api/roles`
Get all defined job roles with current job counts.

**Query Parameters:**
- `date` (optional) - Target date. Defaults to today.

**Example Request:**
```
GET /api/roles?date=2026-01-31
```

**Response:**
```json
{
  "roles": [
    {
      "roleName": "Software Engineer",
      "alternateRoles": ["Backend Developer", "Full Stack Engineer", "Frontend Developer"],
      "keywords": ["javascript", "python", "react", "node.js"],
      "jobTitlesToApplyFor": ["Software Engineer", "Software Developer"],
      "totalJobs": 1247,
      "jobsToday": 142,
      "jobs7d": 856
    }
  ],
  "metadata": {
    "date": "2026-01-31",
    "totalRoles": 24,
    "activeRoles": 18
  }
}
```

---

### 2. **Job Listings (Normalized)** - `GET /api/job-listings-normalized`
Enhanced job listings that automatically group similar job titles.

**What's Different:**
- Automatically maps "Backend Engineer", "Backend Developer", "Backend Software Engineer" → "Software Engineer"
- Cleaner role grouping in the sidebar
- More accurate job counts per role family

**Query Parameters:**
Same as `/api/job-listings`

**Example Request:**
```
GET /api/job-listings-normalized?date=2026-01-31
```

**Response:**
```json
{
  "Software Engineer": {
    "count": 145,
    "jobs": [
      {
        "id": 12345,
        "job_title": "Senior Backend Engineer",
        "company_name": "Microsoft",
        ...
      },
      {
        "id": 12346,
        "job_title": "Full Stack Developer",
        "company_name": "Google",
        ...
      }
    ]
  },
  "Product Manager": {
    "count": 42,
    "jobs": [...]
  }
}
```

---

## 💡 Use Cases

### 1. **Cleaner Job Listings Sidebar**
Instead of:
```
- Backend Engineer (23)
- Backend Developer (19)
- Senior Backend Engineer (12)
- Full Stack Engineer (31)
```

You get:
```
- Software Engineer (85)
- Product Manager (42)
- Data Scientist (28)
```

### 2. **Better Role Demand Radar**
Aggregate demand for **role families** instead of individual titles:
```javascript
// Use /api/roles to get normalized role counts
const response = await fetch('/api/roles?date=2026-01-31');
const { roles } = await response.json();

// Chart the top role families
const chartData = roles.map(r => ({
  role: r.roleName,
  demand: r.jobs7d
}));
```

### 3. **Intelligent Search**
Users can search for "developer" and automatically catch:
- Software Developer
- Backend Developer
- Full Stack Developer
- Frontend Developer

---

## 🔧 Setup

### 1. Add Indexes
```bash
psql -f database-indexes-jobrole.sql "postgresql://your-connection-string"
```

### 2. Populate Role Data (Example)
```sql
INSERT INTO karmafy_jobrole (name, alternate_roles, keywords, "createdAt", "updatedAt")
VALUES 
  ('Software Engineer', 'Backend Developer,Frontend Developer,Full Stack Engineer,Software Developer', 'javascript,python,react,node,java', NOW(), NOW()),
  ('Product Manager', 'Product Owner,Senior PM,Technical PM', 'product,roadmap,stakeholder', NOW(), NOW()),
  ('Data Scientist', 'ML Engineer,AI Engineer,Data Analyst', 'python,tensorflow,machine learning,sql', NOW(), NOW());
```

### 3. Test the APIs
```bash
# Get all roles with job counts
curl http://localhost:3000/api/roles

# Get normalized job listings
curl http://localhost:3000/api/job-listings-normalized?date=2026-01-31
```

---

## 📊 Comparison: Before vs After

### Before (Without Role Normalization)
```json
{
  "Backend Engineer": { "count": 23, "jobs": [...] },
  "Backend Developer": { "count": 19, "jobs": [...] },
  "Senior Backend Engineer": { "count": 12, "jobs": [...] },
  "Full Stack Engineer": { "count": 31, "jobs": [...] }
}
```
**Result:** Fragmented data, hard to analyze trends

### After (With Role Normalization)
```json
{
  "Software Engineer": { "count": 85, "jobs": [...] }
}
```
**Result:** Clean, actionable insights

---

## 🎯 Recommendations

### For Job Listings Tab
Use `/api/job-listings-normalized` instead of `/api/job-listings` for:
- ✅ Cleaner sidebar navigation
- ✅ More accurate job counts
- ✅ Better user experience

### For Command Center & Heatmap
Continue using existing APIs - they work great as-is!

### For Role Demand Radar
**NEW!** Use `/api/roles` to get standardized role families with accurate demand metrics.

---

## 🔍 Query Logic

The normalization works by:

1. **Exact Match**: Check if job title contains the role name
2. **Alternate Match**: Check against `alternate_roles` field
3. **Keyword Match**: Use keywords for fuzzy matching (future enhancement)
4. **Fallback**: If no match, use original job title

Example:
```
Job Title: "Senior Backend Software Engineer"
→ Matches "Software Engineer" (exact substring match)
→ Normalized to: "Software Engineer"
```

---

## 📁 New Files Created

1. `api/roles.js` - Roles metadata API
2. `api/job-listings-normalized.js` - Enhanced job listings with normalization
3. `database-indexes-jobrole.sql` - Performance indexes for role table

---

**Your role categorization is now production-ready!** 🎉
