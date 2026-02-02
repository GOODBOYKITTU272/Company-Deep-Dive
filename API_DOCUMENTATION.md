# 🚀 Backend API Documentation

## Overview
This project includes 4 optimized Vercel serverless API endpoints that connect to your PostgreSQL database and serve pre-computed data for the dashboard.

All calculations (scores, trends, aggregations) happen **server-side** for maximum frontend performance.

---

## 📋 API Endpoints

### 1. **Command Center** - `GET /api/command-center`
**Purpose:** High-level overview metrics and global trends

**Query Parameters:**
- `date` (optional) - Target date in `YYYY-MM-DD` format. Defaults to today.

**Example Request:**
```
GET /api/command-center?date=2026-01-31
```

**Response:**
```json
{
  "stats": {
    "totalActiveJobs": 1284,
    "uniqueCompanies": 156,
    "highIntentCompaniesCount": 32,
    "jobsPostedToday": 142,
    "wowGrowth": 12.4
  },
  "globalTrend": [
    { "date": "2026-01-25", "jobs": 1100 },
    { "date": "2026-01-31", "jobs": 1284 }
  ],
  "topHiringCompanies": [
    {
      "name": "Microsoft",
      "activeJobs": 87,
      "hiringScore": 94,
      "intentScore": 88,
      "momentum": "strong"
    }
  ]
}
```

---

### 2. **Job Listings** - `GET /api/job-listings`
**Purpose:** Paginated list of job postings with filtering

**Query Parameters:**
- `date` (optional) - Target date. Defaults to today.
- `role` (optional) - Filter by job title (partial match)
- `company` (optional) - Filter by company name (partial match)
- `location` (optional) - Filter by location (partial match)
- `page` (optional) - Page number. Default: 1
- `limit` (optional) - Items per page. Default: 50
- `groupByRole` (optional) - Group results by role. Default: true

**Example Requests:**
```
GET /api/job-listings?date=2026-01-31&groupByRole=true
GET /api/job-listings?role=Software+Engineer&company=Microsoft&page=1&limit=20
```

**Response (Grouped):**
```json
{
  "Software Engineer": {
    "count": 45,
    "jobs": [
      {
        "id": 12345,
        "job_title": "Senior Backend Engineer",
        "company_name": "Microsoft",
        "location": "Redmond, WA",
        "posted_date": "2026-01-31T10:00:00Z",
        "experience_required": "5-7",
        "job_url": "https://...",
        "salary": "$150k-$200k",
        "work_type": "Remote"
      }
    ]
  }
}
```

**Response (Paginated):**
```json
{
  "jobs": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1284,
    "totalPages": 26
  }
}
```

---

### 3. **Company Heatmap** - `GET /api/company-heatmap`
**Purpose:** Ranked list of companies with hiring scores

**Query Parameters:**
- `date` (optional) - Target date. Defaults to today.
- `limit` (optional) - Number of companies to return. Default: 50

**Example Request:**
```
GET /api/company-heatmap?date=2026-01-31&limit=100
```

**Response:**
```json
{
  "companies": [
    {
      "companyName": "Google",
      "hiringScore": 88,
      "intentScore": 85,
      "totalJobs7d": 142,
      "jobsPosted24h": 28,
      "momentum": "strong",
      "trend": "up",
      "dominantRole": "Software Engineer",
      "growthPercentage": 18.5
    }
  ],
  "metadata": {
    "date": "2026-01-31",
    "totalCompanies": 50,
    "industryMax": 234
  }
}
```

---

### 4. **Company Deep Dive** - `GET /api/company-deep-dive`
**Purpose:** Detailed analysis of a single company

**Query Parameters:**
- `company` (**required**) - Company name (case-insensitive)
- `date` (optional) - Target date. Defaults to today.

**Example Request:**
```
GET /api/company-deep-dive?company=Microsoft&date=2026-01-31
```

