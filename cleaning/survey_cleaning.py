import pandas as pd

# Load raw Stack Overflow survey data
df = pd.read_csv("survey_raw.csv")

# --- Select only the useful columns for the project ---
columns = [
    "survey_year",
    "response_id",
    "country",
    "job_role",
    "experience_years",
    "education",
    "industry",
    "company_size",
    "org_size",
    "remote_mode",
    "ai_usage",
    "ai_is_threat",
    "ai_concerns",
    "ai_sentiment",
    "salary",
    "currency",
    "job_satisfaction",
    "age",
    "language_have_worked_with",
    "platform_have_worked_with"
]
df = df[columns]

# --- Normalize salary column: remove non-numeric and convert types ---
df["salary"] = pd.to_numeric(df["salary"], errors="coerce")

# --- Clean blank strings and convert to None ---
df = df.replace("", pd.NA)

# --- Standardize remote mode values (example cleanup) ---
df["remote_mode"] = df["remote_mode"].str.strip()

# --- Save cleaned file ---
df.to_csv("survey_clean.csv", index=False)
print("Saved survey_clean.csv")
