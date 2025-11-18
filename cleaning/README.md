## 🧹 Data Cleaning & Preprocessing (Summary)

### **Stack Overflow Survey Cleaning**
- Unified experience fields into a numeric `experience_years`
- Normalized salary values and currencies
- Extracted structured skill lists from multi-value strings (`;` separated)
- Classified remote mode into: `In-person`, `Hybrid`, `Fully remote`
- Standardized AI sentiment & AI threat categories
- Removed rows with completely missing core attributes

### **LinkedIn Job Postings Cleaning**
Performed chunk-based (20k rows per chunk) processing due to 500MB+ raw size.

Key steps:
- Parsed `listed_time` → created `job_year`
- Extracted country from `location` → `job_country`
- Normalized salaries (`normalized_salary` → `salary`)
- Classified job family using keyword rules: SWE / DS / ML / AI / Backend / Frontend / Other
- Bucketed experience levels into: `0–2`, `1–3`, `3–7`, `5–10`, `10+`
- Identified AI-related roles using keyword scanning (`gpt`, `ml`, `llm`, `deep learning`, etc.)
- Removed large text-only fields (e.g., job descriptions, URLs) to reduce dataset size from 500MB → 30MB

The full cleaning scripts are included in `/data_cleaning/`.

---