**Response:**
```json
{
  "metadata": {
    "name": "Microsoft",
    "industry": "Technology • Enterprise Software",
    "score": 94,
    "intentScore": 88,
    "momentum": "strong"
  },
  "hiringTrend": [
    { "date": "01-25", "jobs": 71 },
    { "date": "01-31", "jobs": 87 }
  ],
  "seniorityDistribution": [
    {
      "role": "Software Engineer",
      "junior": 12,
      "mid": 28,
      "senior": 19
    }
  ],
  "locationDistribution": [
    { "location": "Seattle", "count": 34 },
    { "location": "Remote", "count": 21 }
  ],
  "intentSignals": [
    "87 roles posted in last 24h - active hiring window",
    "High hiring intent detected (score: 94)",
    "Strong hiring momentum - aggressive expansion"
  ]
}
```

---

## ⚙️ Setup Instructions

### 1. Install Dependencies
```bash
npm install pg
```

### 2. Configure Environment Variables
Create a `.env.local` file (or add to Vercel dashboard):
```env
DATABASE_URL=postgresql://applywizz_prod_user:password@host:5432/database
NODE_ENV=production
```

### 3. Deploy to Vercel
```bash
vercel --prod
```

The API endpoints will be available at:
- `https://yourdomain.com/api/command-center`
- `https://yourdomain.com/api/job-listings`
- `https://yourdomain.com/api/company-heatmap`
- `https://yourdomain.com/api/company-deep-dive`

---

## 🚀 Performance Features

### Edge Caching
All endpoints include `Cache-Control: s-maxage=300, stale-while-revalidate` headers.
- Responses are cached at Vercel's Edge for **5 minutes**
- Subsequent requests are served in **<50ms** from the edge
- Stale data can be served while revalidating in the background

### Connection Pooling
The `lib/db.js` utility reuses PostgreSQL connections across function invocations, reducing latency.

### Optimized Queries
- All SQL queries use indexes on `uploadDate`, `company`, and `datePosted`
- Aggregations happen in PostgreSQL, not in JavaScript
- Results are limited to only what's needed

---

## 📊 Scoring Algorithms

### Hiring Score (0-100)
Simple volume-based score:
```
hiringScore = min(100, (jobs_7d / 50) * 100)
```

### Intent Score (0-100)
Weighted formula:
```
intentScore = 0.4 * volumeScore
            + 0.3 * momentumScore
            + 0.2 * concentrationScore
            + 0.1 * freshnessScore
```

### Momentum Classification
- **Strong**: Recent activity significantly exceeds averages
- **Moderate**: Steady activity
- **Weak**: Below average activity

---

## 🔒 Security Notes

1. **SQL Injection Protection**: All queries use parameterized statements
2. **CORS**: Currently set to allow all origins (`*`). Update for production.
3. **Rate Limiting**: Consider adding Vercel's rate limiting if needed
4. **Database Credentials**: Store `DATABASE_URL` in Vercel's environment variables, never commit to git

---

## 🐛 Troubleshooting

### "Cannot find module 'pg'"
Run: `npm install pg`

### "Connection timeout"
Check your `DATABASE_URL` and ensure the database accepts connections from Vercel's IP ranges.

### "Too many connections"
The connection pool is limited to 10. For high traffic, consider using a connection pooler like PgBouncer.

### CORS Errors
Update the `Access-Control-Allow-Origin` header in each API file to your specific domain.

---

## 📈 Next Steps

1. **Add Indexes** to your database:
   ```sql
   CREATE INDEX idx_upload_date ON karmafy_job("uploadDate");
   CREATE INDEX idx_company ON karmafy_job(company);
   CREATE INDEX idx_date_posted ON karmafy_job("datePosted");
   ```

2. **Monitor Performance** using Vercel Analytics

3. **Add Authentication** if these APIs should not be public

4. **Implement Rate Limiting** to prevent abuse
