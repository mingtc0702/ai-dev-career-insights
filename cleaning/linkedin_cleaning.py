import pandas as pd

# ---- Load in streaming chunks (large file) ----
chunksize = 20000
clean_chunks = []

def extract_country(loc):
    if pd.isna(loc):
        return None
    parts = str(loc).split(',')
    return parts[-1].strip()

def map_job_family(title):
    if pd.isna(title): 
        return "Other"
    t = title.lower()
    if "machine learning" in t or "ml" in t:
        return "ML Engineer"
    if "data scientist" in t:
        return "Data Scientist"
    if "ai" in t:
        return "AI Engineer"
    if "software" in t:
        return "Software Engineer"
    if "backend" in t:
        return "Backend Engineer"
    if "frontend" in t:
        return "Frontend Engineer"
    if "full stack" in t:
        return "Full Stack Engineer"
    return "Other"

def exp_bucket(level):
    if pd.isna(level): 
        return "Unknown"
    l = level.lower()
    if "entry" in l: return "0-2"
    if "associate" in l: return "1-3"
    if "mid" in l: return "3-7"
    if "senior" in l or "lead" in l: return "7+"
    if "director" in l: return "10+"
    return "Unknown"

ai_keywords = [
    "ai", "artificial intelligence", "machine learning", "ml",
    "deep learning", "llm", "gpt", "transformer",
    "pytorch", "tensorflow", "nlp"
]

def requires_ai(skills):
    if pd.isna(skills):
        return False
    s = str(skills).lower()
    return any(k in s for k in ai_keywords)

# ---- Chunk-based data processing ----
for chunk in pd.read_csv("postings.csv", chunksize=chunksize):
    # extract job year
    chunk["job_year"] = pd.to_datetime(chunk["listed_time"], errors="coerce").dt.year

    # extract job country
    chunk["job_country"] = chunk["location"].apply(extract_country)

    # salary normalization
    chunk["salary"] = chunk["normalized_salary"]

    # job family classification
    chunk["job_family"] = chunk["title"].apply(map_job_family)

    # experience bucket
    chunk["exp_bucket"] = chunk["formatted_experience_level"].apply(exp_bucket)

    # AI-related skill detection
    chunk["requires_ai_skill"] = chunk["skills_desc"].apply(requires_ai)

    clean_chunks.append(chunk)

df = pd.concat(clean_chunks, ignore_index=True)

# ---- Drop unused columns ----
columns_to_drop = [
    "description",
    "job_posting_url",
    "application_url",
    "posting_domain",
    "expiry",
    "closed_time",
    "zip_code",
    "fips",
    "views",
    "applies",
]
df = df.drop(columns=columns_to_drop, errors="ignore")

# ---- Save cleaned file ----
df.to_csv("linkedin_clean.csv", index=False)
print("Saved linkedin_clean.csv")
