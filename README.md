# 🧠 StackJobs: Analyzing Developer Survey Trends & Real-World Job Market Signals  

StackJobs integrates two large-scale datasets — **Stack Overflow Developer Survey** and **LinkedIn Job Postings** — to explore how developer sentiment, skills, and experience align with real hiring demand in the job market.  
Our project builds a fully relational database on AWS RDS, performs entity resolution, and produces analytical SQL queries (including multi-table, high-complexity queries optimized for performance).

---

## 📌 Project Overview

Modern tech hiring is evolving rapidly due to AI adoption, remote work shifts, and skill specialization.  
This project examines **whether developers’ self-reported behavior** (skills, experience, AI sentiment) matches the **actual structure of real job postings**.

We ask questions like:

- Do developers with certain experience ranges face more or fewer job opportunities?
- Is AI skill demand growing, and does developer sentiment reflect this?
- How do salary expectations compare to job postings across different job families?
- Which skills/platforms developers report using — do they align with employer demand?

---

## 📂 Dataset Summary

### **1. StackOverflow Developer Survey (Cleaned)**  
Contains anonymized developer-level information:

- `country`
- `job_role`
- `experience_years`
- `salary`
- `language_have_worked_with`
- `platform_have_worked_with`
- `ai_usage`, `ai_sentiment`, `ai_is_threat`
- `education`, `company_size`, `remote_mode`
- 24,000+ rows after cleaning

### **2. LinkedIn Job Postings (Cleaned)**  
Contains real job-market postings:

- `company_name`
- `title`
- `normalized_salary`
- `formatted_experience_level`
- `job_year`, `job_country`
- `job_family` (mapped: SWE / Data Scientist / AI Engineer / ML Eng / etc.)
- `exp_bucket` (experience buckets aligned with survey)
- `requires_ai_skill` (derived via keyword matching)
- 100,000+ rows after preprocessing (chunk-based cleaning)

Both datasets were cleaned to ensure consistent formats, compatible experience buckets, and normalized salary fields.

---


## 🏛️ Database Architecture (AWS RDS – PostgreSQL)

All tables were created and hosted on AWS RDS using PostgreSQL 14.

Main tables:

### `survey_responses`
Contains normalized survey respondent data.

### `linkedin_jobs`
Contains structured job posting attributes.

The schema ensures:
- Consistent experience bucket alignment  
- Comparable salary values  
- Compatible skill dimensions  
- Joinable country/year/job family attributes  

This lets us write meaningful multi-table analytical queries.

---

## 🧩 Entity Resolution Strategy

We aligned the two datasets using the following resolved dimensions:

| Common Dimension | Survey Field | LinkedIn Field | Notes |
|------------------|-------------|----------------|-------|
| **Experience** | experience_years | exp_bucket | Converted both to bucket ranges |
| **Country** | country | job_country | Extracted from LinkedIn location field |
| **Job Family** | job_role | job_family | Normalized using keyword matching |
| **AI Usage** | ai_usage / ai_sentiment | requires_ai_skill | Boolean skill recognition |

This ensures the ER diagram is **connected** and analytically meaningful.

---

## 👥 Team Members & Contributions

| Member | Contribution |
|--------|--------------|
| **Mingtian Chen** | Project Lead & Data/SQL Lead |
| **Shashank Kambhatla** | Frontend Lead & Web Dev |
| **Colin Taylor-McGrane** | Backend Dev & APIs |
| **Lingchong Hu** | Data Cleaning & Analytics |

All members contributed code via GitHub with visible commit history.

---


---

## 🚀 How to Run This Project Locally  

Running the full application requires starting both the **backend API** and the **frontend React app**.  
Follow the steps below to launch the project on your machine.

---

### 1️⃣ Start the Backend Server (Node.js + Express)

The backend provides all SQL-driven analytics via REST API.

```bash
cd server
npm install
npm start
Once started, the backend will be available at:

👉 http://localhost:3001

Make sure your PostgreSQL credentials are correctly configured in:

bash
Copy code
server/config.js
The backend must be running before the frontend can load graphs.

2️⃣ Start the Frontend Client (React + Recharts)
Open a new terminal window and run:

bash
Copy code
cd client
npm install
npm start
Your browser should automatically open:

👉 http://localhost:3000


With both server and client running, the full dashboard and analytics suite will be available locally. 🎉
